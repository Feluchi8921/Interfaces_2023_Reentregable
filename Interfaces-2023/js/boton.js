// Obtén todos los elementos con la clase "miBoton"
var botones = document.querySelectorAll(".miBoton");

// Registra un controlador de eventos para cada botón
botones.forEach(function(boton) {
  boton.addEventListener("click", function() {
    // Obtiene la imagen dentro del botón actual
    var imagen = this.querySelector("img");

    // Obtiene la ruta actual de la imagen
    var imagenActual = imagen.src;

    // Obtiene la ruta de la otra imagen
    var imagenAlternativa = (imagenActual.includes("img/carritoMas.svg")) ? "img/carritocomprado.svg" : "img/carritoMas.svg";

    // Cambia la imagen modificando el atributo src
    imagen.src = imagenAlternativa;
  });
});

// Obtén todos los elementos con la clase "miBoton"
var botones = document.querySelectorAll(".miBotonCard");

// Registra un controlador de eventos para cada botón
botones.forEach(function(boton) {
  boton.addEventListener("click", function() {
    // Obtiene la imagen dentro del botón actual
    var imagen = this.querySelector("img");

    // Obtiene la ruta actual de la imagen
    var imagenActual = imagen.src;

    // Obtiene la ruta de la otra imagen
    var imagenAlternativa = (imagenActual.includes("img/carritoMas.svg")) ? "img/carritocomprado.svg" : "img/carritoMas.svg";

    // Cambia la imagen modificando el atributo src
    imagen.src = imagenAlternativa;
  });
});