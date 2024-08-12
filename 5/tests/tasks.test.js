const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
chai.should();

describe('Tasks API', () => {
    let token;

    before((done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({username: 'taskuser', password: 'password123'})
            .end((err, res) => {
                token = res.body.token;
                done();
            });
    });

    it('should create a new task', (done) => {
        chai.request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({title: 'Test Task', description: 'This is a test task'})
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('title').eql('Test Task');
                done();
            });
    });

    it('should get all tasks', (done) => {
        chai.request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done();
            });
    });

    it('should update a task', (done) => {
        chai.request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                const taskId = res.body[0]._id;
                chai.request(app)
                    .put(`/api/tasks/${taskId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({title: 'Updated Test Task', completed: true})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('title').eql('Updated Test Task');
                        res.body.should.have.property('completed').eql(true);
                        done();
                    });
            });
    });

    it('should delete a task', (done) => {
        chai.request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                const taskId = res.body[0]._id;
                chai.request(app)
                    .delete(`/api/tasks/${taskId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').eql('Task removed');
                        done();
                    });
            });
    });

    it('should get no tasks after deletion', (done) => {
        chai.request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            });
    });
});
