import * as readline from 'readline';

// Interfaz para el usuario
interface Usuario {
    nombre: string;
    saludar(): void;
}

// Clase que implementa la interfaz Usuario
class Persona implements Usuario {
    constructor(public nombre: string) {}

    saludar(): void {
        console.log(`\n¡Hola, ${this.nombre}! ¡Bienvenido a la app!`);
        
        // Saludo personalizado según la hora del día
        const hora = new Date().getHours();
        let saludoTemporal = '';
        
        if (hora >= 5 && hora < 12) {
            saludoTemporal = '¡Que tengas un buen día!';
        } else if (hora >= 12 && hora < 18) {
            saludoTemporal = '¡Que tengas una buena tarde!';
        } else {
            saludoTemporal = '¡Que tengas una buena noche!';
        }
        
        console.log(saludoTemporal);
    }
}

// Función para obtener el nombre del usuario
function obtenerNombre(): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Por favor, ingresa tu nombre: ', (nombre) => {
            rl.close();
            resolve(nombre.trim());
        });
    });
}

// Función principal
async function main(): Promise<void> {
    try {
        console.log('=== SALUDO PERSONALIZADO ===');
        
        const nombreUsuario = await obtenerNombre();
        
        // Validar que el nombre no esté vacío
        if (!nombreUsuario) {
            console.log('\nNo ingresaste ningún nombre. Por favor, intenta de nuevo.');
            return;
        }
        
        // Crear instancia de Persona y saludar
        const usuario = new Persona(nombreUsuario);
        usuario.saludar();
        
    } catch (error) {
        console.error('Ocurrió un error:', error);
    }
}

// Ejecutar la aplicación
main();