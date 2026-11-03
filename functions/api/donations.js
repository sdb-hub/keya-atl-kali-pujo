// Public, read-only donation summary proxy.
// Keep both values in Cloudflare environment secrets; never expose the token in frontend code.
export async function onRequestGet({ env }) {
  const scriptUrl = env.APPS_SCRIPT_URL;
  const token = env.PUBLIC_API_TOKEN;

  if (!scriptUrl || !token) {
    return jsonResponse({
      configured: false,
      error: "Donation feed is not configured."
    }, 503);
  }

  try {
    const url = new URL(scriptUrl);
    url.searchParams.set("token", token);

    const upstream = await fetch(url.toString(), {
      method: "GET",
      redirect: "follow",
      headers: { "accept": "application/json" }
    });

    if (!upstream.ok) {
      return jsonResponse({
        configured: false,
        error: "Unable to retrieve donation details."
      }, 502);
    }

    const data = await upstream.json();

    if (!data || data.error || !Array.isArray(data.donations)) {
      return jsonResponse({
        configured: false,
        error: "Donation source returned an invalid response."
      }, 502);
    }

    return jsonResponse(data, 200, {
      "cache-control": "public, max-age=60, s-maxage=300"
    });
  } catch {
    return jsonResponse({
      configured: false,
      error: "Unable to retrieve donation details."
    }, 502);
  }
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...extraHeaders
    }
  });
}
