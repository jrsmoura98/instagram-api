module.exports = async function (req, res) {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ error: "username obrigatório" });
    }

    const url = `https://instagram-scraper-stable-api.p.rapidapi.com/ig_get_fb_profile_hover.php?username_or_url=${username}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "instagram-scraper-stable-api.p.rapidapi.com"
      }
    });

    // RapidAPI sempre retorna JSON (exceto erros de limite)
    const data = await response.json();

    return res.status(200).json({
      sucesso: true,
      data
    });
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      error: "erro ao consultar rapidapi",
      detail: error.message
    });
  }
};
