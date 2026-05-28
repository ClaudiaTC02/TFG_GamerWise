import { getUserIdFromToken } from "../utils/auth.js";

export const gameRecommendations = async (req, res) => {
  const user_id = getUserIdFromToken(req);
  if (!user_id) return res.json(null);

  const { igdb_id, name, genre, platforms, company } = req.body;
  const data = { igdb_id: Number(igdb_id), name, genre, platforms, company };

  try {
    const response = await fetch("http://localhost:5000/recommend/hybrid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user_id, game_info: data })
    });
    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error("Error conectando con Flask:", error);
    res.status(500).send("Error en el servidor IA");
  }
};