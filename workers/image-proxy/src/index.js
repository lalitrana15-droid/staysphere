export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Only allow GET requests
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }

    // Build the Elivaas image URL from the path
    const imageUrl = `https://images.elivaas.com${url.pathname}`;

    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; StaysVacation/1.0)",
        Accept: "image/webp,image/avif,image/*,*/*",
      },
      cf: {
        // Cache at Cloudflare edge for 1 year
        cacheEverything: true,
        cacheTtl: 31536000,
      },
    });

    if (!response.ok) {
      return new Response("Image not found", { status: 404 });
    }

    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    headers.set("Access-Control-Allow-Origin", "*");
    // Hide that it's coming from Elivaas
    headers.delete("x-amz-cf-id");
    headers.delete("x-amz-cf-pop");
    headers.delete("x-amz-request-id");
    headers.delete("server");

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  },
};
