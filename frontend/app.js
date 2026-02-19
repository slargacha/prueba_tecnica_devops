/**
 * Frontend - Gestión de Usuarios (Capa 1)
 * Llama a la API bajo /api (proxy nginx -> backend). Lista, crea, actualiza y elimina usuarios.
 */

var API = '/api';

/** Petición genérica a la API: GET por defecto, JSON; lanza Error si !res.ok. */
function api(path, opts) {
  return fetch(API + path, {
    headers: { 'Content-Type': 'application/json' },
    method: opts && opts.method || 'GET',
    body: opts && opts.body
  }).then(function (res) {
    if (!res.ok) return res.json().then(function (d) { throw new Error(d.message || 'Error'); });
    return res.status === 204 ? null : res.json();
  });
}

function listUsers() { return api('/users?_t=' + Date.now()); }
function getUserById(id) { return api('/users/' + id); }
function createUser(name, email) { return api('/users', { method: 'POST', body: JSON.stringify({ name: name, email: email }) }); }
function updateUser(id, data) { return api('/users/' + id, { method: 'PUT', body: JSON.stringify(data) }); }
function deleteUser(id) { return api('/users/' + id, { method: 'DELETE' }); }

/** Muestra u oculta mensaje en #message; isErr=true para estilo error. */
function msg(text, isErr) {
  var el = document.getElementById('message');
  el.textContent = text || '';
  el.className = isErr ? 'message error' : 'message';
}

/** Escapa HTML para evitar XSS al pintar nombre/email en la tabla. */
function escapeHtml(s) {
  var d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// --- Modal Editar usuario ---
var modal = document.getElementById('modalOverlay');
var editForm = document.getElementById('editForm');
var editId = document.getElementById('editId');
var editName = document.getElementById('editName');
var editEmail = document.getElementById('editEmail');
var modalCancel = document.getElementById('modalCancel');

function openEditModal(user) {
  editId.value = user.id;
  editName.value = user.name || '';
  editEmail.value = user.email || '';
  modal.classList.add('modal-open');
  modal.setAttribute('aria-hidden', 'false');
  editName.focus();
}

function closeEditModal() {
  modal.classList.remove('modal-open');
  modal.setAttribute('aria-hidden', 'true');
}

modalCancel.onclick = closeEditModal;
modal.addEventListener('click', function(e) {
  if (e.target === modal) closeEditModal();
});

// --- Modal Confirmar eliminación ---
var confirmOverlay = document.getElementById('confirmOverlay');
var confirmCancel = document.getElementById('confirmCancel');
var confirmAccept = document.getElementById('confirmAccept');
var deleteUserId = null;

function openConfirmModal(userId) {
  deleteUserId = userId;
  confirmOverlay.classList.add('modal-open');
  confirmOverlay.setAttribute('aria-hidden', 'false');
}

function closeConfirmModal() {
  deleteUserId = null;
  confirmOverlay.classList.remove('modal-open');
  confirmOverlay.setAttribute('aria-hidden', 'true');
}

confirmCancel.onclick = closeConfirmModal;
confirmOverlay.addEventListener('click', function(e) {
  if (e.target === confirmOverlay) closeConfirmModal();
});

confirmAccept.onclick = function() {
  if (!deleteUserId) return;
  msg('Eliminando...');
  deleteUser(deleteUserId).then(function() {
    msg('');
    closeConfirmModal();
    load();
  }).catch(function(err) {
    msg(err.message, true);
  });
};

/** Envío del formulario de edición: PUT y recarga lista. */
editForm.onsubmit = function(e) {
  e.preventDefault();
  var id = editId.value;
  var name = editName.value.trim();
  var email = editEmail.value.trim();
  msg('Guardando...');
  updateUser(id, { name: name, email: email })
    .then(function() {
      msg('');
      closeEditModal();
      load();
    })
    .catch(function(err) {
      msg(err.message || 'Error al actualizar', true);
    });
};

/** Pinta la tabla de usuarios (ID, Nombre, Email, Acciones); vacío o lista con botones Actualizar/Eliminar. */
function render(users) {
  var tbody = document.getElementById('userList');
  tbody.innerHTML = '';
  if (!users || users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-row">No hay usuarios</td></tr>';
    return;
  }
  for (var i = 0; i < users.length; i++) {
    var u = users[i];
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>' + escapeHtml(String(u.id)) + '</td><td>' + escapeHtml(u.name) + '</td><td>' + escapeHtml(u.email) + '</td><td class="cell-actions"><button class="btn btn-sm btn-primary btn-update" data-id="' + u.id + '">Actualizar</button> <button class="btn btn-sm btn-danger btn-delete" data-id="' + u.id + '">Eliminar</button></td>';
    (function(usr) {
      tr.querySelector('.btn-update').onclick = function() { openEditModal(usr); };
      tr.querySelector('.btn-delete').onclick = function() {
        openConfirmModal(usr.id);
      };
    })(u);
    tbody.appendChild(tr);
  }
}

var loadRetries = 0;
var maxLoadRetries = 20;

/** Carga la lista desde la API; reintenta hasta maxLoadRetries si falla (API arrancando). */
function load() {
  listUsers()
    .then(function(data) {
      loadRetries = 0;
      var users = Array.isArray(data) ? data : (data && data.users) ? data.users : [];
      if (!Array.isArray(data) && data && typeof data === 'object' && !data.users) {
        msg('La API no devolvio una lista. Compruebe GET /api/users', true);
      } else {
        msg('');
      }
      render(users);
    })
    .catch(function(err) {
      render([]);
      var errMsg = (err && err.message) ? err.message : 'Error al cargar';
      if (loadRetries < maxLoadRetries) {
        loadRetries++;
        msg(errMsg + ' - Reintento en 3 s (' + loadRetries + '/' + maxLoadRetries + ')', true);
        setTimeout(load, 3000);
      } else {
        msg('No se pudo conectar: ' + errMsg + '. Recargue la página.', true);
      }
    });
}

/** Consultar por ID: GET /users/:id y muestra solo ese usuario en la tabla. */
document.getElementById('btnConsult').onclick = function() {
  var id = document.getElementById('searchId').value.trim();
  if (!id) {
    msg('Escriba un ID numérico.', true);
    return;
  }
  msg('Consultando...');
  getUserById(id)
    .then(function(user) {
      msg('');
      render([user]);
    })
    .catch(function(err) {
      msg(err.message || 'Usuario no encontrado.', true);
      render([]);
    });
};

/** Ver todos: recarga la lista completa. */
document.getElementById('btnVerTodos').onclick = function() {
  document.getElementById('searchId').value = '';
  msg('Cargando lista...');
  load();
};

/** Envío del formulario de creación: POST y recarga lista. */
document.getElementById('userForm').onsubmit = function(e) {
  e.preventDefault();
  var name = document.getElementById('name').value.trim();
  var email = document.getElementById('email').value.trim();
  msg('Guardando...');
  createUser(name, email).then(function() {
    msg('');
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    load();
  }).catch(function(err) {
    msg(err.message || 'Error. Reintente.', true);
  });
};

load();
