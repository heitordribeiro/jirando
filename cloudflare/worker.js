const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
const ACCESS_WINDOW_MS = 24 * 60 * 60 * 1000;
const EMAILJS_API_URL = "https://api.emailjs.com/api/v1.0/email/send";

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: JSON_HEADERS
  });
}

function normalizePage(page) {
  if (typeof page !== "string") {
    return "/";
  }

  const cleanPage = page.split("?")[0].split("#")[0];
  return cleanPage.startsWith("/") ? cleanPage : `/${cleanPage}`;
}

function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("true-client-ip") ||
    (forwardedFor ? forwardedFor.split(",")[0].trim() : "") ||
    "unknown"
  );
}

function shouldCountAccess(visitor, nowMs) {
  if (!visitor?.last_counted_at) {
    return true;
  }

  const lastCountedMs = Date.parse(visitor.last_counted_at);
  return Number.isNaN(lastCountedMs) || nowMs - lastCountedMs >= ACCESS_WINDOW_MS;
}

async function ensureTables(db) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS access_totals (
      id TEXT PRIMARY KEY,
      total INTEGER NOT NULL DEFAULT 0,
      last_accessed_at TEXT
    )`
    )
    .run();

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS access_pages (
      page TEXT PRIMARY KEY,
      total INTEGER NOT NULL DEFAULT 0,
      last_accessed_at TEXT
    )`
    )
    .run();

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS access_visitors (
      ip TEXT PRIMARY KEY,
      total INTEGER NOT NULL DEFAULT 0,
      first_seen_at TEXT NOT NULL,
      last_seen_at TEXT NOT NULL,
      last_counted_at TEXT,
      last_page TEXT
    )`
    )
    .run();
}

async function readAccess(db) {
  await ensureTables(db);

  const totalRow = await db
    .prepare("SELECT total, last_accessed_at FROM access_totals WHERE id = ?")
    .bind("site")
    .first();
  return {
    total: Number(totalRow?.total) || 0,
    lastAccessedAt: totalRow?.last_accessed_at || null
  };
}

async function registerAccess(request, db) {
  await ensureTables(db);

  const body = await request.json().catch(() => ({}));
  const page = normalizePage(body.page);
  const now = new Date().toISOString();
  const nowMs = Date.parse(now);
  const ip = getClientIp(request);
  const visitor = await db
    .prepare("SELECT ip, total, last_counted_at FROM access_visitors WHERE ip = ?")
    .bind(ip)
    .first();
  const shouldCount = shouldCountAccess(visitor, nowMs);

  const statements = [
    db
      .prepare(
        `INSERT INTO access_visitors (ip, total, first_seen_at, last_seen_at, last_counted_at, last_page)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(ip) DO UPDATE SET
           total = total + excluded.total,
           last_seen_at = excluded.last_seen_at,
           last_counted_at = COALESCE(excluded.last_counted_at, access_visitors.last_counted_at),
           last_page = excluded.last_page`
      )
      .bind(ip, shouldCount ? 1 : 0, now, now, shouldCount ? now : null, page)
  ];

  if (shouldCount) {
    statements.push(
      db
        .prepare(
          `INSERT INTO access_totals (id, total, last_accessed_at)
           VALUES (?, 1, ?)
           ON CONFLICT(id) DO UPDATE SET
             total = total + 1,
             last_accessed_at = excluded.last_accessed_at`
        )
        .bind("site", now),
      db
        .prepare(
          `INSERT INTO access_pages (page, total, last_accessed_at)
           VALUES (?, 1, ?)
           ON CONFLICT(page) DO UPDATE SET
             total = total + 1,
             last_accessed_at = excluded.last_accessed_at`
        )
        .bind(page, now)
    );
  }

  await db.batch(statements);

  const totalRow = await db
    .prepare("SELECT total FROM access_totals WHERE id = ?")
    .bind("site")
    .first();
  const pageRow = await db
    .prepare("SELECT total FROM access_pages WHERE page = ?")
    .bind(page)
    .first();

  return {
    total: Number(totalRow?.total) || 0,
    counted: shouldCount,
    page,
    pageTotal: Number(pageRow?.total) || 0,
    lastAccessedAt: now
  };
}

function getRequiredEnv(env, key) {
  const value = env[key];

  if (!value) {
    throw new Error(`Missing Worker secret: ${key}`);
  }

  return value;
}

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

async function sendContactEmail(request, env) {
  const body = await request.json().catch(() => ({}));
  const name = cleanString(body.name);
  const email = cleanString(body.email);
  const phone = cleanString(body.phone);
  const message = cleanString(body.message);
  const page = normalizePage(body.page);

  if (!name || !email || !message) {
    return jsonResponse({ error: "Missing required contact fields" }, 400);
  }

  const emailResponse = await fetch(EMAILJS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: getRequiredEnv(env, "EMAILJS_SERVICE_ID"),
      template_id: getRequiredEnv(env, "EMAILJS_TEMPLATE_ID"),
      user_id: getRequiredEnv(env, "EMAILJS_PUBLIC_KEY"),
      template_params: {
        user_name: name,
        user_email: email,
        user_phone: phone,
        message,
        page
      }
    })
  });

  if (!emailResponse.ok) {
    return jsonResponse({ error: "Email service failed" }, 502);
  }

  return jsonResponse({ ok: true });
}

export default {
  async fetch(request, env) {
    if (!env.DB) {
      return jsonResponse({ error: "Missing D1 binding: DB" }, 500);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: JSON_HEADERS });
    }

    const url = new URL(request.url);
    const isApiAccess = url.pathname === "/api/access";
    const isApiContact = url.pathname === "/api/contact";
    const isAccessFile = url.pathname === "/access-count.json";

    if (!isApiAccess && !isApiContact && !isAccessFile) {
      return jsonResponse({ error: "Not found" }, 404);
    }

    try {
      if ((isApiAccess || isAccessFile) && request.method === "GET") {
        return jsonResponse(await readAccess(env.DB));
      }

      if (isApiAccess && request.method === "POST") {
        return jsonResponse(await registerAccess(request, env.DB));
      }

      if (isApiContact && request.method === "POST") {
        return await sendContactEmail(request, env);
      }

      return jsonResponse({ error: "Method not allowed" }, 405);
    } catch (error) {
      return jsonResponse({ error: error.message || "Access counter error" }, 500);
    }
  }
};
