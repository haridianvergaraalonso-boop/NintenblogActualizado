// --- VARIABLES ---
let tasks = [];
const STORAGE_KEY = 'manageTasks';

const formNueva = document.getElementById('form-nueva');
const manageList = document.getElementById('manage-list');
const noManage = document.getElementById('no-manage');

const editModal = document.getElementById('edit-modal');
const deleteModal = document.getElementById('delete-modal');
const formEdit = document.getElementById('form-edit');
const cancelEditBtn = document.getElementById('cancel-edit');

// --- FUNCIONES DE PERSISTENCIA ---
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  tasks = stored ? JSON.parse(stored) : [];
}

// --- FUNCIONES CRUD ---
function createTask(title) {
  const newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
    titulo: title,
    completado: false
  };
  tasks.push(newTask);
  saveTasks();
}

function deleteTask(id) {
  id = Number(id);
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
}

function updateTask(id, data) {
  id = Number(id);
  const t = tasks.find(t => t.id === id);
  if (!t) return;
  Object.assign(t, data);
  saveTasks();
}

function getTaskById(id) {
  id = Number(id);
  return tasks.find(t => t.id === id);
}

function markCompleted(id) {
  id = Number(id);
  const t = tasks.find(t => t.id === id);
  if (!t) return;
  t.completado = true;
  saveTasks();
  renderManageList();
}

// --- RENDER LISTA ---
function renderManageList() {
  manageList.innerHTML = "";
  if (!tasks || tasks.length === 0) {
    noManage.style.display = 'block';
    return;
  } else {
    noManage.style.display = 'none';
  }

  tasks.forEach(t => {
    const li = document.createElement('li');
    li.style.margin = "8px 0";
    li.innerHTML = `
      <strong>${t.titulo}</strong> ${t.completado ? '(Hecho)' : ''}
      <div style="display:inline-block; margin-left:10px;">
        <button class="edit-btn" data-id="${t.id}">Editar</button>
        <button class="del-btn" data-id="${t.id}">Borrar</button>
      </div>
    `;
    manageList.appendChild(li);
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openEditModal(btn.dataset.id));
  });

  document.querySelectorAll('.del-btn').forEach(btn => {
    btn.addEventListener('click', () => openDeleteModal(btn.dataset.id));
  });
}

// --- MODAL EDITAR ---
function openEditModal(id) {
  const t = getTaskById(id);
  if (!t) return alert('Tarea no encontrada');
  document.getElementById('e-id').value = t.id;
  document.getElementById('e-title').value = t.titulo;
  editModal.style.display = 'flex';
}

formEdit.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('e-id').value;
  const title = document.getElementById('e-title').value.trim();
  if (!title) return alert('Nombre requerido');
  updateTask(id, { titulo: title });
  editModal.style.display = 'none';
  renderManageList();
});

cancelEditBtn.addEventListener('click', () => {
  editModal.style.display = 'none';
});

// --- MODAL BORRAR ---
let taskToDelete = null; // id de la tarea que queremos borrar

function openDeleteModal(id) {
  taskToDelete = Number(id);
  deleteModal.style.display = 'flex';
}

// Listeners fijos al cargar la página
document.getElementById('delete-yes').addEventListener('click', () => {
  if (taskToDelete !== null) {
    deleteTask(taskToDelete);
    renderManageList();
    taskToDelete = null;
    deleteModal.style.display = 'none';
  }
});

document.getElementById('delete-no').addEventListener('click', () => {
  taskToDelete = null;
  deleteModal.style.display = 'none';
});
// --- FORM NUEVA TAREA ---
formNueva.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('n-title').value.trim();
  if (!title) return alert('Escribe un nombre');
  createTask(title);
  document.getElementById('n-title').value = '';
  renderManageList();
});

// --- SINCRONIZACIÓN ENTRE PESTAÑAS ---
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) {
    loadTasks();
    renderManageList();
  }
});

// --- INICIALIZACIÓN ---
loadTasks();
renderManageList();