import { postNewGameRequest } from "../api/game";

export const createGameLogic = async (gameDetails, id, token) => {
  try {
    const company =
      (gameDetails.involved_companies &&
        gameDetails.involved_companies
          .map((company) => company.company.name)
          .join(", ")) ||
      "anonymus";
    const platforms =
      (gameDetails.platforms &&
        gameDetails.platforms
          .map((platforms) => platforms.abbreviation)
          .join(", ")) ||
      "none";
    const genres =
      (gameDetails.genres &&
        gameDetails.genres.map((genre) => genre.name).join(", ")) ||
      "none";
    const multiplayer = gameDetails?.multiplayer_modes?.[0]?.onlinemax || 1;
    const cover = gameDetails.cover ? gameDetails.cover.url : null
    const release_date = gameDetails?.first_release_date || 0;
    const newGame = await postNewGameRequest(
      gameDetails.name,
      company,
      platforms,
      multiplayer,
      genres,
      id,
      cover,
      release_date,
      token
    );
    return newGame;
  } catch (error) {
    console.error("Error al crear el juego:", error);
  }
};
