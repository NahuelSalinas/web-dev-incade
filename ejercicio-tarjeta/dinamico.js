const elemento = document.getElementById('hoodie-img');
const btnBack = document.getElementById('btn-change-back');
const btnNext = document.getElementById('btn-change-next');

// Array con las imágenes
const imagenes = [
    "./img/hoodie-front.png", 
    "./img/hoodie-back.png", 
];

// Índice de la imagen actual
let imagenActual = 0;

// Función para actualizar la imagen
function actualizarImagen() {
    elemento.src = imagenes[imagenActual];
    
    // Deshabilitar botones cuando sea necesario
    btnBack.disabled = imagenActual === 0;
    btnNext.disabled = imagenActual === imagenes.length - 1;
}

// Event listeners para los botones
btnBack.addEventListener('click', () => {
    if (imagenActual > 0) {
        imagenActual--;
        actualizarImagen();
    }
});

btnNext.addEventListener('click', () => {
    if (imagenActual < imagenes.length - 1) {
        imagenActual++;
        actualizarImagen();
    }
});

// Inicializar con la primera imagen
actualizarImagen();