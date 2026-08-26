'use strict';

module.exports = function fileApiMiddleware(req, res, next) {
 
  console.log(' Middleware fileApi: Procesando petición a la API de archivos...');
  
  next();
};