// configurando el node-postgres driver
const pg = require('pg');
const postgresUrl = 'postgres://postgres@localhost/tweetydb';
const client = new pg.Client(postgresUrl);
// conectando al servidor de postgres
client.connect((err) => {
    if(err) console.error('Error connecting with database: ', err.stack);
    else console.log('db connected');
});
// hacer el cliente disponible como un módulo de Node
module.exports = client;