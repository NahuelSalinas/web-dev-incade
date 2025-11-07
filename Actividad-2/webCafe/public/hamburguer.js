// Espera a que todo el contenido HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {

    // 1. Selecciona los elementos del DOM que necesitamos
    const hamburgerBtn = document.getElementById('hamburger');
    const menu = document.querySelector('.menu');
    const overlay = document.querySelector('.menu-overlay');
    const body = document.body;

    // 2. Comprueba que todos los elementos existan
    if (hamburgerBtn && menu && overlay) {

        // 3. Define la función que hace la magia
        const toggleMenu = () => {
            hamburgerBtn.classList.toggle('active');
            menu.classList.toggle('active');
            overlay.classList.toggle('active');
            body.classList.toggle('menu-open');
        };

        // 4. Añade el "listener" al botón hamburguesa
        hamburgerBtn.addEventListener('click', toggleMenu);

        // 5. Cierra el menú si se hace clic en el overlay
        overlay.addEventListener('click', toggleMenu);

    } else {
        // Muestra un error en la consola si falta algún elemento
        console.error('No se encontraron los elementos del menú (hamburger, menu o menu-overlay).');
    }
});