import testServer from "../utils/testServer.js";
import listgameRoutes from "../routes/ListGameRoutes.js";

const request = testServer(listgameRoutes);

describe("ListGameRoutes", () => {
  beforeEach(async () => {
    await UserModel.destroy({ where: {} });
    await ListModel.destroy({ where: {} });
    await GameModel.destroy({ where: {} });
    await ListGameModel.destroy({ where: {} });
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
      igdb_id: 1,
    });
  });
  describe("[ routes / listgame ]", () => {
    beforeEach(async () => {
      await ListGameModel.destroy({ where: {} });
    });
    it("should add a game to list", async () => {
      // Arrange
      const listgame = { game_id: 1, list_id: 1 };
      // Act
      const { status, body } = await request.post("/listgame").send(listgame).set('Authorization', `Bearer ${authToken}`);
      // Assert
      expect(status).toEqual(201);
      expect(body.message).toEqual("Game added to list successfully");
    });
    it("should NOT add a game to list with no required field", async () => {
      // Arrange
      const listgame = { list_id: 1 };
      // Act
      const { status, body } = await request.post("/listgame").send(listgame).set('Authorization', `Bearer ${authToken}`);;
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Required fields not provided");
    });
    it("should NOT add a game to list with inexistent game", async () => {
      // Arrange
      const listgame = { game_id: 2, list_id: 1 };
      // Act
      const { status, body } = await request.post("/listgame").send(listgame).set('Authorization', `Bearer ${authToken}`);;
      // Assert
      expect(status).toEqual(404);
      expect(body.message).toEqual("List or Game not found");
    });
    it("should NOT add a game to list with inexistent list", async () => {
      // Arrange
      const listgame = { game_id: 1, list_id: 4 };
      // Act
      const { status, body } = await request.post("/listgame").send(listgame).set('Authorization', `Bearer ${authToken}`);;
      // Assert
      expect(status).toEqual(404);
      expect(body.message).toEqual("List or Game not found");
    });
    it("should NOT add a game to list with incorrect format", async () => {
      // Arrange
      const listgame = { game_id: "uno", list_id: 2 };
      // Act
      const { status, body } = await request.post("/listgame").send(listgame).set('Authorization', `Bearer ${authToken}`);;
      // Assert
      expect(status).toEqual(400);
      expect(body.message).toEqual("Required fields not provided");
    });
    afterEach(async () => {
        await ListGameModel.destroy({ where: {} });
    });
    afterAll(async () => {
        await UserModel.destroy({ where: {} });
        await ListModel.destroy({ where: {} });
        await GameModel.destroy({ where: {} });
        await ListGameModel.destroy({ where: {} });
    });
  });
  describe('[ routes / listgame / :list_id & :game_id ]', () => {
    beforeEach(async () => {
      await ListGameModel.destroy({ where: {} });
      await ListGameModel.create({ 
        list_id: 1,
        game_id: 1
      })
    });

    it('should delete a game from a list', async () => {
      // Arrange

      // Act
      const {status, body} = await request.delete('/listgame/1&1').set('Authorization', `Bearer ${authToken}`);
      // Assert
      expect(status).toEqual(200)
      expect(body.message).toEqual('Game deleted from list successfully')
    });

    it('should NOT delete a game from an inexistent list', async () => {
      // Arrange

      // Act
      const {status, body} = await request.delete('/listgame/2&1').set('Authorization', `Bearer ${authToken}`);
      // Assert
      expect(status).toEqual(404)
      expect(body.message).toEqual('List or Game not found')
    });

    it('should NOT delete an inexistent game from a list', async () => {
      // Arrange

      // Act
      const {status, body} = await request.delete('/listgame/1&2').set('Authorization', `Bearer ${authToken}`);
      // Assert
      expect(status).toEqual(404)
      expect(body.message).toEqual('List or Game not found')
    });

    it('should NOT delete a game from list with invalid data type', async () => {
      // Arrange

      // Act
      const {status, body} = await request.delete('/listgame/1&uno').set('Authorization', `Bearer ${authToken}`);
      // Assert
      expect(status).toEqual(400)
      expect(body.message).toEqual('Required fields not provided')
    });
    afterAll(async () => {
      await ListGameModel.destroy({ where: {} });
    });
  })
  describe('[ routes / listgame / :list_id]', () => {
    beforeEach(async () => {
      await ListGameModel.destroy({ where: {} });
      await ListGameModel.create({ 
        list_id: 1,
        game_id: 1
      })
    });

    it('should show all games from a list', async() => {
      // Arrange

      // Act
      const {status, body} = await request.get('/listgame/1').set('Authorization', `Bearer ${authToken}`);
      // Assert
      expect(status).toEqual(200)
      expect(body.message).toEqual('Games obtained successfully')
      expect(body.games[0].name).toEqual('test')
    });

    it('should NOT show all games from an inexistent list', async() => {
      // Arrange

      // Act
      const {status, body} = await request.get('/listgame/2').set('Authorization', `Bearer ${authToken}`);
      // Assert
      expect(status).toEqual(404)
      expect(body.message).toEqual('List not found')
    });

    it('should NOT show games if list is empty', async() => {
      // Arrange
      await ListModel.create({ name: "test2", user_id: 2, id: 3 });
      // Act
      const {status, body} = await request.get('/listgame/3').set('Authorization', `Bearer ${authToken}`);
      // Assert
      expect(status).toEqual(404)
      expect(body.message).toEqual('No games found for this list')
    });

    it('should NOT show games if list is in incorrect format', async() => {
      // Arrange

      // Act
      const {status, body} = await request.get('/listgame/uno').set('Authorization', `Bearer ${authToken}`);
      // Assert
      expect(status).toEqual(400)
      expect(body.message).toEqual('Required fields not provided')
    });

    it('should count games of a list', async() => {
      // Arrange
      
      // Act
      const {status, body} = await request.get('/listgame/1/count').set('Authorization', `Bearer ${authToken}`);
      // Assert
      expect(status).toEqual(200)
      expect(body.message).toEqual('Game count obtained successfully')
      expect(body.count).toEqual(1)
    });

    it('should NOT count games of an inexistent list', async() => {
      // Arrange
      
      // Act
      const {status, body} = await request.get('/listgame/5/count').set('Authorization', `Bearer ${authToken}`);
      // Assert
      expect(status).toEqual(404)
      expect(body.message).toEqual('List not found')
    });

    it('should NOT count games of id with incorrect data type', async() => {
      // Arrange
      
      // Act
      const {status, body} = await request.get('/listgame/uno/count').set('Authorization', `Bearer ${authToken}`);
      // Assert
      expect(status).toEqual(400)
      expect(body.message).toEqual('List ID is required in number format')
    });

    afterAll(async () => {
      await UserModel.destroy({ where: {}});
      await ListGameModel.destroy({ where: {} });
      await GameModel.destroy({ where: {} });
    });
  });
  
});