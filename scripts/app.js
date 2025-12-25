const btnAnterior = document.getElementById('btn-ant');
const btnRetrocede = document.getElementById('btn-retrocede');
const btnPausa = document.getElementById('btn-pausa');
const btnAdelanta = document.getElementById('btn-adelanta');
const btnSiguiente = document.getElementById('btn-sig');
const tiempoDisplay = document.getElementById('tiempo');
const btnBuscarArchivo = document.getElementById("btn-buscar-archivo");
const playlistDiv = document.getElementById("playlist");

let audio = new Audio();
let isPlaying = false;
let carpetaPath = null;
let canciones = [];

function mostrarVista(vistaId) {
  document.querySelectorAll('.vista').forEach(div => {
    div.style.display = 'none';
  });

  document.getElementById(vistaId).style.display = 'block';

  if (vistaId == 'vista-lista'){
    renderLista();
  }
}

function renderLista(){
    playlistDiv.innerHTML = ""; // limpiar antes de volver a renderizar
    
    canciones.forEach(cancion =>{
        const div = document.createElement("div");
        div.textContent = cancion.nombre;
        div.className = "song";
        div.addEventListener("click", () => {
            audio.src = `${carpetaPath}/${cancion.audio}`;
        });
        playlistDiv.appendChild(div);
    })
    console.log("Renderizando lista:", canciones);
}

btnBuscarArchivo.addEventListener('click', async () => {
    carpetaPath = await window.electronAPI.openFolder();
    if (!carpetaPath) return;

    canciones = await window.electronAPI.leerArchivos(carpetaPath);
    renderLista();
    }
);