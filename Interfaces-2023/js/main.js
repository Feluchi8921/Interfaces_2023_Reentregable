document.addEventListener('DOMContentLoaded', () => {
  "use strict";
  /*--------------------Preferencias---------------------*/
  const root = document.documentElement;
  var rows = parseInt(getComputedStyle(root).getPropertyValue("--var--rows"));
  var cols = parseInt(getComputedStyle(root).getPropertyValue("--var--cols"));

  const preferencias = document.getElementById("preferencias");
  const juego = document.getElementById("juego");
  const formPreferencias = document.getElementById("formPreferencias");
  let jugador1 = document.getElementById("j1");
  let jugador2 = document.getElementById("j2");

  // Debes usar "formPreferencias" en lugar de "formulario" para que coincida con el ID del formulario.
  formPreferencias.addEventListener("submit", (e) => {
      e.preventDefault();
  });

  const elegirPreferencias = () => {
      var variantes = document.getElementById("n_juego").value;
      if (variantes == 4) { 
          document.documentElement.style.setProperty("--var--rows", variantes); 
      }

      juego.style.display = "block";
      preferencias.style.display = "none";

      rows = parseInt(getComputedStyle(root).getPropertyValue("--var--rows"));
      cols = parseInt(getComputedStyle(root).getPropertyValue("--var--cols"));
      let canvas = document.querySelector('#myCanvas');
  canvas.width = 800;
  canvas.height = 600;
    
  let jugadores = {
    'g1' : {
        name: 'mario',
        color: 'red'
    },
    'g2' : {
        name: 'luigi',
        color: 'green'
    }
};

let game = new Game(jugadores, canvas);

let winnerWindow = document.querySelector('.popupJuego');
let btnClose = document.querySelector('.close');
let text = document.querySelector('.textoGanador');
let btnJugar = document.querySelector('.jugar');
let btnReset = document.querySelector('.reset');

      function showWinner(winner) {
          let txt = `¡Ganó ${winner.name}!`;
          text.innerHTML = txt;
          text.style.cssText = `box-shadow: 0px 0px 5px 7px ${winner.color};`;

          winnerWindow.classList.add('active');
      }

      const reset = () => {
          winnerWindow.classList.remove('active');
          game.reset();
          canvas.addEventListener('mousedown', mDown);
      };

      btnClose.addEventListener('click', () => winnerWindow.classList.remove('active'));
      btnJugar.addEventListener('click', () => reset());
      btnReset.addEventListener('click', () => reset());

      game.draw();

    function mOut() {
        game.returnChipToStart();
        game.chipDropped();
        canvas.removeEventListener('mousemove', mMove);
        canvas.removeEventListener('mouseout', mOut);
        canvas.removeEventListener('mouseup', mUp);
    }

    function mUp() {
        game.chipDropped();
        let winner = game.getWinner(); 
        if(winner) {
            canvas.removeEventListener('mousedown', mDown);
            game.gameComplete();
            console.log('pop-up de', winner,'ganador');
            showWinner(winner);
        }
        canvas.removeEventListener('mousemove', mMove);
        canvas.removeEventListener('mouseout', mOut)
        canvas.removeEventListener('mouseup', mUp);
    }

    const mMove = (e) => {

        game.moveChip(e.offsetX, e.offsetY);
        canvas.addEventListener('mouseout', mOut);
        canvas.addEventListener('mouseup', mUp);
    }

    const mDown = (e) => {
        if(game.chipHit(e.offsetX, e.offsetY)) {
            canvas.addEventListener('mousemove', mMove);
            canvas.addEventListener('mouseup', mUp);
        } 
    };

    canvas.addEventListener('mousedown', mDown);

  };

  const botonElegir = document.getElementById("iniciar");
  botonElegir.addEventListener("click", elegirPreferencias);

  /*---------------------------------------------------------------------------*/


  
    
}
);
