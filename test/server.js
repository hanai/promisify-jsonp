const express = require('express');
const cookieParser = require('cookie-parser');

const config = require('./config');

const app = express();
app.use(cookieParser());

app.get('/jsonp/basic', (req, res, next) => {
    const { query } = req;
    if (query.callback == null) {
        res.status(404).end();
    } else {
        res.send(`typeof ${query.callback} != 'undefined' && ${query.callback}({success:true})`).end();
    }
    next();
});

app.get('/jsonp/hold10', async (req, res, next) => {
    const { query } = req;
    if (query.callback == null) {
        res.status(404).end();
        next();
    } else {
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 10000);
        });
        res.send(`typeof ${query.callback} != 'undefined' && ${query.callback}({success:true})`).end();
        next();
    }
});

app.get('/jsonp/add_cookie', (req, res, next) => {
    const { query } = req;
    res.cookie('secret', '12345678');
    res.send(`typeof ${query.callback} != 'undefined' && ${query.callback}({success:true})`).end();
    next();
});

app.get('/jsonp/remove_cookie', (req, res, next) => {
    const { query } = req;
    res.cookie('secret', '', {
        maxAge: 0,
    });
    res.send(`typeof ${query.callback} != 'undefined' && ${query.callback}({success:true})`).end();
    next();
});

app.get('/jsonp/cors', (req, res, next) => {
    const { cookies, query } = req;
    if (query.callback == null) {
        res.status(404).end();
    } else {
        res.header('Access-Control-Allow-Origin', `http://localhost:9876`);
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.send(`typeof ${query.callback} != 'undefined' && ${query.callback}(${JSON.stringify({
            success: true,
            cookies: cookies
        })})`);
    }
    next();
});

app.listen(config.serverPort, () => console.log(`server listening on port ${config.serverPort}!`));
