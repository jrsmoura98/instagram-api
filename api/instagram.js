export default async function handler(req, res) {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ error: "username obrigatório" });
    }

    const url = `https://www.instagram.com/${username}/?__a=1&__d=dis`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const data = await response.json();
    const user = data?.graphql?.user;

    if (!user) {
      return res.status(404).json({ error: "usuário não encontrado" });
    }

    return res.status(200).json({
      nome: user.full_name,
      imagem: user.profile_pic_url_hd,
      seguidores: user.edge_followed_by.count,
      seguindo: user.edge_follow.count,
      privado: user.is_private,
      verificado: user.is_verified
    });

  } catch (error) {
    return res.status(500).json({
      error: "erro ao consultar instagram",
      detail: error.message
    });
  }
}
