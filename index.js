const fs = require('node:fs');
const http = require('node:http');
const url = require('node:url');
const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'content-type': 'text/html' });

        const cardsHTML = dataObj.map((prod) => replaceTemplate(tempCard, prod)).join('');
        const final = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML);
        
        res.end(final);

    } else if (pathname === '/product') {
        res.writeHead(200, { 'content-type': 'text/html' });
        
        const product = dataObj[query.id];
        const final = replaceTemplate(tempProduct, product);

        res.end(final);

    } else if (pathname === '/api') {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(data);

    } else {
        res.writeHead(404, { 'content-type': 'text/html' });
        res.end('<h1> page not found </h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log("Listening to requests on port 8000");
});
