import testServer from "../utils/testServer.js";
import gameRoutes from "../routes/GameRoutes.js";

const request = testServer(gameRoutes);

describe('GameRoutes', () => {
    describe('[ routes / game ]', () => {
        beforeEach(async () => {
            await GameModel.destroy({ where: {} })
        })
        it('should create a new game', async () => {
            // Arrange
            const game = {name: "test", company: "test company", gender: "test gender", platforms: "name, name", max_players: 40, igdb_id: 1}
            // Act
            const {status, body} = await request.post('/game').send(game).set('Authorization', `Bearer ${authToken}`);
            // Assert
            //expect(status).toEqual(201)
            expect(body.message).toEqual("Game created successfully")
            expect(body.game.name).toEqual("test")
        })
    
        it('should NOT create a new game with incompleted data', async () => {
            // Arrange
            const game = {company: "test company", gender: "test gender", platforms: "name, name", max_players: 40, igdb_id: 1}
            // Act
            const {status, body} = await request.post('/game').send(game).set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual("Required fields are not provided")
        })
    
        it('should NOT create a new game with invalid data type', async () => {
            // Arrange
            const game = {name: "test", company: "test company", gender: "test gender", platforms: "name, name", max_players: "40", igdb_id: 1}
            // Act
            const {status, body} = await request.post('/game').send(game).set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual("Invalid data type")
        })
        it('should get an existing game', async () => {
            // Arrange
            const game = {id: 1,name: "test", company: "test company", gender: "test gender", platforms: "name, name", max_players: 40, igdb_id: 1}
            await GameModel.create(game)
            // Act
            const {status, body} = await request.get('/game/1').set('Authorization', `Bearer ${authToken}`);
            // Assert
            //expect(status).toEqual(200)
            expect(body.message).toEqual("Game got successfully")
        });
        it('should NOT get an inexisting game', async () => {
            // Arrange

            // Act
            const {status, body} = await request.get('/game/40').set('Authorization', `Bearer ${authToken}`);
            // Assert
            //expect(status).toEqual(404)
            expect(body.message).toEqual("Game not found")
        });
        it('should NOT get a game with incorrect format', async () => {
            // Arrange

            // Act
            const {status, body} = await request.get('/game/una').set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual("Required fields are not provided")
        });
        afterAll(async () => {
            await GameModel.destroy({ where: {} })
        })
    });
});
