const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        trim: true
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser negativo']
    },
    imagen: {
        type: String,
        required: [true, 'La imagen es obligatoria']
    },
    categoria: {
        type: String,
        enum: ['cafe', 'capsulas', 'accesorios'],
        default: 'cafe'
    },
    disponible: {
        type: Boolean,
        default: true
    },
    destacado: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Producto', productoSchema);