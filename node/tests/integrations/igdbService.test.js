// igdbRoutes.test.js
import igdbRoutes from "../../routes/igdbRoutes.js";
import testServer from "../../utils/testServer.js";

const request = testServer(igdbRoutes);

describe("[ routes / igd ]", () => {
  it("[ routes / igd / games ]", async () => {
    // Arrage
    // Act
    const { status, body } = await request.get('/igdb/games');
    // Assert
    expect(status).toEqual(200);
    expect(body.length).toEqual(10);
  });

  it("[ routes / igd / latest ]", async () => {
    // Arrage
    // Act
    const { status, body } = await request.get('/igdb/latest');
    // Assert
    expect(status).toEqual(200);
    expect(body.length).toEqual(10);
  });

  it("[ routes / igd / upcoming ]", async () => {
    // Arrage
    // Act
    const { status, body } = await request.get('/igdb/upcoming');
    // Assert
    expect(status).toEqual(200);
    expect(body.length).toEqual(10);
  });

  it("[ routes / igd / game ]", async () => {
    // Arrage
    // Act
    const { status, body } = await request.get('/igdb/game/?name=Helldivers 2');
    // Assert
    expect(status).toEqual(200);
    expect(body[0].name).toEqual("Helldivers 2");
  });

  it("[ routes / igd / gameDetails ]", async () => {
    // Arrage
    // Act
    const { status, body } = await request.get('/igdb/gameDetails/?name=Helldivers 2');
    // Assert
    expect(status).toEqual(200);
    expect(body[0].name).toEqual("Helldivers 2");
    expect(body[0].genres[0].name).toEqual("Shooter");
    expect(body[0].involved_companies[0].company.name).toEqual("Arrowhead Game Studios");
  });
});
