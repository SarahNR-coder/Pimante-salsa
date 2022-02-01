/**Configuration du serveur de notre API, permettant d'interagir avec notre base de données MongoDB : options de connexion aux différents ports et gestion des erreurs */

/**Le serveur se base sur le protocole HTTP */
const http = require('http');
const app = require('./app');

let currentDate = new Date();

/** Déclaration de normalizePort qui gère les différents cas de connexion*/
const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  };

/**Utilisation de normalizePort : ici  le port d'écoute du serveur correspondra à la variable environnement du port (écoute du port proposé par défaut) ou au port 3000*/
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**Gestion des erreurs avec une mise en place d'alertes associées reliées à la console*/
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**Nous définissons ce server comme celui de notre application */
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind +' at '+ currentDate);
});

/**Configuration du port défini plus haut comme celui du server */
server.listen(port);