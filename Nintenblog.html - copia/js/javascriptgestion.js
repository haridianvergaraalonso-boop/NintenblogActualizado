const formNueva = document.getElementById('form-nueva');
const manageList = document.getElementById('manage-list');
const noManage = document.getElementById('no-manage');

const editModal = document.getElementById('edit-modal');
const formEdit = document.getElementById('form-edit');
const cancelEditBtn = document.getElementById('cancel-edit');

function renderManageList() {

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
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (confirm('¿Borrar esta tarea?')) {
        deleteTask(id);

        renderManageList();
      }
    });
  });
}

formNueva.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('n-title').value.trim();
  if (!title) return alert('Escribe un nombre');
  createTask(title);
  document.getElementById('n-title').value = '';
  renderManageList();
});

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


renderManageList();


window.addEventListener('storage', (e) => {
  if (e.key === 'tasks') {
    loadTasks();
    renderManageList();
  }
});