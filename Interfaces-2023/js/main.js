document.addEventListener("DOMContentLoaded", () => {
  "use strict";
  formPreferencias.addEventListener("submit", (e) => {
    e.preventDefault();
});
const iniciarJuego = () => {
  juego.style.display = "block";
  preferencias.style.display = "none";

  let canvas = document.querySelector("#myCanvas");
  canvas.width = 800;
  canvas.height = 600;

  let jugadores = {
    g1: {
      name: "mario",
      color: "red",
    },
    g2: {
      name: "luigi",
      color: "green",
    },
  };

  let game = new Game(jugadores, canvas);

  let winnerWindow = document.querySelector(".popupJuego");
  let btnClose = document.querySelector(".close");
  let text = document.querySelector(".textoGanador");
  let btnJugar = document.querySelector(".jugar");
  let btnReset = document.querySelector(".reset");

  function showWinner(winner) {
    let txt = `¡Ganó ${winner.name}!`;
    text.innerHTML = txt;
    text.style.cssText = `box-shadow: 0px 0px 5px 7px ${winner.color};`;

    winnerWindow.classList.add("active");
  }

  const reset = () => {
    winnerWindow.classList.remove("active");
    game.reset();
    canvas.addEventListener("mousedown", mDown);
  };

  btnClose.addEventListener("click", () =>
    winnerWindow.classList.remove("active")
  );
  btnJugar.addEventListener("click", () => reset());
  btnReset.addEventListener("click", () => reset());

  game.draw();

  function mOut() {
    game.returnChipToStart();
    game.chipDropped();
    canvas.removeEventListener("mousemove", mMove);
    canvas.removeEventListener("mouseout", mOut);
    canvas.removeEventListener("mouseup", mUp);
  }

  function mUp() {
    game.chipDropped();
    let winner = game.getWinner();
    if (winner) {
      canvas.removeEventListener("mousedown", mDown);
      game.gameComplete();
      console.log("pop-up de", winner, "ganador");
      showWinner(winner);
    }
    canvas.removeEventListener("mousemove", mMove);
    canvas.removeEventListener("mouseout", mOut);
    canvas.removeEventListener("mouseup", mUp);
  }

  const mMove = (e) => {
    game.moveChip(e.offsetX, e.offsetY);
    canvas.addEventListener("mouseout", mOut);
    canvas.addEventListener("mouseup", mUp);
  };

  const mDown = (e) => {
    if (game.chipHit(e.offsetX, e.offsetY)) {
      canvas.addEventListener("mousemove", mMove);
      canvas.addEventListener("mouseup", mUp);
    }
  };

  canvas.addEventListener("mousedown", mDown);

  };

  const botonElegir = document.getElementById("iniciar");
  botonElegir.addEventListener("click", iniciarJuego);

  /*---------------------------------------------------------------------------*/
});
