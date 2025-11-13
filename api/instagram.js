import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ error: "username obrigatório" });
    }

    const url = "https://instagram-scraper-stable-api.p.rapidapi.com/ig_get_fb_profile.php";

    const params = new URLSearchParams();
    params.append("username_or_url", username);
    params.append("data", "basic");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "x-rapidapi-key": process.env.RAPID_KEY, 
        "x-rapidapi-host": "instagram-scraper-stable-api.p.rapidapi.com",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params
    });

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      error: "erro ao consultar instagram",
      detail: error.message
    });
  }
}
