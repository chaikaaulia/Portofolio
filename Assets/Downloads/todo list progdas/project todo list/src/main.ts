import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter.ts";

// Render awal dari template
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>

    <h1>Vite + TypeScript</h1>

    <div class="card">
      <button id="counter" type="button"></button>
    </div>

    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

// ================================
// TODO APP
// ================================

interface Todo {
  text: string;
  done: boolean;
}

const input = document.getElementById("todoInput") as HTMLInputElement;
const addBtn = document.getElementById("addBtn") as HTMLButtonElement;
const list = document.getElementById("todoList") as HTMLUListElement;
const clearAll = document.getElementById("clearAll") as HTMLButtonElement;
const searchInput = document.getElementById("searchInput") as HTMLInputElement; // buat ambil elemen html berdasarkaan id, agar tidak terjadi eror

let todos: Todo[] = JSON.parse(localStorage.getItem("todos") || "[]");
let searchQuery: string = ""; // mengambil data todo dari localStorage dan mengubahnya menjadi array.

// Simpan ke localStorage
function save(): void {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Render list todo
function render(): void {
  list.innerHTML = ""; // menampilkan ulang daftar todo

  const filteredTodos = todos.filter((todo: Todo) =>
    todo.text.toLowerCase().includes(searchQuery.toLowerCase()) // mencari todo
  );

  if (filteredTodos.length === 0 && searchQuery !== "") {
    list.innerHTML = "<li class='no-results'>Tidak ada hasil pencarian</li>";
    return;
  } // mencari sesuatu, tetapi hasilnya kosong → tampilkan pesan “Tidak ada hasil pencarian”.

  filteredTodos.forEach((todo: Todo) => { // perulangan pada setiap todo hasil pencarian.
    const actualIndex = todos.indexOf(todo); // mengetahui posisi asli
    const li = document.createElement("li"); // membuat element baru li yg bakal di tampilkan ke daftar

    li.className = todo.done ? "done" : ""; // mengatur tampilan udah selesai atau belum

    li.innerHTML = `
      <span>${todo.text}</span>
      <div>
        <button class="edit">✓</button>
        <button class="delete">X</button>
      </div>
    `; // membuat isi html dari 1 item todo, teks, tombol edit dan tombol hapus

    const editBtn = li.querySelector(".edit") as HTMLButtonElement;
    const deleteBtn = li.querySelector(".delete") as HTMLButtonElement; // mecari tonbol edit dan delete agar bosa di pasang

    // Toggle status
    editBtn.onclick = (): void => {
      todos[actualIndex].done = !todos[actualIndex].done;
      save(); // menyimpan ke localstorage
      render(); // tampilan ulang
    }; // memutarbalikan dari false - true
    // true - false

    // Hapus todo
    deleteBtn.onclick = (): void => {
      todos.splice(actualIndex, 1);
      save();
      render();
    };

    list.appendChild(li);
  });
}

// Tambah todo
addBtn.onclick = (): void => {
  const value: string = input.value.trim();

  if (value === "") {
    alert("Input tidak boleh kosong!");
    return;
  }

  todos.push({ text: value, done: false });
  save();
  render();
  input.value = "";
}; // untuk menambahkan todo saat di klik tambah

// Hapus semua todo
clearAll.onclick = (): void => {
  todos = [];
  save();
  render();
}; // menghapus todo

// Fitur pencarian, mencari suatu imput
searchInput.oninput = (): void => {
  searchQuery = searchInput.value;
  render();
}; 

// Render pertama kali
render();

// Counter bawaan Vite
setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);