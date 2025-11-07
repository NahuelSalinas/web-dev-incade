// Interfaces actualizadas
interface ContactForm {
    nombre: string;
    email: string;
    mensaje: string;
}

interface Producto {
    _id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    categoria: string;
    disponible: boolean;
    destacado: boolean;
    createdAt: string;
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    detalles?: string[];
}

class FormularioContacto {
    private form: HTMLFormElement;
    private mensajeExito: HTMLElement;

    constructor() {
        this.form = document.getElementById('contactForm') as HTMLFormElement;
        this.mensajeExito = document.getElementById('mensajeExito') as HTMLElement;
        this.inicializarEventos();
        this.cargarProductos();
        this.cargarEstadisticas(); // Opcional: cargar estadísticas
    }

    private inicializarEventos(): void {
        this.form.addEventListener('submit', (e) => this.manejarEnvio(e));
        
        // Validación en tiempo real
        const nombreInput = document.getElementById('nombre') as HTMLInputElement;
        const emailInput = document.getElementById('email') as HTMLInputElement;
        const mensajeInput = document.getElementById('mensaje') as HTMLTextAreaElement;
        
        nombreInput.addEventListener('blur', () => this.validarNombre());
        emailInput.addEventListener('blur', () => this.validarEmail());
        mensajeInput.addEventListener('blur', () => this.validarMensaje());
    }

    private validarNombre(): boolean {
        const nombreInput = document.getElementById('nombre') as HTMLInputElement;
        const errorSpan = document.getElementById('errorNombre') as HTMLElement;
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

    private validarEmail(): boolean {
        const emailInput = document.getElementById('email') as HTMLInputElement;
        const errorSpan = document.getElementById('errorEmail') as HTMLElement;
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

    private validarMensaje(): boolean {
        const mensajeInput = document.getElementById('mensaje') as HTMLTextAreaElement;
        const errorSpan = document.getElementById('errorMensaje') as HTMLElement;
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

    private async manejarEnvio(event: Event): Promise<void> {
        event.preventDefault();

        const esNombreValido = this.validarNombre();
        const esEmailValido = this.validarEmail();
        const esMensajeValido = this.validarMensaje();

        if (esNombreValido && esEmailValido && esMensajeValido) {
            const formData: ContactForm = {
                nombre: (document.getElementById('nombre') as HTMLInputElement).value.trim(),
                email: (document.getElementById('email') as HTMLInputElement).value.trim(),
                mensaje: (document.getElementById('mensaje') as HTMLTextAreaElement).value.trim()
            };

            try {
                const response = await fetch('/contacto', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result: ApiResponse<any> = await response.json();

                if (response.ok && result.success) {
                    this.mostrarMensajeExito('¡Mensaje enviado correctamente! Pronto nos contactaremos contigo.');
                    this.form.reset();
                    this.actualizarEstadisticas(); // Actualizar stats si es necesario
                } else {
                    const mensajeError = result.detalles ? result.detalles.join(', ') : result.error || 'Error al enviar el mensaje';
                    throw new Error(mensajeError);
                }
            } catch (error) {
                const mensajeError = error instanceof Error ? error.message : 'Error de conexión. Intenta nuevamente.';
                this.mostrarMensajeExito(mensajeError, true);
            }
        }
    }

    private mostrarMensajeExito(mensaje: string, esError: boolean = false): void {
        this.mensajeExito.textContent = mensaje;
        this.mensajeExito.className = esError ? 'mensaje-error' : 'mensaje-exito';
        this.mensajeExito.style.display = 'block';

        setTimeout(() => {
            this.mensajeExito.style.display = 'none';
        }, 5000);
    }

    private async cargarProductos(): Promise<void> {
        try {
            // Puedes agregar parámetros como: /api/productos?destacado=true
            const response = await fetch('/api/productos');
            
            if (!response.ok) {
                throw new Error('Error al cargar productos');
            }

            const productos: Producto[] = await response.json();
            this.renderizarProductos(productos);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            this.mostrarErrorProductos();
        }
    }

    private renderizarProductos(productos: Producto[]): void {
        const contenedor = document.getElementById('listaProductos') as HTMLElement;
        
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

    private formatearCategoria(categoria: string): string {
        const categorias: { [key: string]: string } = {
            'cafe': 'Café en Grano',
            'capsulas': 'Cápsulas',
            'accesorios': 'Accesorios'
        };
        return categorias[categoria] || categoria;
    }

    private mostrarErrorProductos(): void {
        const contenedor = document.getElementById('listaProductos') as HTMLElement;
        contenedor.innerHTML = `
            <div class="error-productos">
                <p>Error al cargar los productos. Por favor, intenta nuevamente más tarde.</p>
            </div>
        `;
    }

    private async cargarEstadisticas(): Promise<void> {
        // Opcional: cargar estadísticas si quieres mostrarlas
        try {
            const response = await fetch('/api/estadisticas');
            if (response.ok) {
                const stats = await response.json();
                console.log('Estadísticas:', stats);
                // Puedes mostrar estas estadísticas en algún lugar de la UI
            }
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
        }
    }

    private actualizarEstadisticas(): void {
        // Actualizar estadísticas después de enviar un mensaje
        this.cargarEstadisticas();
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new FormularioContacto();
});
