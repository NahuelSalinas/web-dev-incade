document.addEventListener("DOMContentLoaded", () => {
  const carrusel = document.querySelector(".carrusel");
  
  // Si no hay carrusel, no hacemos nada
  if (!carrusel) return; 

  const items = carrusel.querySelectorAll(".item-carrusel");
  
  // 1. Crear el contenedor "inner" y mover los items adentro
  const carruselInner = document.createElement("div");
  carruselInner.classList.add("carrusel-inner");
  
  // Mover todos los items existentes dentro del nuevo "inner"
  items.forEach(item => {
    carruselInner.appendChild(item);
  });
  
  // 2) Añadir el "inner" al carrusel
  carrusel.appendChild(carruselInner);

  // 3. Crear puntos de navegación
  const dotsContainer = document.createElement("div");
  dotsContainer.classList.add("carrusel-dots");
  
  let dots = [];
  items.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.classList.add("carrusel-dot");
    dot.dataset.index = index;
    
    // Añadimos el listener al punto
    dot.addEventListener("click", () => {
      goToSlide(index);
    });
    
    dotsContainer.appendChild(dot);
    dots.push(dot);
  });
  
  carrusel.appendChild(dotsContainer);

  // 4. Lógica del Carrusel
  let currentIndex = 0;
  const totalItems = items.length;

  function goToSlide(index) {
    // Asegurarse de que el índice esté dentro de los límites
    if (index < 0) {
      index = totalItems - 1; // Loop al final
    } else if (index >= totalItems) {
      index = 0; // Loop al principio
    }
    
    // Mover el contenedor "inner"
    carruselInner.style.transform = `translateX(-${index * 100}%)`;
    currentIndex = index;
    
    // Actualizar el punto activo
    updateDots();
  }

  function updateDots() {
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  // 5. Asignar eventos a los botones
  prevButton.addEventListener("click", () => {
    goToSlide(currentIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    goToSlide(currentIndex + 1);
  });

  // Inicializar en el primer slide
  goToSlide(0);
});