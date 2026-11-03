// Public, read-only donation endpoint.
// Google Sheets credentials and spreadsheet ID must be stored as Cloudflare secrets.
// This endpoint intentionally returns no private data until the secure integration is configured.
export async function onRequestGet() {
  return new Response(JSON.stringify({
    donations: [],
    configured: false,
    message: "Public donation feed is not configured."
  }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=60, s-maxage=300"
    }
  });
}