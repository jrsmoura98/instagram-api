import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: "username obrigatório" });
    }

    const body = new URLSearchParams({
      username_or_url: username,
      data: "basic",
    });

    const response = await fetch(
      "https://instagram-scraper-stable-api.p.rapidapi.com/ig_get_fb_profile.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": "instagram-scraper-stable-api.p.rapidapi.com"
        },
        body: body.toString(),
      }
    );

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      return res.status(500).json({
        error: "Instagram devolveu resposta inválida",
        raw: text.slice(0, 200)
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      error: "erro no servidor",
      detail: error.message,
    });
  }
}
