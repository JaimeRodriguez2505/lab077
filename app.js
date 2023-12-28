const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.static('public'));

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected!'))
.catch(error => console.error('MongoDB connection error:', error));

// Esquemas y modelos de Mongoose (asegúrate de definirlos de acuerdo a tus documentos)
// Aquí solo estoy asumiendo una estructura básica. Deberás ajustarla según tus necesidades.
const gameSchema = new mongoose.Schema({
  title: String,
  genre: String,
  // Otros campos...
});
const Game = mongoose.model('Game', gameSchema);

// Configuración de Express y EJS
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // Para parsear el cuerpo de las solicitudes POST

// Rutas
app.get('/', (req, res) => {
  res.redirect('/games');
});

// Lista de juegos
app.get('/games', (req, res) => {
  Game.find()
    .then(games => res.render('games', { games }))
    .catch(err => res.status(500).send('Error al obtener los juegos'));
});

// Formulario para añadir un juego
app.get('/add-game', (req, res) => {
  res.render('add-game');
});

// Procesar el formulario y añadir un juego
app.post('/add-game', (req, res) => {
  const newGame = new Game(req.body);
  newGame.save()
    .then(() => res.redirect('/games'))
    .catch(err => res.status(500).send('Error al añadir el juego'));
});

// Procesar el borrado de un juego
app.post('/delete-game/:id', (req, res) => {
    Game.findByIdAndDelete(req.params.id)
      .then(() => res.redirect('/games'))
      .catch(err => res.status(500).send('Error al borrar el juego'));
  });

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
