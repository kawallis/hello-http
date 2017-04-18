const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
const app = require('../lib/app');

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
});