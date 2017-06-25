const parseUrl = require('url').parse;
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

function logging(req, res) {

    if (req.method === 'POST') {
        let message = '';
        req.on('data', data => {
            message += data;
        });

        req.on('end', () => {
            mkdirp('./logs', err => {
                if (err) {
                    res.statusCode = 500;
                    res.statusMessage = 'YOU HAVE FAILED';
                    res.end();
                }
                const timestamp = new Date().toISOString();
                fs.writeFile(`./logs/${timestamp}.txt`, message, err => {
                    if (err) {
                        res.statusCode = 500;
                        res.statusMessage = 'YOU HAVE FAILED';
                        res.end();
                    }
                    res.statusCode = 201;
                    res.end(JSON.stringify({ timestamp }));
                });
            });
        });
    } else {
        req.statusMessage = 'Not here doe';
    }
}

function getIndex(req, res) {
    const filePath = path.join(__dirname, './index.html');
    fs.readFile(filePath, (err, data) => {
        res.end(data);
    });
}

function greeting(req, res) {
    let greet = req.query.greet || 'eyooo';
    let name = req.name || 'strangerdanger';
    res.end(`${greet} ${name}`);
}

function fact(req, res) {
    res.end('I am turning this in late ahhhh');
}

function notFound(req, res) {
    res.statusCode = 404;
    res.statusMessage = `${req.url} not found YOU FOOL`;
    const filePath = path.join(__dirname, './error.html');
    fs.readFile(filePath, (err, data) => {
        res.end(data);
    });
}

function app(req, res) {
    const url = parseUrl(req.url, true);
    const splitUrl = url.pathname.slice(1).split('/');
    const name = splitUrl[1];
    req.name = name;
    req.query = url.query;
    res.setHeader('Content-Type', 'text/html');
    const route = routes['/' + url.pathname.split('/')[1]] || notFound;
    route(req, res);
}

const routes = {
    '/': getIndex,
    '/index.html': getIndex,
    '/greeting': greeting,
    '/fact': fact,
    '/logging': logging
};

module.exports = app;