module.exports = async function (req, res) {
  // --- CORS FIX ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Responde imediatamente o preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  // --- FIM DO FIX ---

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
