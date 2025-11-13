export default async function handler(req, res) {
  // ----- CORS -----
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  // -----------------

  try {
    const url = req.query.url;

    if (!url) {
      return res.status(400).json({ error: "url obrigatória" });
    }

    // Headers para simular navegador real (ESSENCIAL)
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Referer": "https://www.instagram.com/",
    };

    // Faz o request com spoofing completo
    const instagramResponse = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!instagramResponse.ok) {
      return res.status(instagramResponse.status).json({
        error: "Não foi possível carregar a imagem do Instagram",
        status: instagramResponse.status,
      });
    }

    const arrayBuffer = await instagramResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const contentType = instagramResponse.headers.get("content-type");
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    return res.status(200).send(buffer);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao gerar proxy da imagem",
      detail: error.message,
    });
  }
}
