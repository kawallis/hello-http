const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
const app = require('../lib/app');
const rimraf = require('rimraf');
const fs = require('fs');

chai.use(chaiHttp);


describe('app', () => {

    const request = chai.request(app);

    it('I am super cool', done => {
        request.get('/fact')
            .end((err, res) => {
                assert.equal(res.text, 'I am turning this in late ahhhh');
                done();
            });
    });

    it('says hola when passad as query', done => {
        request.get('/greeting/chris?greet=hola')
            .end((err, res) => {
                assert.equal(res.text, 'hola chris');
                done();
            });
    });

    it('says hello marty when name passed', done => {
        request.get('/greeting/lucy')
            .end((err, res) => {
                assert.equal(res.text, 'eyooo lucy');
                done();
            });
    });

    it('gets index on root /', done => {
        request.get('/')
            .end((err, res) => {
                assert.equal(res.text.length > 1, true );
                done();
            });
    });

    describe('POST /logs', () => {
        before(done => {
            rimraf('./logs', err => {
                if(err) return done(err);
                done();
            });
        });
        it('should create a logs directory if none exists', done => {
            request
            .post('/logging')
            .send({text: 'this is the post body'})
            .end((err, res) => {
                if(err) return done(err);
                assert.equal(res.statusCode, 201);
                fs.readdir('./logs', (err, files) => {
                    console.log(files);
                    assert.equal(files.length, 1);
                    done();
                });
            });
        });
    });
});