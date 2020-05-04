// ======================
//   Puerto
// ======================
process.env.PORT = process.env.PORT || 3000;

// ======================
//   Entorno
// ======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ======================
//   Base de datos
// ======================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/Cafe';
} else {
    urlDB = 'mongodb+srv://jmbruno:EKCMY5GK3HvfYM5x@cluster0-yklcq.mongodb.net/cafe';
}
// Fuerzo cx a prod para pruebas remotas.
//urlDB = 'mongodb+srv://jmbruno:EKCMY5GK3HvfYM5x@cluster0-yklcq.mongodb.net/cafe';

process.env.URLDB = urlDB;