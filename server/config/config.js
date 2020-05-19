
// PUERTO
process.env.PORT = process.env.PORT || 3000;

// ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// VENCIMIENTO DEL TOKEN
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

// SEED DE AUTENTICACION
process.env.CADUCIDAD_TOKEN = '48h';

// BASE DE DATOS 
let urlDB;

if( process.env.NODE_ENV === 'dev' ) {
   urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// GOOGLE CLIENT ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '57292650296-5rl3kjrd9afhmb7hk9tp38vsuck0r1n0.apps.googleusercontent.com'; 
