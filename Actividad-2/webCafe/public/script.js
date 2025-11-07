// script.js - Existen rutas que no se implemenaron en la UI, pero están listas en el backend para futuras expansiones.
"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class FormularioContacto {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.mensajeExito = document.getElementById('mensajeExito');
        this.inicializarEventos();
        this.cargarProductos();
        this.cargarEstadisticas(); // Cargar estadísticas
    }

    inicializarEventos() {
        this.form.addEventListener('submit', (e) => this.manejarEnvio(e));
        // Validación en tiempo real
        const nombreInput = document.getElementById('nombre');
        const emailInput = document.getElementById('email');
        const mensajeInput = document.getElementById('mensaje');
        nombreInput.addEventListener('blur', () => this.validarNombre());
        emailInput.addEventListener('blur', () => this.validarEmail());
        mensajeInput.addEventListener('blur', () => this.validarMensaje());
    }

    validarNombre() {
        const nombreInput = document.getElementById('nombre');
        const errorSpan = document.getElementById('errorNombre');
        const nombre = nombreInput.value.trim();
        if (nombre === '') {
            errorSpan.textContent = 'El nombre es obligatorio';
            return false;
        }
        if (nombre.length < 2) {
            errorSpan.textContent = 'El nombre debe tener al menos 2 caracteres';
            return false;
        }
        errorSpan.textContent = '';
        return true;
    }

    validarEmail() {
        const emailInput = document.getElementById('email');
        const errorSpan = document.getElementById('errorEmail');
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            errorSpan.textContent = 'El email es obligatorio';
            return false;
        }
        if (!emailRegex.test(email)) {
            errorSpan.textContent = 'El formato del email no es válido';
            return false;
        }
        errorSpan.textContent = '';
        return true;
    }

    validarMensaje() {
        const mensajeInput = document.getElementById('mensaje');
        const errorSpan = document.getElementById('errorMensaje');
        const mensaje = mensajeInput.value.trim();
        if (mensaje === '') {
            errorSpan.textContent = 'El mensaje es obligatorio';
            return false;
        }
        if (mensaje.length < 10) {
            errorSpan.textContent = 'El mensaje debe tener al menos 10 caracteres';
            return false;
        }
        errorSpan.textContent = '';
        return true;
    }

    manejarEnvio(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const esNombreValido = this.validarNombre();
            const esEmailValido = this.validarEmail();
            const esMensajeValido = this.validarMensaje();
            if (esNombreValido && esEmailValido && esMensajeValido) {
                const formData = {
                    nombre: document.getElementById('nombre').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    mensaje: document.getElementById('mensaje').value.trim()
                };
                try {
                    const response = yield fetch('/contacto', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });
                    const result = yield response.json();
                    if (response.ok && result.success) {
                        this.mostrarMensajeExito('¡Mensaje enviado correctamente! Pronto nos contactaremos contigo.');
                        this.form.reset();
                        this.actualizarEstadisticas(); // Actualizar stats si es necesario
                    }
                    else {
                        const mensajeError = result.detalles ? result.detalles.join(', ') : result.error || 'Error al enviar el mensaje';
                        throw new Error(mensajeError);
                    }
                }
                catch (error) {
                    const mensajeError = error instanceof Error ? error.message : 'Error de conexión. Intenta nuevamente.';
                    this.mostrarMensajeExito(mensajeError, true);
                }
            }
        });
    }

    mostrarMensajeExito(mensaje, esError = false) {
        this.mensajeExito.textContent = mensaje;
        this.mensajeExito.className = esError ? 'mensaje-error' : 'mensaje-exito';
        this.mensajeExito.style.display = 'block';
        setTimeout(() => {
            this.mensajeExito.style.display = 'none';
        }, 5000);
    }

    cargarProductos() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('/api/productos');
                if (!response.ok) {
                    throw new Error('Error al cargar productos');
                }
                const productos = yield response.json();
                this.renderizarProductos(productos);
            }
            catch (error) {
                console.error('Error al cargar productos:', error);
                this.mostrarErrorProductos();
            }
        });
    }

    renderizarProductos(productos) {
        const contenedor = document.getElementById('listaProductos');
        if (productos.length === 0) {
            contenedor.innerHTML = `
                <div class="no-productos">
                    <p>No hay productos disponibles en este momento</p>
                </div>
            `;
            return;
        }
        const productosHTML = productos.map(producto => `
            <div class="producto-item" data-categoria="${producto.categoria}">
                <img src="${producto.imagen}" alt="${producto.nombre}" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=Imagen+No+Disponible'">
                <h4>${producto.nombre}</h4>
                <p>${producto.descripcion}</p>
                <div class="producto-info">
                    <span class="precio">$${producto.precio.toLocaleString()}</span>
                    ${producto.destacado ? '<span class="destacado">⭐ Destacado</span>' : ''}
                </div>
                <span class="categoria">${this.formatearCategoria(producto.categoria)}</span>
            </div>
        `).join('');
        contenedor.innerHTML = productosHTML;
    }
    formatearCategoria(categoria) {
        const categorias = {
            'cafe': 'Café en Grano',
            'capsulas': 'Cápsulas',
            'accesorios': 'Accesorios'
        };
        return categorias[categoria] || categoria;
    }
    mostrarErrorProductos() {
        const contenedor = document.getElementById('listaProductos');
        contenedor.innerHTML = `
            <div class="error-productos">
                <p>Error al cargar los productos. Por favor, intenta nuevamente más tarde.</p>
            </div>
        `;
    }

    cargarEstadisticas() {
        return __awaiter(this, void 0, void 0, function* () {
            // Opcional: cargar estadísticas si quieres mostrarlas
            try {
                const response = yield fetch('/api/estadisticas');
                if (response.ok) {
                    const stats = yield response.json();
                    console.log('Estadísticas:', stats);
                }
            }
            catch (error) {
                console.error('Error cargando estadísticas:', error);
            }
        });
    }

    actualizarEstadisticas() {
        this.cargarEstadisticas();
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new FormularioContacto();
});

// Exportar para pruebas
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FormularioContacto };
}