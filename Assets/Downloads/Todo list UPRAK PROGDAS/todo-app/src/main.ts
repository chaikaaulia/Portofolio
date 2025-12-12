interface Todo {
  task: string;
  status: boolean;
  date: string;
}

const taskInput = document.getElementById("taskInput") as HTMLInputElement;
const dateInput = document.getElementById("dateInput") as HTMLInputElement;
const addBtn = document.getElementById("addBtn") as HTMLButtonElement;
const clearBtn = document.getElementById("clearBtn") as HTMLButtonElement;
const todoBody = document.getElementById("todoBody") as HTMLTableSectionElement;
const errorText = document.getElementById("error") as HTMLParagraphElement;

let todos: Todo[] = [];

// ✅ LOAD DATA (PERSISTENT)
function loadData() {
  const data = localStorage.getItem("todos");
  if (data !== null) {
    todos = JSON.parse(data);
  }
  render();
}

// ✅ SAVE DATA
function saveData() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ✅ TAMBAH LIST
addBtn.addEventListener("click", () => {
  if (taskInput.value.trim() === "" || dateInput.value === "") {
    errorText.textContent = "Task dan Tanggal wajib diisi!";
    return;
  }

  errorText.textContent = "";

  const newTodo: Todo = {
    task: taskInput.value,
    status: false,
    date: dateInput.value
  };

  todos.push(newTodo);
  saveData();
  render();

  taskInput.value = "";
  dateInput.value = "";
});

// ✅ TAMPILKAN DATA (FOR LOOP)
function render() {
  todoBody.innerHTML = "";

  for (let i = 0; i < todos.length; i++) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${todos[i].task}</td>
      <td class="${todos[i].status ? "selesai" : "belum"}">
        ${todos[i].status ? "Selesai" : "Belum Selesai"}
      </td>
      <td>${todos[i].date}</td>
      <td>
        <button class="btn-selesai">Selesai</button>
        <button class="btn-hapus">Hapus</button>
      </td>
    `;

    const btnSelesai = tr.querySelector(".btn-selesai") as HTMLButtonElement;
    const btnHapus = tr.querySelector(".btn-hapus") as HTMLButtonElement;

    // ✅ EDIT STATUS
    btnSelesai.addEventListener("click", () => {
      todos[i].status = !todos[i].status;
      saveData();
      render();
    });

    // ✅ HAPUS SATU LIST
    btnHapus.addEventListener("click", () => {
      todos.splice(i, 1);
      saveData();
      render();
    });

    todoBody.appendChild(tr);
  }
}

// ✅ HAPUS SEMUA LIST
clearBtn.addEventListener("click", () => {
  todos = [];
  saveData();
  render();
});

loadData();
