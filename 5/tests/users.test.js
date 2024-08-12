const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const User = require('../models/user');

chai.use(chaiHttp);
chai.should();

describe('Users API', () => {
    let token;

    beforeEach(async () => {
        await User.deleteMany({});
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    beforeEach((done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({ username: 'user1', password: 'password123' })
            .end((err, res) => {
                token = res.body.token;
                done();
            });
    });

    it('should get a list of users', (done) => {
        chai.request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.gte(1);
                res.body[0].should.have.property('username').eql('user1');
                done();
            });
    });

    it('should get a specific user by ID', (done) => {
        chai.request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                const userId = res.body[0]._id;
                chai.request(app)
                    .get(`/api/users/${userId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('username').eql('user1');
                        res.body.should.have.property('tasks').be.a('array');
                        done();
                    });
            });
    });
});
