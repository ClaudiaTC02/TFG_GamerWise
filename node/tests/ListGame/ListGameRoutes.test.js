import testServer from "../../utils/testServer.js";
import listgameRoutes from "../../routes/ListGameRoutes.js";

const request = testServer(listgameRoutes);

describe("ListGameRoutes", () => {
  beforeAll(async () => {
    await UserModel.destroy({ where: {} });
    await ListModel.destroy({ where: {} });
    await GameModel.destroy({ where: {} });
    await ListGameModel.destroy({ where: {} });
  });
  describe("[ routes / listgame ]", () => {
    beforeAll(async () => {
      await UserModel.create({
        name: "test",
        email: "test@example.com",
        password: "test",
        id: 2,
      });
      await ListModel.create({ name: "test2", user_id: 2, id: 1 });
      await GameModel.create({
        name: "test",
        company: "test company",
        gender: "test gender",
        platforms: "name, name",
        max_players: 40,
        id: 1,
      });
    });
    beforeEach(async () => {
      await ListGameModel.destroy({ where: {} });
    });
    it("should add a game to list", async () => {
      // Arrange
      const listgame = { game_id: 1, list_id: 1 };
      // Act
      const { status, body } = await request.post("/listgame").send(listgame);
      // Assert
      expect(status).toEqual(201);
      expect(body.message).toEqual("Game added to list successfully");
    });
    it("should NOT add a game to list with no required field", async () => {
      // Arrange
      const listgame = { list_id: 1 };
      // Act
      const { status, body } = await request.post("/listgame").send(listgame);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Required fields not provided");
    });
    it("should NOT add a game to list with inexistent game", async () => {
      // Arrange
      const listgame = { game_id: 2, list_id: 1 };
      // Act
      const { status, body } = await request.post("/listgame").send(listgame);
      // Assert
      expect(status).toEqual(404);
      expect(body.message).toEqual("List or Game not found");
    });
    it("should NOT add a game to list with inexistent list", async () => {
      // Arrange
      const listgame = { game_id: 1, list_id: 4 };
      // Act
      const { status, body } = await request.post("/listgame").send(listgame);
      // Assert
      expect(status).toEqual(404);
      expect(body.message).toEqual("List or Game not found");
    });
    it("should NOT add a game to list with incorrect format", async () => {
      // Arrange
      const listgame = { game_id: "uno", list_id: 2 };
      // Act
      const { status, body } = await request.post("/listgame").send(listgame);
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Required fields not provided");
    });
    afterEach(async () => {
        await ListGameModel.destroy({ where: {} });
    });
    afterAll(async () => {
        await UserModel.destroy({ where: { id: 2} });
        await ListModel.destroy({ where: { id: 1} });
        await GameModel.destroy({ where: { id: 1} });
        await ListGameModel.destroy({ where: {} });
    });
  });
});