const btnAnterior = document.getElementById('btn-ant');
const btnRetrocede = document.getElementById('btn-retrocede');
const btnPausa = document.getElementById('btn-pausa');
const btnAdelanta = document.getElementById('btn-adelanta');
const btnSiguiente = document.getElementById('btn-sig');
const btnBuscarArchivo = document.getElementById("btn-buscar-archivo");
const sliderTiempo = document.getElementById('slider-tiempo');
const playlistDiv = document.getElementById("playlist");
const tiempoSpan = document.getElementById("tiempo-span");
const duracionSpan = document.getElementById("duracion-span");
const nombreCancionSpan = document.getElementById('nombre-cancion-span');
const divLetra = document.getElementById('div-letra');

let audio = new Audio();
let isPlaying = false;
let carpetaPath = null;
let canciones = [];
let cancionReproduciendo = null;

function mostrarVista(vistaId) {
  document.querySelectorAll('.vista').forEach(div => {
    div.style.display = 'none';
  });

  document.getElementById(vistaId).style.display = 'block';

  if (vistaId == 'vista-lista'){
    renderLista();
  }
  if (vistaId == 'vista-reproduciendo') {
    if (canciones.length > 0 && cancionReproduciendo != null) {
      btnAnterior.disabled = false;
      btnSiguiente.disabled = false;
      nombreCancionSpan.textContent = cancionReproduciendo.nombre;
    } else {
      btnAnterior.disabled = true;
      btnSiguiente.disabled = true;
    }
    if (cancionReproduciendo == null) {
      sliderTiempo.disabled = true;
    } else {
      sliderTiempo.disabled = false;
      divLetra.textContent = cancionReproduciendo.letra;
    }
  }
}

function renderLista(){
    playlistDiv.innerHTML = ""; // limpiar antes de volver a renderizar
    
    canciones.forEach(cancion =>{
        const div = document.createElement("div");
        div.textContent = cancion.nombre;
        div.className = "song";
        div.addEventListener("click", () => {
            cancionReproduciendo = cancion;
            audio.src = `${carpetaPath}/${cancion.audio}`;
            audio.play();
            isPlaying = true;
            console.log(cancion.id);
            mostrarVista('vista-reproduciendo');
        });
        playlistDiv.appendChild(div);
    })
    console.log("Renderizando lista:", canciones);
}

audio.addEventListener('timeupdate', () => {
  const tiempoActual = audio.currentTime;
  const tiempoDuracion = audio.duration;
  tiempoSpan.textContent = escribirTiempo(tiempoActual);
  duracionSpan.textContent = escribirTiempo(tiempoDuracion);
  sliderTiempo.value = tiempoActual * 100 / tiempoDuracion;
});

function escribirTiempo(segundos) {
  if (isNaN(segundos)) return '00:00';
  const minutos = Math.floor(segundos / 60);
  const seg = Math.floor(segundos % 60);
  return `${minutos.toString().padStart(2,'0')}:${seg.toString().padStart(2,'0')}`;
};

function controlTiempo() {
  nuevoTiempo = sliderTiempo.value * audio.duration / 100;
  audio.currentTime = nuevoTiempo;
}

btnBuscarArchivo.addEventListener('click', async () => {
    carpetaPath = await window.electronAPI.openFolder();
    if (!carpetaPath) return;

    canciones = await window.electronAPI.leerArchivos(carpetaPath);
    renderLista();
    }
);

btnPausa.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play();
  }
});

audio.addEventListener('play', () => {
  isPlaying = true;
  btnPausa.textContent = 'pausar';
});

audio.addEventListener('pause', () => {
  isPlaying = false;
  btnPausa.textContent = 'reproducir';
});

btnAdelanta.addEventListener('click', () => {
  if (audio.currentTime > audio.duration - 5) {
    nuevoTiempo = audio.duration;
  } else {
    nuevoTiempo = audio.currentTime + 5;
  }
  audio.currentTime = nuevoTiempo;
});

btnRetrocede.addEventListener('click', () => {
  if (audio.currentTime < 5) {
    nuevoTiempo = 0;
  } else {
    nuevoTiempo = audio.currentTime - 5;
  }
  audio.currentTime = nuevoTiempo;
});

function encontrarIndex(cancion) {
  let index = null;
  let i = 0;
  while (i < canciones.length) {
    cancion = canciones[i]
    if (cancion == cancionReproduciendo) {
      index = i;
    }
    i++;
  }
  return index;
}

btnSiguiente.addEventListener('click', () => {
  let nuevoIndex = null;
  let index = encontrarIndex(cancionReproduciendo);

  if (index == canciones.length - 1 || isNaN(index)) {
    nuevoIndex = 0;
  } else {
    nuevoIndex = index + 1;
  }
  cancionReproduciendo = canciones[nuevoIndex];
  audio.src = `${carpetaPath}/${cancionReproduciendo.audio}`;
  audio.play();
  mostrarVista('vista-reproduciendo');
});

btnAnterior.addEventListener('click', () => {
  let nuevoIndex = null;
  let index = encontrarIndex(cancionReproduciendo);

  if (index == 0 || isNaN(index)) {
    nuevoIndex = canciones.length - 1;
  } else {
    nuevoIndex = index - 1;
  }
  cancionReproduciendo = canciones[nuevoIndex];
  audio.src = `${carpetaPath}/${cancionReproduciendo.audio}`;
  audio.play();
  mostrarVista('vista-reproduciendo');
});