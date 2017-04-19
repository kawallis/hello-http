const parseUrl = require('url').parse;
const fs = require('fs');
const path = require('path');


function greeting(req, res) {   
    const name = req.url.split('/')[2] || 'stranger';
    const salutation = req.query.salutation || 'hello';
    
    let greeting = `${salutation} ${name}`; 
    let writing = greeting.split('?')[0];
    res.end(writing);
}

function fact(req, res) {    
    let writing = 'I am super cool';
    res.end(writing);
}

function getIndex(req, res) {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, data) => {
        res.end(data);
    });
}

function logs(req, res) {
    

    if (req.method === 'POST'){
        let body = '';
        req.on('data', data => {
            body += data;
        });

        req.on('end', () => {
            fs.mkdir('logs', err => {
                if (err) {
                    res.statusCode = 500;
                    res.statusMessage = 'Directory creation === FAILURE';
                    res.end();
                }
                const timestamp = new Date().toISOString();
                const responseData = {timestamp};  
                console.log(responseData);
                fs.writeFile(`logs/${timestamp}.txt`, body, (err) => {
                    if (err) {
                        res.statusCode = 500;
                        res.statusMessage = 'Directory creation === FAILURE';
                        res.end();
                    }
                    res.statusCode = 201;
                    res.end(JSON.stringify(responseData));
                });
            });
        });
    }
}

const routes = {
    '/': getIndex,
    '/index.html': getIndex,
    '/greeting': greeting,
    '/greeting/': greeting,
    '/fact': fact,
    '/logs': logs
};

function notFound(req, res) {
    res.statusCode = 404;
    res.statusMessage = `${req.url} not found`;
    res.end();
}

function app(req, res) {
    const url = parseUrl(req.url, true);
    req.query = url.query;
    res.setHeader('Content-Type', 'text/html');
    const route = routes['/' + url.pathname.split('/')[1] || notFound];
    route(req, res);
}

module.exports = app;