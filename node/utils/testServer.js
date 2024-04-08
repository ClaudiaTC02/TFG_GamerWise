import express from 'express';
import supertest from 'supertest';

function testServer(route){
    const app = express();
    app.use(express.json());
    route(app)
    return supertest(app)
}

export default testServer