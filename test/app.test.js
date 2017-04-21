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
                assert.equal(res.text, 'I am super cool');
                done();
            });
    });

    it('says hola baba when passad as query', done => {
        request.get('/greeting/baba?salutation=hola')
            .end((err, res) => {
                assert.equal(res.text, 'hola baba');
                done();
            });
    });

    it('says hello marty when name passed', done => {
        request.get('/greeting/marty')
            .end((err, res) => {
                assert.equal(res.text, 'hello marty');
                done();
            });
    });

    // it('gets index on root /', done => {
    //     request.get('/')
    //         .end((err, res) => {
    //             console.log(res.text);
    //             assert.equal(res.text, '<h1>What up</h1>');
    //             done();
    //         });
    // });

    describe('POST /logs', () => {
        before(done => {
            rimraf('./logs', err => {
                if(err) return done(err);
                done();
            });
        });
        it('should create a logs directory if none exists', done => {
            request
            .post('/logs')
            .send({text: 'this is the post body'})
            .end((err, res) => {
                if(err) return done(err);
                assert.equal(res.statusCode, 201);
                fs.readdir('./logs', (err, files) => {
                    assert.equal(files.length, 1);
                    done();
                });
            });
        });
    });
});