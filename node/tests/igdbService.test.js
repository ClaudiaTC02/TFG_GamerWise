// igdbRoutes.test.js
import igdbRoutes from "../routes/igdbRoutes.js";
import testServer from "../utils/testServer.js";
import {
  getGames,
  getLatestReleases,
  getUpcomingReleases,
  searchGameByName,
} from "../services/igdbService.cjs";

const request = testServer(igdbRoutes);

describe("IGDB Routes Tests", () => {
  it("GET /igdb/games", async () => {
    // Arrage
    // Act
    const { status, body } = await request.get('/igdb/games');
    // Assert
    expect(status).toEqual(200);
    expect(body.length).toEqual(10);
  });

  it("GET /igdb/latest", async () => {
    // Arrage
    // Act
    const { status, body } = await request.get('/igdb/latest');
    // Assert
    expect(status).toEqual(200);
    expect(body.length).toEqual(10);
  });

  it("GET /igdb/upcoming", async () => {
    // Arrage
    // Act
    const { status, body } = await request.get('/igdb/upcoming');
    // Assert
    expect(status).toEqual(200);
    expect(body.length).toEqual(10);
  });

  it("GET /igdb/game", async () => {
    // Arrage
    // Act
    const { status, body } = await request.get('/igdb/game/?name=Helldivers 2');
    // Assert
    expect(status).toEqual(200);
    expect(body[0].name).toEqual("Helldivers 2");
  });
});
