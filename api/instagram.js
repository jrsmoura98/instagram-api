const axios = require("axios");
const qs = require("qs");

module.exports = async function (req, res) {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ error: "username obrigatório" });
    }

    const url =
      "https://instagram-scraper-stable-api.p.rapidapi.com/ig_get_fb_profile.php";

    const headers = {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "instagram-scraper-stable-api.p.rapidapi.com",
      "Content-Type": "application/x-www-form-urlencoded"
    };

    const body = qs.stringify({
      username_or_url: username,
      data: "basic"
    });

    const response = await axios.post(url, body, { headers });

    return res.status(200).json(response.data);
  } catch (error) {
    console.log("ERRO REAL:", error?.response?.data || error.message);

    return res.status(500).json({
      error: "erro ao consultar instagram",
      detail: error?.response?.data || error.message
    });
  }
};
