import testServer from "../utils/testServer.js";
import preferencesRoutes from "../routes/PreferencesRoutes.js";

const request = testServer(preferencesRoutes);

describe('ReferencesRoutes', () => {
    beforeEach(async () => {
        await UserModel.destroy({ where: {} });
        await GameModel.destroy({ where: {} });
        await PreferencesModel.destroy({ where: {} });
        await UserModel.create({
            name: "test",
            email: "test@example.com",
            password: "test",
            id: 1
        });
        await GameModel.create({
            name: "test",
            company: "test company",
            gender: "test gender",
            platforms: "name, name",
            max_players: 40,
            id: 1,
        });
    })
    describe('[ routes / preferences ]', () => {
        it('should add a rating to a game', async () => {
            // Arrange
            const correctRating = {user_id:1, game_id:1, rating:3}
            // Act
            const {status, body} = await request.post('/preferences').send(correctRating)
            // Assert
            expect(status).toEqual(201)
            expect(body.message).toEqual('Rating added successfully')
            expect(body.rating.rating).toEqual(3)
        });

        it('should NOT add a rating to an inexistent game', async () => {
            // Arrange
            const correctRating = {user_id:1, game_id:2, rating:3}
            // Act
            const {status, body} = await request.post('/preferences').send(correctRating)
            // Assert
            expect(status).toEqual(404)
            expect(body.message).toEqual('User or Game not found')
        });

        it('should NOT add a rating to an inexistent user', async () => {
            // Arrange
            const correctRating = {user_id:2, game_id:1, rating:3}
            // Act
            const {status, body} = await request.post('/preferences').send(correctRating)
            // Assert
            expect(status).toEqual(404)
            expect(body.message).toEqual('User or Game not found')
        });

        it('should NOT add a rating with not required field', async () => {
            // Arrange
            const correctRating = {user_id:1, game_id:1}
            // Act
            const {status, body} = await request.post('/preferences').send(correctRating)
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual('Required fields not provided')
        });

        it('should NOT add a rating with incorrect data type', async () => {
            // Arrange
            const correctRating = {user_id:'uno', game_id:1, rating:3}
            // Act
            const {status, body} = await request.post('/preferences').send(correctRating)
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual('Required fields not provided')
        });

        it('should NOT add a rating with a rating with decimals', async () => {
            // Arrange
            const correctRating = {user_id:1, game_id:1, rating:3.2}
            // Act
            const {status, body} = await request.post('/preferences').send(correctRating)
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual('Rating has to be an integer between 1 and 5')
        });

        it('should NOT add a rating with a rating negative', async () => {
            // Arrange
            const correctRating = {user_id:1, game_id:1, rating:-2}
            // Act
            const {status, body} = await request.post('/preferences').send(correctRating)
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual('Rating has to be an integer between 1 and 5')
        });

        
        it('should NOT add a rating with a rating equal 0', async () => {
            // Arrange
            const correctRating = {user_id:1, game_id:1, rating:0}
            // Act
            const {status, body} = await request.post('/preferences').send(correctRating)
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual('Rating has to be an integer between 1 and 5')
        });

        it('should NOT add a rating with a rating more than 5', async () => {
            // Arrange
            const correctRating = {user_id:1, game_id:1, rating:6}
            // Act
            const {status, body} = await request.post('/preferences').send(correctRating)
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual('Rating has to be an integer between 1 and 5')
        });
        afterEach(async () =>{
            await PreferencesModel.destroy({ where: {} });
        })
    });
    describe('[ routes / preferences / :game_id & :user_id ]', () => {
        beforeEach(async () =>{
            await PreferencesModel.create({ game_id:1, user_id:1, rating:2})
        })
        it('should update a rating', async () => {
            // Arrange
            const newRating = {rating:3}
            // Act
            const {status, body} = await request.put('/preferences/1&1').send(newRating)
            // Assert
            expect(status).toEqual(200)
            expect(body.message).toEqual('Rating updated successfully')
        });

        it('should NOT update a rating with inexistent game', async () => {
            // Arrange
            const newRating = {rating:3}
            // Act
            const {status, body} = await request.put('/preferences/2&1').send(newRating)
            // Assert
            expect(status).toEqual(404)
            expect(body.message).toEqual('User or Game not found')
        });

        it('should NOT update a rating with inexistent user', async () => {
            // Arrange
            const newRating = {rating:3}
            // Act
            const {status, body} = await request.put('/preferences/1&2').send(newRating)
            // Assert
            expect(status).toEqual(404)
            expect(body.message).toEqual('User or Game not found')
        });
        
        it('should NOT update a rating inexistent in table', async () => {
            // Arrange
            const newRating = {rating:3}
            await GameModel.create({
                name: "test2",
                company: "test company",
                gender: "test gender",
                platforms: "name, name",
                max_players: 40,
                id: 2,
            });
            // Act
            const {status, body} = await request.put('/preferences/2&1').send(newRating)
            // Assert
            expect(status).toEqual(404)
            expect(body.message).toEqual('User or Game not found in model')
        });

        it('should NOT update a rating with invalid data type id', async () => {
            // Arrange
            const newRating = {rating:3}
            // Act
            const {status, body} = await request.put('/preferences/1&uno').send(newRating)
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual('Ids are required and in number format')
        });

        it('should NOT update a rating with invalid data type rating', async () => {
            // Arrange
            const newRating = {rating:'tres'}
            // Act
            const {status, body} = await request.put('/preferences/1&1').send(newRating)
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual('Invalid data type')
        });

        it('should delete a rating', async () => {
            // Arrange

            // Act
            const {status, body} = await request.delete('/preferences/1&1')
            // Assert
            expect(status).toEqual(200)
            expect(body.message).toEqual('Rating deleted successfully')
        });

        it('should not delete a rating if it does not exists in table', async () => {
            // Arrange

            // Act
            const {status, body} = await request.delete('/preferences/2&1')
            // Assert
            expect(status).toEqual(404)
            expect(body.message).toEqual('User or Game not found in model')
        });
        
        it('should not delete a rating if ids are not numbers', async () => {
            // Arrange

            // Act
            const {status, body} = await request.delete('/preferences/uno&1')
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual('Ids are required and in number format')
        });

        it('should get the rating of an especific game', async () => {
            // Arrange

            // Act
            const {status, body} = await request.get('/preferences/1&1')
            // Assert
            expect(status).toEqual(200)
            expect(body.message).toEqual('Rating obatined successfully')
            expect(body.rating.rating).toEqual(2)
        });

        it('should NOT get the rating of a game if it does not exists in table', async () => {
            // Arrange

            // Act
            const {status, body} = await request.get('/preferences/2&1')
            // Assert
            expect(status).toEqual(404)
            expect(body.message).toEqual('User or Game not found in model')
        });

        it('should NOT get the rating of a game if ids are not numbers', async () => {
            // Arrange

            // Act
            const {status, body} = await request.get('/preferences/uno&1')
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual('Ids are required and in number format')
        });

        afterEach(async () =>{
            await PreferencesModel.destroy({ where: {} });
            await UserModel.destroy({ where: { id: 2} });
        })
    });
    describe('[ routes / preferences / : user_id ]', () => {
        beforeEach(async() =>{
            await GameModel.create({
                name: "test",
                company: "test company",
                gender: "test gender",
                platforms: "name, name",
                max_players: 40,
                id: 2,
            });
            await PreferencesModel.create({ game_id:1, user_id:1, rating:2})
            await PreferencesModel.create({ game_id:2, user_id:1, rating:4})
        })
        it('should get all ratings mapped',async () => {
            // Arrange
            // Act
            const {status, body} = await request.get('/preferences/1')
            // Assert
            expect(status).toEqual(200)
            expect(body.message).toEqual('Ratings obatined successfully')
            expect(body.ratings[4]).toEqual(1)
            expect(body.ratings[2]).toEqual(1)
        });
        it('should NOT get all ratings of an inexistent user',async () => {
            // Arrange
            // Act
            const {status, body} = await request.get('/preferences/2')
            // Assert
            expect(status).toEqual(404)
            expect(body.message).toEqual('User not found')
        });
        it('should NOT get all ratings of a user with id in a not number form',async () => {
            // Arrange
            // Act
            const {status, body} = await request.get('/preferences/dos')
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual('Ids are required and in number format')
        });
    });
    
    afterAll(async () =>{
        await UserModel.destroy({ where: {} });
        await GameModel.destroy({ where: {} });
        await PreferencesModel.destroy({ where: {} });
    })
});
