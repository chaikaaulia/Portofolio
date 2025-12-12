import './style.css'

// Interface untuk struktur data Todo
interface Todo {
  id: string;
  text: string;
  done: boolean;
  timestamp: number;
}

// Class TodoList untuk mengelola aplikasi
class TodoList {
  private todoData: Todo[] = [];
  private inputElement: HTMLInputElement;
  private addButton: HTMLButtonElement;
  private listElement: HTMLUListElement;
  private clearButton: HTMLButtonElement;
  private countElement: HTMLSpanElement;
  private errorElement: HTMLDivElement;
  private emptyElement: HTMLDivElement;
  private storageKey = 'myTodoList';

  constructor() {
    // Ambil semua elemen HTML
    this.inputElement = document.getElementById('todoInput') as HTMLInputElement;
    this.addButton = document.getElementById('addBtn') as HTMLButtonElement;
    this.listElement = document.getElementById('todoListContainer') as HTMLUListElement;
    this.clearButton = document.getElementById('clearAllBtn') as HTMLButtonElement;
    this.countElement = document.getElementById('countDisplay') as HTMLSpanElement;
    this.errorElement = document.getElementById('errorMsg') as HTMLDivElement;
    this.emptyElement = document.getElementById('emptyDisplay') as HTMLDivElement;

    this.initialize();
  }

  // Inisialisasi aplikasi
  private initialize(): void {
    this.loadData();
    this.attachEvents();
    this.updateDisplay();
  }

  // Pasang event listener
  private attachEvents(): void {
    // Klik tombol tambah
    this.addButton.addEventListener('click', () => {
      this.addNewTodo();
    });

    // Tekan Enter di input
    this.inputElement.addEventListener('keypress', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        this.addNewTodo();
      }
    });

    // Hapus error saat mengetik
    this.inputElement.addEventListener('input', () => {
      this.hideError();
    });

    // Klik tombol hapus semua
    this.clearButton.addEventListener('click', () => {
      this.deleteAllTodos();
    });
  }

  // Fungsi tambah todo baru
  private addNewTodo(): void {
    const inputText = this.inputElement.value.trim();

    // Validasi: Input kosong
    if (inputText === '') {
      this.displayError('❌ Tugas tidak boleh kosong!');
      return;
    }

    // Validasi: Minimal 3 karakter
    if (inputText.length < 3) {
      this.displayError('❌ Tugas minimal 3 karakter!');
      return;
    }

    // Buat objek todo baru
    const newTodo: Todo = {
      id: 'todo_' + Date.now(),
      text: inputText,
      done: false,
      timestamp: Date.now()
    };

    // Tambahkan ke array
    this.todoData.unshift(newTodo);

    // Reset input
    this.inputElement.value = '';
    this.hideError();

    // Simpan dan update tampilan
    this.saveData();
    this.updateDisplay();
  }

  // Fungsi hapus satu todo
  private deleteOneTodo(todoId: string): void {
    const confirmDelete = confirm('Yakin ingin menghapus tugas ini?');
    
    if (confirmDelete) {
      this.todoData = this.todoData.filter(item => item.id !== todoId);
      this.saveData();
      this.updateDisplay();
    }
  }

  // Fungsi toggle status todo (done/undone)
  private toggleStatus(todoId: string): void {
    const foundTodo = this.todoData.find(item => item.id === todoId);
    
    if (foundTodo) {
      foundTodo.done = !foundTodo.done;
      this.saveData();
      this.updateDisplay();
    }
  }

  // Fungsi hapus semua todo
  private deleteAllTodos(): void {
    // Validasi: Cek apakah ada data
    if (this.todoData.length === 0) {
      this.displayError('❌ Tidak ada tugas untuk dihapus!');
      return;
    }

    const confirmClear = confirm('Yakin ingin menghapus SEMUA tugas?');
    
    if (confirmClear) {
      this.todoData = [];
      this.saveData();
      this.updateDisplay();
    }
  }

  // Simpan ke localStorage (Persistent Data)
  private saveData(): void {
    try {
      const jsonData = JSON.stringify(this.todoData);
      localStorage.setItem(this.storageKey, jsonData);
    } catch (error) {
      console.error('Gagal menyimpan data:', error);
    }
  }

  // Load dari localStorage (Persistent Data)
  private loadData(): void {
    try {
      const savedData = localStorage.getItem(this.storageKey);
      
      if (savedData) {
        this.todoData = JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Gagal memuat data:', error);
      this.todoData = [];
    }
  }

  // Tampilkan pesan error
  private displayError(message: string): void {
    this.errorElement.textContent = message;
    this.inputElement.focus();
  }

  // Sembunyikan pesan error
  private hideError(): void {
    this.errorElement.textContent = '';
  }

  // Update counter
  private updateCounter(): void {
    const totalTodos = this.todoData.length;
    const completedTodos = this.todoData.filter(item => item.done).length;

    if (totalTodos === 0) {
      this.countElement.textContent = '0 tugas';
    } else if (completedTodos === 0) {
      this.countElement.textContent = `${totalTodos} tugas`;
    } else {
      this.countElement.textContent = `${totalTodos} tugas (${completedTodos} selesai)`;
    }
  }

  // Update tampilan keseluruhan
  private updateDisplay(): void {
    // Kosongkan list
    this.listElement.innerHTML = '';

    // Cek apakah data kosong
    if (this.todoData.length === 0) {
      this.emptyElement.classList.add('visible');
      this.listElement.style.display = 'none';
    } else {
      this.emptyElement.classList.remove('visible');
      this.listElement.style.display = 'block';

      // Loop untuk render setiap todo
      for (let i = 0; i < this.todoData.length; i++) {
        const todoItem = this.todoData[i];
        const listItem = this.createTodoItem(todoItem);
        this.listElement.appendChild(listItem);
      }
    }

    // Update counter
    this.updateCounter();
  }

  // Buat elemen todo item
  private createTodoItem(todo: Todo): HTMLLIElement {
    // Buat elemen <li>
    const li = document.createElement('li');
    li.className = 'item-todo';
    
    if (todo.done) {
      li.classList.add('completed');
    }

    // Buat checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox-todo';
    checkbox.checked = todo.done;
    
    // Event ketika checkbox diklik
    checkbox.addEventListener('change', () => {
      this.toggleStatus(todo.id);
    });

    // Buat text span
    const textSpan = document.createElement('span');
    textSpan.className = 'text-todo';
    textSpan.textContent = todo.text;

    // Buat tombol delete
    const deleteButton = document.createElement('button');
    deleteButton.className = 'button-delete';
    deleteButton.textContent = '×';
    
    // Event ketika tombol delete diklik
    deleteButton.addEventListener('click', () => {
      this.deleteOneTodo(todo.id);
    });

    // Gabungkan semua elemen
    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(deleteButton);

    return li;
  }
}

// Jalankan aplikasi setelah DOM siap
document.addEventListener('DOMContentLoaded', () => {
  new TodoList();
});