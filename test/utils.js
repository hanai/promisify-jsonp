const config = require('./config');

export const getUrl = (path) => (`http://127.0.0.1:${config.serverPort}${path}`);
