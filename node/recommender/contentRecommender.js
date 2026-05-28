import { getAllGamesLogic } from "../logic/ListGameLogic.js";

export const listRecommendations = async (req, res) => {
  const { list_id } = req.params;
  const games = await getAllGamesLogic(list_id);
  if (!games.games) return res.json(null);

  const gameIds = games.games.map((game) => game.id);

  try {
    const response = await fetch("http://localhost:5000/recommend/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game_list: gameIds })
    });
    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error("Error conectando con Flask:", error);
    res.status(500).send("Error en el servidor IA");
  }
};