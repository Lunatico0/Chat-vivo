import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'));

// Configuración de handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Rutas
app.get('/', (req, res) => {
  res.render('index');
});

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});

// Socket IO
const io = new Server(httpServer);

// Array para el historial de mensajes
let msgs = [];

io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado!');

  socket.on('message', (data) => {
    msgs.unshift(data);
    io.emit('history', msgs);
  });
});
