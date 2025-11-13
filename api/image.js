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
      return res.status(400).json({
        error: "url obrigatória"
      });
    }

    // Baixa a imagem da CDN do Instagram (ou qualquer outra)
    const instagramResponse = await fetch(url);

    if (!instagramResponse.ok) {
      return res.status(400).json({
        error: "Não foi possível carregar a imagem do Instagram",
        status: instagramResponse.status
      });
    }

    // Converte a imagem para buffer
    const arrayBuffer = await instagramResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Define o tipo correto da imagem (jpeg, png, webp…)
    const contentType = instagramResponse.headers.get("content-type");
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    // Envia a imagem ao navegador (agora sem CORS)
    return res.status(200).send(buffer);

  } catch (error) {
    return res.status(500).json({
      error: "Erro ao gerar proxy da imagem",
      detail: error.message
    });
  }
}
