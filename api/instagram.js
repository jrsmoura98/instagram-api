import fetch from "node-fetch";

module.exports = async function (req, res) {
  try {
    // CORS liberado
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ error: "username obrigatório" });
    }

    // Endpoint correto
    const url = "https://instagram-scraper-stable-api.p.rapidapi.com/ig_get_fb_profile.php";

    const formBody = new URLSearchParams({
      username_or_url: username,
      data: "basic"
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "instagram-scraper-stable-api.p.rapidapi.com"
      },
      body: formBody
    });

    const data = await response.json();

    // Se nada foi encontrado:
    if (!data || !data.full_name) {
      return res.status(404).json({ error: "usuário não encontrado" });
    }

    // Resposta formatada para FlutterFlow
    return res.status(200).json({
      nome: data.full_name,
      usuario: data.username,
      bio: data.biography,
      imagem: data.hd_profile_pic_url_info?.url,
      seguidores: data.follower_count,
      seguindo: data.following_count,
      privado: data.is_private,
      verificado: data.is_verified,
      categoria: data.category_name
    });

  } catch (error) {
    return res.status(500).json({
      error: "erro ao consultar instagram",
      detail: error.message
    });
  }
};
