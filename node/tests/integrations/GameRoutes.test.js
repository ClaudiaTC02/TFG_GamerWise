import testServer from "../../utils/testServer.js";
import gameRoutes from "../../routes/GameRoutes.js";

const request = testServer(gameRoutes);

describe('[ routes / game ]', () => {
    beforeEach(async () => {
        await GameModel.destroy({ where: {} })
    })
    it('should create a new game', async () => {
        // Arrange
        const game = {name: "test", company: "test company", gender: "test gender", platforms: "name, name", max_players: 40}
        // Act
        const {status, body} = await request.post('/game').send(game)
        // Assert
        expect(status).toEqual(201)
        expect(body.message).toEqual("Game created successfully")
        expect(body.game.name).toEqual("test")
    })

    it('should NOT create a new game with incompleted data', async () => {
        // Arrange
        const game = {company: "test company", gender: "test gender", platforms: "name, name", max_players: 40}
        // Act
        const {status, body} = await request.post('/game').send(game)
        // Assert
        expect(status).toEqual(400)
        expect(body.message).toEqual("Required fields are not provided")
    })

    it('should NOT create a new game with invalid data type', async () => {
        // Arrange
        const game = {name: "test", company: "test company", gender: "test gender", platforms: "name, name", max_players: "40"}
        // Act
        const {status, body} = await request.post('/game').send(game)
        // Assert
        expect(status).toEqual(400)
        expect(body.message).toEqual("Invalid data type")
    })
    afterAll(async () => {
        await GameModel.destroy({ where: {} })
    })
});
