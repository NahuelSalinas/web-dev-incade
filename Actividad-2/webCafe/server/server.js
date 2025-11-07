const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const Contacto = require('./models/Contacto');
const Producto = require('./models/Producto');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Datos iniciales de productos (solo para desarrollo)
const productosIniciales = [
    {
        nombre: "Café Barista Premium",
        descripcion: "Mezcla exclusiva con granos de Brasil y Colombia",
        precio: 2500,
        imagen: "https://tiendadecafe.com.ar/wp-content/uploads/2021/04/capsulas_taza_barista-1024x1024.jpg",
        categoria: "cafe",
        destacado: true
    },
    {
        nombre: "Café Scegliere Especial",
        descripcion: "Combinación única de tres varietales premium",
        precio: 2800,
        imagen: "https://tiendadecafe.com.ar/wp-content/uploads/2021/04/capsulas_taza_scegliere-600x600.jpg",
        categoria: "capsulas",
        destacado: true
    },
    {
        nombre: "Café Colombia Supremo",
        descripcion: "Granos 100% colombianos, sabor suave y aromático",
        precio: 2200,
        imagen: "https://tiendadecafe.com.ar/wp-content/uploads/2021/04/capsulas_taza_scegliere.jpg",
        categoria: "cafe"
    },
    {
        nombre: "Descafeinado Natural",
        descripcion: "Todo el sabor sin la cafeína, proceso natural",
        precio: 2300,
        imagen: "https://tiendadecafe.com.ar/wp-content/uploads/2021/03/Productos_cafe_packs_descaf_frente-600x600.jpg",
        categoria: "cafe"
    },
    {
        nombre: "Cápsulas Barista x10",
        descripcion: "Pack de 10 cápsulas compatibles con Nespresso",
        precio: 3200,
        imagen: "https://tiendadecafe.com.ar/wp-content/uploads/2021/04/capsulas_taza_barista-1024x1024.jpg",
        categoria: "capsulas"
    },
    {
        nombre: "Molino Profesional",
        descripcion: "Molino de café con ajuste de molienda preciso",
        precio: 15000,
        imagen: "https://tiendadecafe.com.ar/wp-content/uploads/2021/03/Productos_cafe_packs_BRASIL_frente.jpg",
        categoria: "accesorios"
    }
];

// Inicializar datos (solo en desarrollo)
async function inicializarDatos() {
    try {
        const count = await Producto.countDocuments();
        if (count === 0) {
            await Producto.insertMany(productosIniciales);
            console.log('Datos iniciales de productos insertados');
        }
    } catch (error) {
        console.error('Error inicializando datos:', error);
    }
}

// Ruta principal - servir el HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API para obtener productos
app.get('/api/productos', async (req, res) => {
    try {
        const { categoria, destacado } = req.query;
        let filtro = {};

        if (categoria) {
            filtro.categoria = categoria;
        }

        if (destacado === 'true') {
            filtro.destacado = true;
        }

        const productos = await Producto.find(filtro).sort({ createdAt: -1 });
        res.json(productos);
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// API para obtener un producto por ID
app.get('/api/productos/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(producto);
    } catch (error) {
        console.error('Error obteniendo producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para recibir datos del formulario
app.post('/contacto', async (req, res) => {
    try {
        const { nombre, email, mensaje } = req.body;

        // Crear nuevo contacto usando el modelo
        const nuevoContacto = new Contacto({
            nombre,
            email,
            mensaje
        });

        // Validar y guardar en MongoDB
        const contactoGuardado = await nuevoContacto.save();

        res.json({ 
            success: true, 
            message: 'Mensaje enviado correctamente',
            data: contactoGuardado 
        });

    } catch (error) {
        console.error('Error guardando contacto:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                error: 'Error de validación',
                detalles: errors 
            });
        }

        res.status(500).json({ 
            error: 'Error interno del servidor' 
        });
    }
});

// Endpoint para obtener todos los contactos (protegido - solo para admin)
app.get('/api/contactos', async (req, res) => {
    try {
        const contactos = await Contacto.find().sort({ createdAt: -1 });
        res.json(contactos);
    } catch (error) {
        console.error('Error obteniendo contactos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para obtener estadísticas (opcional)
app.get('/api/estadisticas', async (req, res) => {
    try {
        const totalContactos = await Contacto.countDocuments();
        const totalProductos = await Producto.countDocuments();
        const contactosHoy = await Contacto.countDocuments({
            createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        });

        res.json({
            totalContactos,
            totalProductos,
            contactosHoy
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Manejo de errores 404
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((error, req, res, next) => {
    console.error('Error global:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Inicializar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    inicializarDatos();
});