"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
// Clase que implementa la interfaz Usuario
class Persona {
    constructor(nombre) {
        this.nombre = nombre;
    }
    saludar() {
        console.log(`\n¡Hola, ${this.nombre}! ¡Bienvenido a la app!`);
        // Saludo personalizado según la hora del día
        const hora = new Date().getHours();
        let saludoTemporal = '';
        if (hora >= 5 && hora < 12) {
            saludoTemporal = '¡Que tengas un buen día!';
        }
        else if (hora >= 12 && hora < 18) {
            saludoTemporal = '¡Que tengas una buena tarde!';
        }
        else {
            saludoTemporal = '¡Que tengas una buena noche!';
        }
        console.log(saludoTemporal);
    }
}
// Función para obtener el nombre del usuario
function obtenerNombre() {
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
async function main() {
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
    }
    catch (error) {
        console.error('Ocurrió un error:', error);
    }
}
// Ejecutar la aplicación
main();
