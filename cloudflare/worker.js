const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
const ACCESS_WINDOW_MS = 24 * 60 * 60 * 1000;

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
  const pages = await db
    .prepare("SELECT page, total FROM access_pages ORDER BY page")
    .all();
  const visitors = await db
    .prepare(
      `SELECT ip, total, first_seen_at, last_seen_at, last_counted_at, last_page
       FROM access_visitors
       ORDER BY last_seen_at DESC`
    )
    .all();

  return {
    total: Number(totalRow?.total) || 0,
    pages: Object.fromEntries((pages.results || []).map((row) => [row.page, Number(row.total) || 0])),
    uniqueIps: visitors.results?.length || 0,
    visitors: (visitors.results || []).map((row) => ({
      ip: row.ip,
      total: Number(row.total) || 0,
      firstSeenAt: row.first_seen_at,
      lastSeenAt: row.last_seen_at,
      lastCountedAt: row.last_counted_at,
      lastPage: row.last_page
    })),
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
    ip,
    page,
    pageTotal: Number(pageRow?.total) || 0,
    lastAccessedAt: now
  };
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
    const isAccessFile = url.pathname === "/access-count.json";

    if (!isApiAccess && !isAccessFile) {
      return jsonResponse({ error: "Not found" }, 404);
    }

    try {
      if (request.method === "GET") {
        return jsonResponse(await readAccess(env.DB));
      }

      if (isApiAccess && request.method === "POST") {
        return jsonResponse(await registerAccess(request, env.DB));
      }

      return jsonResponse({ error: "Method not allowed" }, 405);
    } catch (error) {
      return jsonResponse({ error: error.message || "Access counter error" }, 500);
    }
  }
};
