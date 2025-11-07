const express = require('express');
const app = express();
const port = 3000;

// Ruta básica
app.get('/', (res) => {
    res.send('¡Hola, mundo!');
});

// Recibir nombre y enviar saludo
app.post('/saludo', express.json(), (req, res) => {
    const { nombre } = req.body; 
    if (nombre) {
        res.send(`¡Hola, ${nombre}!`);
    } else {
        res.status(400).send('Falta el parámetro "nombre" en el cuerpo de la solicitud.');
    }
}); 

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
}); 