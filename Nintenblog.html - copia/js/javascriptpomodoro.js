// javascriptpomodoro.js (reemplaza el actual)
let tasks = []; // ahora será cargado desde localStorage
let time = 0;
let timer = null;
let breakTimer = null;
let current = null;

// Referencias DOM
const hadd = document.querySelector("#hadd");
const inputTask = document.querySelector("#wrotetasks");
const form = document.querySelector("#form");
const taskName = document.querySelector("#taskName");

// --- LocalStorage helpers ---
const STORAGE_KEY = "tasks";

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      tasks = JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing tasks from localStorage", e);
      tasks = [];
    }
  } else {
    tasks = [];
  }
}

// --- CRUD local (se usan desde gestionar.html) ---
function createTask(valor) {
  const nuevaTarea = {
    id: (Math.random() * 100).toString(36).slice(2),
    titulo: valor,
    completado: false,
  };
  tasks.unshift(nuevaTarea);
  saveTasks();       // guardar siempre que cambie
  return nuevaTarea;
}

function updateTask(id, updates) {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return null;
  tasks[idx] = {...tasks[idx], ...updates};
  saveTasks();
  return tasks[idx];
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
}

function getTaskById(id) {
  return tasks.find(t => t.id === id) || null;
}

// --- Inicialización y UI ---
// Escucha del formulario (añadir desde la misma página si quieres)
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (inputTask.value.trim() === "") {
    alert("Oye, debes poner una tarea aqui!🤭");
    return;
  }

  // Si quieres añadir desde esta página también:
  createTask(inputTask.value.trim());
  inputTask.value = "";
  renderTasks();
});

// Función para mostrar las tareas (Read)
function renderTasks() {
  const html = tasks.map((tarea) => {
    return `
      <div class="tarea">
        <div class="completado">
          ${tarea.completado
            ? "<span class='done'>Hecho</span>"
            : `<button class="start-button" data-id="${tarea.id}">Start</button>`
          }
        </div>
        <div class="titulo">${tarea.titulo}</div>
      </div>
    `;
  });

  const tasksContainer = document.querySelector("#tasks");
  tasksContainer.innerHTML = html.join("");

  const startButtons = document.querySelectorAll(".start-button");

  startButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      if (!time) {
        const id = button.getAttribute("data-id");
        startButtonHandler(id);
        button.textContent = "En proceso...🍄";
      }
    });
  });
}

function startButtonHandler(id) {
  time = 25 * 60;
  current = id;
  const taskIndex = tasks.findIndex((task) => task.id == id);
  if (taskIndex === -1) return;
  taskName.textContent = tasks[taskIndex].titulo;

  timer = setInterval(() => {
    timerHandler(id);
  }, 1000);
}

function timerHandler(id) {
  time--;
  renderTime();

  if (time === 0) {
    clearInterval(timer);
    markCompleted(id);
    renderTasks();
    startBreak();
  }
}

function startBreak() {
  time = 5 * 60;
  taskName.textContent = "Break!!🥇";
  breakTimer = setInterval(() => {
    timerBreakHandler();
  }, 1000);
}

function timerBreakHandler() {
  time--;
  renderTime();

  if (time === 0) {
    clearInterval(breakTimer);
    current = null;
    taskName.textContent = ""; 
    renderTasks();
  }
}

function renderTime() {
  const timeDiv = document.querySelector("#value");
  const minutes = parseInt(time / 60);
  const seconds = parseInt(time % 60);

  timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function markCompleted(id) {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) return;
  tasks[taskIndex].completado = true;
  saveTasks(); // importante: guardar el cambio
}

// --- reactividad / sincronización ---
// Cargar tareas al arrancar la página
loadTasks();
renderTasks();

// Si las tareas se actualizan desde otra pestaña/ventana, recargar la lista automáticamente
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) {
    loadTasks();
    renderTasks();
  }
}
);