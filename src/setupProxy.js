const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/list',
    createProxyMiddleware({
      target: 'https://i.maoyan.com/api/mmdb/movie/v3',
      changeOrigin: true,
    })
  );
};