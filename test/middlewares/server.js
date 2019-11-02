const qs = require('query-string');

function serverFactory(config) {
    return function (req, res, next) {
        const { url } = req;

        if (url.indexOf('/jsonp/') !== 0) {
            res.statusCode = 404;
        } else {
            const idx = url.indexOf('?');
            const querystring = idx > -1 ? url.slice(idx + 1) : '';
            const query = qs.parse(querystring);

            if (query.callback != null) {
                res.statusCode = 200;
                res.end(`${query.callback}({success:true})`);
            } else {
                res.statusCode = 404;
            }
        }
        next();
    };
}

module.exports = {
    'middleware:server': ['factory', serverFactory]
};