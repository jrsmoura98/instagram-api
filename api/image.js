export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: "url obrigatória" });
    }

    // Baixa a imagem da CDN do Instagram
    const instagramResponse = await fetch(url);

    if (!instagramResponse.ok) {
      return res.status(400).json({
        error: "Não foi possível carregar a imagem do Instagram"
      });
    }

    // Converte para buffer
    const arrayBuffer = await instagramResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Replica cabeçalho correto
    res.setHeader("Content-Type", instagramResponse.headers.get("content-type"));

    return res.status(200).send(buffer);

  } catch (error) {
    return res.status(500).json({
      error: "Erro ao gerar proxy da imagem",
      detail: error.message
    });
  }
}
