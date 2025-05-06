const mongoose = require("mongoose");
const request = require("supertest");

const authService = require('../services/auth.service');
const userService = require('../services/user.service');

const app = require('../app');

// Connecting to MongoDB before each test
beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_URI)
        .then(
            () => { console.log("Connection to MongoDB established for Jest") },
            err => { console.log("Failed to connect to MongoDB for Jest", err) }
        );
});

// Close connection to MongoDB
afterEach(async () => {
    await mongoose.connection.close();
})

describe("Requests for /api/users", () => {

    let token;

    beforeAll(() => {
        user = {
            username: "admin",
            email: "admin@aueb.gr",
            roles: ["EDITOR", "READER", "ADMIN"]
        };
        token = authService.generateAccessToken(user);
    });

    it('GET Returns all users', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
        expect(res.body.data.length).toBeGreaterThan(0);
    }, 50000);

    it('GET Returns all users, unauthorized', async () => {
        const res = await request(app)
            .get('/api/users');

        expect(res.statusCode).toBe(401)
        expect(res.body.status).not.toBeTruthy();
    }, 50000);

    it("POST Creates a user", async () => {
        const res = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                'username': 'test1',
                'password': '12345',
                'name': 'test1 name',
                'surname': 'test1 surname',
                'email': 'test1@aueb.gr',
                'address': {
                    'area': 'area1',
                    'road': 'road1'
                }
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
    }, 50000)

    it("POST Creates a second user", async () => {
        const res = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                'username': 'test2',
                'password': '12345',
                'name': 'test2 name',
                'surname': 'test2 surname',
                'email': 'test2@aueb.gr',
                'address': {
                    'area': 'area2',
                    'road': 'road2'
                }
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
    }, 50000)

    it("POST Creates a user with same username", async () => {
        const res = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'test1',
                password: '12345',
                name: 'new name',
                surname: 'new surname',
                email: 'new@aueb.gr',
                address: {
                    area: 'xxxx',
                    road: 'yyyy'
                }
            })

        expect(res.statusCode).toBe(400);
        expect(res.body.status).not.toBeTruthy()
    });

    it("POST Creates a user with same email", async () => {
        const res = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'test',
                password: '12345',
                name: 'name test',
                surname: 'surname test',
                email: 'test1@aueb.gr',
                address: {
                    area: 'area23',
                    road: 'road23'
                }
            })

        expect(res.statusCode).toBe(400);
        expect(res.body.status).not.toBeTruthy();
    });

    it("POST Creates a user with empty name, surname, password", async () => {
        const res = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'test2',
                password: '',
                name: '',
                surname: '',
                email: 'test2@aueb.gr',
                address: {
                    area: 'area23',
                    road: 'road23'
                }
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).not.toBeTruthy();
    })
});


describe("Requests for /api/users/:username", () => {
    let token

    beforeAll(() => {
        user = {
            username: "admin",
            email: "admin@aueb.gr",
            roles: ["EDITOR", "READER", "ADMIN"]
        };
        token = authService.generateAccessToken(user);
    });

    it("GET Returns specific user", async () => {

        const result = await userService.findLastInsertedUser();

        const res = await request(app)
            .get('/api/users/' + result.username)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
        expect(res.body.data.username).toBe(result.username);
        expect(res.body.data.email).toBe(result.email);
    });

    it("GET Returns specific user that does not exist", async () => {

        const result = await userService.findOne('Invalid username - too many characters yo!');

        const res = await request(app)
            .get('/api/users/Invalid username - too many characters yo!')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.status).not.toBeTruthy();
    });

    it("PATCH Update a user", async () => {
        const result = await userService.findLastInsertedUser();

        const res = await request(app)
            .patch('/api/users/' + result.username)
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: result.username,
                name: "new updated name",
                surname: "new updated surname",
                email: "new@aueb.gr",
                address: {
                    area: "area50",
                    road: result.address.road
                }
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
    });

    it("DELETE delete a user", async () => {
        const result = await userService.findLastInsertedUser();

        const res = await request(app)
            .delete('/api/users/' + result.username)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
    })
})

describe('Requests for api/users/:email', () => {
    beforeAll(() => {
        user = {
            username: "admin",
            email: "admin@aueb.gr",
            roles: ["EDITOR", "READER", "ADMIN"]
        };
        token = authService.generateAccessToken(user);
    });

    it("DELETE delete a user by email", async () => {
        const result = await userService.findLastInsertedUser();

        const res = await request(app)
            .delete('/api/users/' + result.username + '/email/' + result.email)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
    })
})
