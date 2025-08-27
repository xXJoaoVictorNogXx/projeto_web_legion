const API = "http://localhost:3000/api";

const statusEl = document.getElementById("status");
const tbody = document.getElementById("tbody");
const nameEl = document.getElementById("name");
const emailEl = document.getElementById("email");
const addBtn = document.getElementById("add");

async function health() {
  try {
    const r = await fetch(`${API}/health`);
    const j = await r.json();
    statusEl.textContent = j.status === "ok" ? "OK (DB " + j.db + ")" : "Falha";
  } catch {
    statusEl.textContent = "Offline";
  }
}

function trUser(u) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${u.id}</td>
    <td><input value="${u.name}" data-id="${u.id}" data-field="name" /></td>
    <td><input value="${u.email}" data-id="${u.id}" data-field="email" /></td>
    <td>
      <button data-action="save" data-id="${u.id}">Salvar</button>
      <button data-action="del" data-id="${u.id}">Excluir</button>
    </td>
  `;
  return tr;
}

async function load() {
  const r = await fetch(`${API}/users`);
  const users = await r.json();
  tbody.innerHTML = "";
  users.forEach(u => tbody.appendChild(trUser(u)));
}

addBtn.addEventListener("click", async () => {
  const name = nameEl.value.trim();
  const email = emailEl.value.trim();
  if (!name || !email) return alert("Preencha nome e email.");
  await fetch(`${API}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email })
  });
  nameEl.value = "";
  emailEl.value = "";
  await load();
});

tbody.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = btn.getAttribute("data-id");
  const action = btn.getAttribute("data-action");
  if (action === "del") {
    await fetch(`${API}/users/${id}`, { method: "DELETE" });
    await load();
  } else if (action === "save") {
    const row = btn.closest("tr");
    const inputs = row.querySelectorAll("input[data-id='" + id + "']");
    const payload = {};
    inputs.forEach(inp => payload[inp.getAttribute("data-field")] = inp.value.trim());
    await fetch(`${API}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    await load();
  }
});

(async () => {
  await health();
  await load();
})();
