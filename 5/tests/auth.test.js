const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
chai.should();

describe('Auth API', () => {
    it('should register a new user', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({ username: 'testuser', password: 'password123' })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('token');
                done();
            });
    });

    it('should login the user', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({ username: 'testuser', password: 'password123' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('token');
                done();
            });
    });
});
