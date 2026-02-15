/**
 * Frontend - Gestión de Usuarios
 * Arquitectura 3 capas - Capa de presentación
 *
 * Consume la API REST del backend para operaciones CRUD.
 * La URL del API se obtiene de la variable de entorno o configuración.
 */

// URL del backend: nginx hace proxy de /api -> backend
const API_BASE = '/api';

/**
 * Obtiene la URL base del API
 * En producción, el proxy de nginx redirige /api -> backend
 */
function getApiUrl(path = '') {
  return `${API_BASE.replace(/\/$/, '')}${path.startsWith('/') ? path : '/' + path}`;
}

/**
 * Realiza una petición fetch con manejo de errores
 */
async function apiRequest(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || data.error || `Error ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

/**
 * Lista todos los usuarios
 */
async function listUsers() {
  return apiRequest(getApiUrl('/users'));
}

/**
 * Crea un usuario
 */
async function createUser(name, email) {
  return apiRequest(getApiUrl('/users'), {
    method: 'POST',
    body: JSON.stringify({ name, email }),
  });
}

/**
 * Obtiene un usuario por ID
 */
async function getUser(id) {
  return apiRequest(getApiUrl(`/users/${id}`));
}

/**
 * Actualiza un usuario
 */
async function updateUser(id, data) {
  return apiRequest(getApiUrl(`/users/${id}`), {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Elimina un usuario
 */
async function deleteUser(id) {
  return apiRequest(getApiUrl(`/users/${id}`), { method: 'DELETE' });
}

/**
 * Renderiza la lista de usuarios
 */
function renderUserList(users) {
  const list = document.getElementById('userList');
  list.innerHTML = '';

  if (!users || users.length === 0) {
    list.innerHTML = '<li class="empty">No hay usuarios registrados</li>';
    return;
  }

  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="user-info">
        <strong>${escapeHtml(user.name)}</strong>
        <span>${escapeHtml(user.email)}</span>
      </div>
      <div class="user-actions">
        <button data-id="${user.id}">Ver / Editar</button>
      </div>
    `;
    li.querySelector('button').addEventListener('click', () => openModal(user.id));
    list.appendChild(li);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Carga y muestra la lista de usuarios
 */
async function loadUsers() {
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const list = document.getElementById('userList');

  loading.hidden = false;
  error.hidden = true;
  list.innerHTML = '';

  try {
    const users = await listUsers();
    renderUserList(users);
  } catch (err) {
    error.textContent = err.message || 'Error al cargar usuarios';
    error.hidden = false;
  } finally {
    loading.hidden = true;
  }
}

/**
 * Abre el modal de edición
 */
async function openModal(userId) {
  const modal = document.getElementById('modal');
  modal.hidden = false;

  try {
    const user = await getUser(userId);
    document.getElementById('editId').value = user.id;
    document.getElementById('editName').value = user.name;
    document.getElementById('editEmail').value = user.email;
  } catch (err) {
    alert('Error al cargar usuario: ' + err.message);
    closeModal();
  }
}

function closeModal() {
  document.getElementById('modal').hidden = true;
}

// Event listeners
document.getElementById('userForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();

  try {
    await createUser(name, email);
    document.getElementById('userForm').reset();
    loadUsers();
  } catch (err) {
    alert('Error al crear usuario: ' + err.message);
  }
});

document.getElementById('editForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('editId').value;
  const name = document.getElementById('editName').value.trim();
  const email = document.getElementById('editEmail').value.trim();

  try {
    await updateUser(id, { name, email });
    closeModal();
    loadUsers();
  } catch (err) {
    alert('Error al actualizar: ' + err.message);
  }
});

document.getElementById('btnDelete').addEventListener('click', async () => {
  if (!confirm('¿Eliminar este usuario?')) return;

  const id = document.getElementById('editId').value;
  try {
    await deleteUser(id);
    closeModal();
    loadUsers();
  } catch (err) {
    alert('Error al eliminar: ' + err.message);
  }
});

document.getElementById('modalClose').addEventListener('click', closeModal);

document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target.id === 'modal') closeModal();
});

// Carga inicial
loadUsers();
