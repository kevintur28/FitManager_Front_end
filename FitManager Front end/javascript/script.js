// ===================== ADMINS =====================
const ADMINS = [
  { email: "ke2812007@gmail.com", password: "kevin28122007" },
  { email: "dverapenuela@gmail.com", password: "1013609004" }
];

// ===================== STORAGE =====================
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getClases() {
  return JSON.parse(localStorage.getItem("clases")) || [];
}

function saveClases(clases) {
  localStorage.setItem("clases", JSON.stringify(clases));
}

// ===================== SESIÓN =====================
function setSession(user) {
  localStorage.setItem("session", JSON.stringify(user));
}

function getSession() {
  return JSON.parse(localStorage.getItem("session"));
}

function logout() {
  localStorage.removeItem("session");
  window.location.href = "login.html";
}

// ===================== REGISTRO =====================
function register() {
  const user = {
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value.trim(),
    telefono: document.getElementById("telefono").value,
    tipoId: document.getElementById("tipoId").value,
    numeroId: document.getElementById("numeroId").value,
    peso: document.getElementById("peso").value,
    edad: document.getElementById("edad").value,
    altura: document.getElementById("altura").value,
    rol: "cliente",
    membresia: "Básica",
    clases: []
  };

  if (!user.email || !user.password) {
    alert("Completa los campos obligatorios");
    return;
  }

  const users = getUsers();

  if (users.some(u => u.email === user.email)) {
    alert("El usuario ya existe");
    return;
  }

  users.push(user);
  saveUsers(users);

  alert("Cuenta creada correctamente");
  window.location.href = "login.html";
}

// ===================== LOGIN =====================
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // 👉 ADMINS PREDETERMINADOS
  const admin = ADMINS.find(
    a => a.email === email && a.password === password
  );

  if (admin) {
    setSession({ email: admin.email, rol: "admin" });
    window.location.href = "admin.html";
    return;
  }

  // CLIENTES
  const users = getUsers();
  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    alert("Correo o contraseña incorrectos");
    return;
  }

  setSession(user);
  window.location.href = "cliente.html";
}

// ===================== PANEL ADMIN =====================
function mostrarAdmin(id) {
  document.querySelectorAll(".admin-sec").forEach(sec => {
    sec.classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

function cargarClientes() {
  const users = getUsers();
  const tbody = document.getElementById("tablaClientes");
  if (!tbody) return;

  tbody.innerHTML = "";

  users.forEach((u, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${u.email}</td>
        <td>${u.membresia}</td>
        <td>
          <select onchange="cambiarMembresia(${i}, this.value)">
            <option ${u.membresia==="Básica"?"selected":""}>Básica</option>
            <option ${u.membresia==="Normal"?"selected":""}>Normal</option>
            <option ${u.membresia==="Pro"?"selected":""}>Pro</option>
            <option ${u.membresia==="Premium"?"selected":""}>Premium</option>
          </select>
          <button onclick="eliminarCliente(${i})">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

function cambiarMembresia(index, nueva) {
  const users = getUsers();
  users[index].membresia = nueva;
  saveUsers(users);
  cargarClientes();
}

function eliminarCliente(index) {
  const users = getUsers();
  users.splice(index, 1);
  saveUsers(users);
  cargarClientes();
}

// ===================== CLASES ADMIN =====================
function agregarClase() {
  const nombre = document.getElementById("nombreClase").value.trim();
  if (!nombre) return;

  const clases = getClases();
  clases.push({ nombre });
  saveClases(clases);

  document.getElementById("nombreClase").value = "";
  cargarClasesAdmin();
}

function eliminarClase(index) {
  const clases = getClases();
  clases.splice(index, 1);
  saveClases(clases);
  cargarClasesAdmin();
}

function cargarClasesAdmin() {
  const lista = document.getElementById("listaClasesAdmin");
  if (!lista) return;

  const clases = getClases();
  lista.innerHTML = "";

  clases.forEach((c, i) => {
    lista.innerHTML += `
      <li>
        ${c.nombre}
        <button onclick="eliminarClase(${i})">Eliminar</button>
      </li>
    `;
  });
}

// ===================== PANEL CLIENTE =====================
function mostrarCliente(id) {
  document.querySelectorAll(".cliente-sec").forEach(sec => {
    sec.classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

function cargarPerfilCliente() {
  const user = getSession();
  if (!user) return;

  const div = document.getElementById("infoCliente");
  if (!div) return;

  div.innerHTML = `
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Membresía:</strong> ${user.membresia}</p>
  `;
}

function cargarClasesCliente() {
  const lista = document.getElementById("listaClasesCliente");
  if (!lista) return;

  const clases = getClases();
  lista.innerHTML = "";

  clases.forEach((c, i) => {
    lista.innerHTML += `
      <li>
        ${c.nombre}
        <button onclick="inscribirse(${i})">Inscribirse</button>
      </li>
    `;
  });
}

function inscribirse(index) {
  const user = getSession();
  const users = getUsers();

  const i = users.findIndex(u => u.email === user.email);
  if (i === -1) return;

  if (!users[i].clases.includes(index)) {
    users[i].clases.push(index);
    saveUsers(users);
    setSession(users[i]);
  }

  alert("Inscripción realizada");
}

// ===================== AUTOLOAD =====================
document.addEventListener("DOMContentLoaded", () => {
  cargarClientes();
  cargarClasesAdmin();
  cargarClasesCliente();
  cargarPerfilCliente();
});
