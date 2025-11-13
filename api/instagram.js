import fetch from "node-fetch";

module.exports = async function (req, res) {
  try {
    // CORS liberado
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ error: "username obrigatório" });
    }

    // URL da API NÃO oficial (funcionando em 2025)
    const url = `https://instagram-scraper-2022.p.rapidapi.com/ig/info_username/?user=${username}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "instagram-scraper-2022.p.rapidapi.com"
      }
    });

    const data = await response.json();

    // Se não vier usuário
    if (!data || !data.username) {
      return res.status(404).json({ error: "usuário não encontrado" });
    }

    // Resposta formatada
    return res.status(200).json({
      nome: data.full_name,
      imagem: data.hd_profile_pic_url_info?.url,
      seguidores: data.follower_count,
      seguindo: data.following_count,
      privado: data.is_private,
      verificado: data.is_verified,
      bio: data.biography
    });

  } catch (error) {
    return res.status(500).json({
      error: "erro ao consultar instagram",
      detail: error.message
    });
  }
};
