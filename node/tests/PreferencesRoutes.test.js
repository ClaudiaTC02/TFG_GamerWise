import testServer from "../utils/testServer.js";
import preferencesRoutes from "../routes/PreferencesRoutes.js";
import { generateAuthToken } from "../utils/userUtils.js";

const request = testServer(preferencesRoutes);

describe('PreferencesRoutes', () => {
    beforeEach(async () => {
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
            igdb_id: 1,
            release_date: 1716634021
        });
    })
    describe('[ routes / preferences ]', () => {
        it('should add a rating to a game', async () => {
            // Arrange
            const correctRating = {game_id:1, rating:3}
            // Act
            const {status, body} = await request.post('/preferences').send(correctRating).set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(201)
            expect(body.message).toEqual('Rating added successfully')
            expect(body.rating.rating).toEqual(3)
        });

        it('should NOT add a rating to an inexistent game', async () => {
            // Arrange
            const correctRating = {game_id:2, rating:3}
            // Act
            const {status, body} = await request.post('/preferences').send(correctRating).set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(404)
            expect(body.message).toEqual('User or Game not found')
        });

        it('should NOT add a rating to an inexistent user', async () => {
            // Arrange
            const inexistentUserToken = generateAuthToken(2)
            const correctRating = {game_id:1, rating:3}
            // Act
            const {status, body} = await request.post('/preferences').send(correctRating).set('Authorization', `Bearer ${inexistentUserToken}`);
            // Assert
            expect(status).toEqual(404)
            expect(body.message).toEqual('User or Game not found')
        });

        it('should NOT add a rating with not required field', async () => {
            // Arrange
            const correctRating = {game_id:1}
            // Act
            const {status, body} = await request.post('/preferences').send(correctRating).set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual('Required fields not provided')
        });

        it('should NOT add a rating with incorrect data type', async () => {
            // Arrange
            const inexistentUserToken = generateAuthToken("uno")
            const correctRating = {game_id:1, rating:3}
            // Act
            const {status, body} = await request.post('/preferences').send(correctRating).set('Authorization', `Bearer ${inexistentUserToken}`);
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual('Required fields not provided')
        });

        it('should NOT add a rating with a rating with decimals', async () => {
            // Arrange
            const correctRating = {game_id:1, rating:3.2}
            // Act
            const {status, body} = await request.post('/preferences').send(correctRating).set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual('Rating has to be an integer between 1 and 5')
        });

        it('should NOT add a rating with a rating negative', async () => {
            // Arrange
            const correctRating = {game_id:1, rating:-2}
            // Act
            const {status, body} = await request.post('/preferences').send(correctRating).set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual('Rating has to be an integer between 1 and 5')
        });

        
        it('should NOT add a rating with a rating equal 0', async () => {
            // Arrange
            const correctRating = {game_id:1, rating:0}
            // Act
            const {status, body} = await request.post('/preferences').send(correctRating).set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual('Rating has to be an integer between 1 and 5')
        });

        it('should NOT add a rating with a rating more than 5', async () => {
            // Arrange
            const correctRating = {game_id:1, rating:6}
            // Act
            const {status, body} = await request.post('/preferences').send(correctRating).set('Authorization', `Bearer ${authToken}`);
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
            const {status, body} = await request.put('/preferences/1').send(newRating).set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(200)
            expect(body.message).toEqual('Rating updated successfully')
        });

        it('should NOT update a rating with inexistent game', async () => {
            // Arrange
            const newRating = {rating:3}
            // Act
            const {status, body} = await request.put('/preferences/2').send(newRating).set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(404)
            expect(body.message).toEqual('User or Game not found')
        });

        it('should NOT update a rating with inexistent user', async () => {
            // Arrange
            const inexistentUserToken = generateAuthToken(2)
            const newRating = {rating:3}
            // Act
            const {status, body} = await request.put('/preferences/1').send(newRating).set('Authorization', `Bearer ${inexistentUserToken}`);
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
                igdb_id: 50,
                release_date: 1716634021
            });
            // Act
            const {status, body} = await request.put('/preferences/2').send(newRating).set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(404)
            expect(body.message).toEqual('User or Game not found in model')
        });

        it('should NOT update a rating with invalid data type id', async () => {
            // Arrange
            const newRating = {rating:3}
            // Act
            const {status, body} = await request.put('/preferences/uno').send(newRating).set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual('Ids are required and in number format')
        });

        it('should NOT update a rating with invalid data type rating', async () => {
            // Arrange
            const newRating = {rating:'tres'}
            // Act
            const {status, body} = await request.put('/preferences/1').send(newRating).set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual('Invalid rating data type')
        });

        it('should delete a rating', async () => {
            // Arrange

            // Act
            const {status, body} = await request.delete('/preferences/1').set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(200)
            expect(body.message).toEqual('Rating deleted successfully')
        });

        it('should not delete a rating if it does not exists in table', async () => {
            // Arrange

            // Act
            const {status, body} = await request.delete('/preferences/2').set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(404)
            expect(body.message).toEqual('User or Game not found in model')
        });
        
        it('should not delete a rating if ids are not numbers', async () => {
            // Arrange

            // Act
            const {status, body} = await request.delete('/preferences/uno').set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual('Ids are required and in number format')
        });

        it('should get the rating of an especific game', async () => {
            // Arrange

            // Act
            const {status, body} = await request.get('/preferences/rating/1').set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(200)
            expect(body.message).toEqual('Rating obtained successfully')
            expect(body.rating.rating).toEqual(2)
        });

        it('should NOT get the rating of a game if it does not exists in table', async () => {
            // Arrange

            // Act
            const {status, body} = await request.get('/preferences/rating/2').set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(404)
            expect(body.message).toEqual('User or Game not found in model')
        });

        it('should NOT get the rating of a game if ids are not numbers', async () => {
            // Arrange

            // Act
            const {status, body} = await request.get('/preferences/rating/uno').set('Authorization', `Bearer ${authToken}`);
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
                igdb_id: 33,
                release_date: 1716634021
            });
            await PreferencesModel.create({ game_id:1, user_id:1, rating:2})
            await PreferencesModel.create({ game_id:2, user_id:1, rating:4})
        })
        it('should get all ratings mapped',async () => {
            // Arrange
            // Act
            const {status, body} = await request.get('/preferences').set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(200)
            expect(body.message).toEqual('Ratings obtained successfully')
            expect(body.ratings[4]).toEqual(1)
            expect(body.ratings[2]).toEqual(1)
        });
        it('should NOT get all ratings of an inexistent user',async () => {
            // Arrange
            const inexistentUserToken = generateAuthToken(2)
            // Act
            const {status, body} = await request.get('/preferences').set('Authorization', `Bearer ${inexistentUserToken}`);
            // Assert
            expect(status).toEqual(404)
            expect(body.message).toEqual('User not found')
        });
        it('should NOT get all ratings of a user with id in a not number form',async () => {
            // Arrange
            const inexistentUserToken = generateAuthToken("uno")
            // Act
            const {status, body} = await request.get('/preferences').set('Authorization', `Bearer ${inexistentUserToken}`);
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual('Ids are required and in number format')
        });
    });
    describe('[ routes / preferences / games ? rating = : rating]', () => {
        beforeEach(async () =>{
            await PreferencesModel.create({ game_id:1, user_id:1, rating:2})
        })
        it('should get all the games with specific rating', async () => {
            // Arrange
            // Act
            const {status, body} = await request.get('/preferences/games?rating=2').set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(200)
            expect(body.message).toEqual('Games obtained successfully')
            expect(body.games.length).toEqual(1)
            expect(body.games[0].name).toEqual('test')
        });
        it('should NOT get any game if rating is not set and get error', async () => {
            // Arrange
            // Act
            const {status, body} = await request.get('/preferences/games').set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual('Required fields not provided')
        });
        it('should NOT get games if there is not game for that rating and NOT get error', async () => {
            // Arrange
            // Act
            const {status, body} = await request.get('/preferences/games?rating=1').set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(200)
            expect(body.message).toEqual('Games obtained successfully')
            expect(body.games.length).toEqual(0)
        });
        it('should NOT get games if rating is in decimal format', async () => {
            // Arrange
            // Act
            const {status, body} = await request.get('/preferences/games?rating=1.2').set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual('Rating has to be an integer between 1 and 5')
        });
        it('should NOT get games if rating is in another incorrect format', async () => {
            // Arrange
            // Act
            const {status, body} = await request.get('/preferences/games?rating=dos').set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(status).toEqual(400)
            expect(body.message).toEqual('Rating has to be an integer between 1 and 5')
        });
        it('should NOT get games if user does not exists', async () => {
            // Arrange
            const inexistentUserToken = generateAuthToken(3)
            // Act
            const {status, body} = await request.get('/preferences/games?rating=2').set('Authorization', `Bearer ${inexistentUserToken}`);
            // Assert
            expect(status).toEqual(404)
            expect(body.message).toEqual('User not found')
        });
    });
    
    afterEach(async () =>{
        await UserModel.destroy({ where: {} });
        await GameModel.destroy({ where: {} });
        await PreferencesModel.destroy({ where: {} });
    })
});
