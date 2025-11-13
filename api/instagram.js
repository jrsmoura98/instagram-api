export default async function handler(req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ error: "username obrigatório" });
    }

    const url = "https://instagram-scraper-stable-api.p.rapidapi.com/ig_get_fb_profile.php";

    // 🚨 FORM-DATA da forma EXATA que a API exige
    const formBody = new URLSearchParams();
    formBody.append("username_or_url", username);
    formBody.append("data", "basic");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "instagram-scraper-stable-api.p.rapidapi.com"
      },
      body: formBody.toString()
    });

    const rawText = await response.text();

    // 🚨 Debug opcional (mostra o HTML caso a API não responda)
    if (!rawText.startsWith("{")) {
      return res.status(500).json({
        error: "Resposta inválida da API",
        raw: rawText.slice(0, 200)
      });
    }

    const data = JSON.parse(rawText);

    if (!data || !data.full_name) {
      return res.status(404).json({ error: "usuário não encontrado" });
    }

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
}
