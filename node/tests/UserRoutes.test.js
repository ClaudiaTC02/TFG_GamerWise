import testServer from './testServer.js'
import userRoutes from '../routes/UserRoutes.js'
import UserModel from '../models/UserModel.js';

const request = testServer(userRoutes)

describe('[ routes / user ]', () => {
    it('should create a new user', async () => {
        // Arrage
        const user = { email: 'test@test.com', name: 'test', password: 'Test12345678!'}
        // Act
        const { status, body } = await request.post('/user').send(user)
        // Assert
        expect(status).toEqual(201)
        console.log(body.message)
        expect(body.message).toEqual('User created successfully')
    });
    
    it('should not create a new user with invalid email format', async () => {
        // Arrage
        const userInvalidEmail = { email: 'test@.com', name: 'test', password: 'Test12345678!'}
        // Act
        const {status, body} = await request.post('/user').send(userInvalidEmail)
        // Assert
        expect(status).toEqual(400)
        expect(body.message).toEqual('Invalid email format')
    });

    it('should not create a new user with incompleted fields', async () => {
        // Arrage
        const userIncomplete = { email: 'test@.com', password: 'Test12345678!'}
        // Act
        const {status, body} = await request.post('/user').send(userIncomplete)
        // Assert
        expect(status).toEqual(400)
        expect(body.message).toEqual('Required fields')
    });

    it('should not create a new user with invalid data type', async () => {
        // Arrage
        const userInvalidType = { email: 1234, password: 'Test12345678!', name: 'test'}
        // Act
        const {status, body} = await request.post('/user').send(userInvalidType)
        // Assert
        expect(status).toEqual(400)
        expect(body.message).toEqual('Invalid data type')
    });

    it('should not create a new user with invalid password', async () => {
        // Arrage
        const userInvalidPass = { email: "test@test.com", name: "test", password: 'test'}
        // Act
        const {status, body} = await request.post('/user').send(userInvalidPass)
        // Assert
        expect(status).toEqual(400)
        expect(body.message).toEqual('Invalid password format, It must contain uppercase, lowercase, symbol and >= 8 length')
    });

    it('should not create a new user with existing email', async () => {
        // Arrage
        const user = { email: 'test@test.com', name: 'test', password: 'Test12345678!'}
        const user2 = { email: 'test@test.com', name: 'user', password: 'Test12345678!'}
        await request.post('/user').send(user)
        // Act
        const {status, body} = await request.post('/user').send(user2)
        // Assert
        expect(status).toEqual(400)
        expect(body.message).toEqual('Email already exists')
    });
    
    // destroy all items
    afterEach(async () =>{
        await UserModel.destroy({where: {}})
    })
});
