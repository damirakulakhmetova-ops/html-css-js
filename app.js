// ===== Помощники для localStorage (память браузера) =====
// Сохраняем данные, чтобы они не пропадали после перезагрузки страницы
function load(key, defaultValue) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // если память недоступна — просто не сохраняем
  }
}

// ===== 1. Смена темы =====
const themeBtn = document.getElementById("theme-btn");

if (load("theme", "dark") === "light") {
  document.body.classList.add("light");
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  save("theme", isLight ? "light" : "dark");
});

// ===== 2. Приветствие по имени =====
const nameInput = document.getElementById("name-input");
const greeting = document.getElementById("greeting");

function greet(person) {
  return `Привет, ${person}!`;
}

nameInput.addEventListener("input", () => {
  const name = nameInput.value.trim();
  greeting.textContent = name ? greet(name) : "";
});

// ===== 3. Навыки =====
const skillsBox = document.getElementById("skills");
const skillInput = document.getElementById("skill-input");
const skillBtn = document.getElementById("skill-btn");

const skills = load("skills", ["HTML", "CSS", "Git"]);

function renderSkills() {
  skillsBox.innerHTML = "";
  skills.forEach((skill) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = skill;
    skillsBox.appendChild(tag);
  });
}

function addSkill() {
  const skill = skillInput.value.trim();
  if (skill === "") return;
  skills.push(skill);
  save("skills", skills);
  skillInput.value = "";
  renderSkills();
}

skillBtn.addEventListener("click", addSkill);
skillInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addSkill();
});

// ===== 4. Список дел (To-Do) =====
const todoInput = document.getElementById("todo-input");
const todoBtn = document.getElementById("todo-btn");
const todoList = document.getElementById("todo-list");
const todoCounter = document.getElementById("todo-counter");

// Каждая задача — объект: { text: "Купить хлеб", done: false }
let todos = load("todos", []);

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    if (todo.done) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => {
      todo.done = checkbox.checked;
      save("todos", todos);
      renderTodos();
    });

    const text = document.createElement("span");
    text.textContent = todo.text;

    const del = document.createElement("button");
    del.className = "delete";
    del.textContent = "✕";
    del.title = "Удалить";
    del.addEventListener("click", () => {
      todos = todos.filter((_, i) => i !== index);
      save("todos", todos);
      renderTodos();
    });

    li.append(checkbox, text, del);
    todoList.appendChild(li);
  });

  // filter — оставляем только невыполненные и считаем их
  const left = todos.filter((todo) => !todo.done).length;
  todoCounter.textContent =
    todos.length === 0 ? "Задач пока нет 🎉" : `Осталось задач: ${left} из ${todos.length}`;
}

function addTodo() {
  const text = todoInput.value.trim();
  if (text === "") return;
  todos.push({ text, done: false });
  save("todos", todos);
  todoInput.value = "";
  renderTodos();
}

todoBtn.addEventListener("click", addTodo);
todoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addTodo();
});

// Первая отрисовка при открытии страницы
renderSkills();
renderTodos();
