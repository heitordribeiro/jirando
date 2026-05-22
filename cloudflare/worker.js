const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

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

async function ensureTables(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS access_totals (
      id TEXT PRIMARY KEY,
      total INTEGER NOT NULL DEFAULT 0,
      last_accessed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS access_pages (
      page TEXT PRIMARY KEY,
      total INTEGER NOT NULL DEFAULT 0,
      last_accessed_at TEXT
    );
  `);
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

  return {
    total: Number(totalRow?.total) || 0,
    pages: Object.fromEntries((pages.results || []).map((row) => [row.page, Number(row.total) || 0])),
    lastAccessedAt: totalRow?.last_accessed_at || null
  };
}

async function registerAccess(request, db) {
  await ensureTables(db);

  const body = await request.json().catch(() => ({}));
  const page = normalizePage(body.page);
  const now = new Date().toISOString();

  await db.batch([
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
  ]);

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
