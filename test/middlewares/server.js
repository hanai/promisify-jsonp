const qs = require('query-string');
const url = require('url');

const parseReq = (req) => {
    const { pathname, query: querystring } = url.parse(req.url);
    const query = qs.parse(querystring);

    return {
        pathname,
        query,
        querystring
    };
}

const routes = {
    '/jsonp/basic': (req, res, next) => {
        const { query, pathname } = parseReq(req);
        if (query.callback == null) {
            res.statusCode = 404;
        } else {
            res.statusCode = 200;
            res.end(`${query.callback} != null && ${query.callback}({success:true})`);
        }
        next();
    },
    '/jsonp/hold10': async (req, res, next) => {
        const { query, pathname } = parseReq(req);
        if (query.callback == null) {
            res.statusCode = 404;
            next();
        } else {
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, 10000);
            });
            res.statusCode = 200;
            res.end(`${query.callback} != null && ${query.callback}({success:true})`);
            next();
        }
    }
}

function serverFactory(config) {
    return async function (req, res, next) {
        const { pathname, query } = parseReq(req);

        if (typeof routes[pathname] !== 'undefined') {
            return await routes[pathname](req, res, next);
        } else {
            res.statusCode = 404;
            next();
        }
    };
}

module.exports = {
    'middleware:server': ['factory', serverFactory]
};