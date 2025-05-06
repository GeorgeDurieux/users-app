const mongoose = require("mongoose");
const request = require("supertest");

const authService = require('../services/auth.service');
const productsService = require('../services/products.service');

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

describe('Requests for api/products', () => {
    beforeAll(() => {
        user = {
            username: "admin",
            email: "admin@aueb.gr",
            roles: ["EDITOR", "READER", "ADMIN"]
        };
        token = authService.generateAccessToken(user);
    });

    it('GET Returns all products', async () => {
        const res = await request(app)
            .get('/api/products')
            .set('Authorization', `Bearer ${token}`);

        console.log(res)    
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
        expect(res.body.data.length).toBeGreaterThan(0);
    }, 50000);

    it("POST Creates a product", async () => {
            const res = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    'product': 'test1',
                    'cost': 10,
                    'description': 'test1 description',
                    'quantity': 20
                });
    
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBeTruthy();
        }, 50000)
})

describe('Requests for api/products/:product', () => {
    beforeAll(() => {
        user = {
            username: "admin",
            email: "admin@aueb.gr",
            roles: ["EDITOR", "READER", "ADMIN"]
        };
        token = authService.generateAccessToken(user);
    });

    it("GET Returns specific product", async () => {

        const result = await productsService.findLastInsertedProduct();

        const res = await request(app)
            .get('/api/products/' + result.product)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
        expect(res.body.data.product).toBe(result.product);
        expect(res.body.data.cost).toBe(result.cost);
    });
})