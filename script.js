// Sélection des éléments du DOM
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const filterBtns = document.querySelectorAll(".filter-btn");
const messageContainer = document.getElementById("message-container");

// Variable pour stocker les tâches
let tasks = [];

// Événement pour ajouter une tâche
addTaskBtn.addEventListener("click", addTask);

// Événement pour filtrer les tâches
filterBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    filterTasks(btn.dataset.filter);
  });
});

// Fonction pour afficher un message
function showMessage(text, type = "error") {
  messageContainer.innerHTML = "";
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = text;
  messageContainer.appendChild(div);

  // Supprimer le message après 3 secondes
  setTimeout(() => {
    div.remove();
  }, 3000);
}

// Fonction pour ajouter une nouvelle tâche
function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    showMessage("Veuillez entrer une tâche valide.", "error");
    return;
  }

  // Vérifier si la tâche existe déjà
  if (
    tasks.some((task) => task.text.toLowerCase() === taskText.toLowerCase())
  ) {
    showMessage("Cette tâche existe déjà.", "error");
    return;
  }

  const task = {
    text: taskText,
    completed: false,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  // Réinitialiser le champ de saisie
  taskInput.value = "";

  showMessage("Tâche ajoutée avec succès.", "success");
}

// Fonction pour rendre les tâches à l'écran
function renderTasks() {
  taskList.innerHTML = "";

  const filter = document.querySelector(".filter-btn.active").dataset.filter;

  // Trier les tâches : tâches non terminées en premier
  const sortedTasks = tasks.slice().sort((a, b) => a.completed - b.completed);

  sortedTasks.forEach((task, index) => {
    if (
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "pending" && !task.completed)
    ) {
      const li = document.createElement("li");
      li.className = "task-item";

      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = task.text;
      if (task.completed) {
        span.classList.add("completed");
      }

      // Marquer comme terminée
      span.addEventListener("click", function () {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
      });

      // Bouton d'édition
      const editBtn = document.createElement("button");
      editBtn.className = "edit-btn";
      editBtn.textContent = "Modifier";

      editBtn.addEventListener("click", function () {
        editTask(index);
      });

      // Bouton de suppression
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Supprimer";

      // Supprimer la tache
      deleteBtn.addEventListener("click", function () {
        li.classList.add("removing");
        setTimeout(() => {
          tasks.splice(tasks.indexOf(task), 1);
          saveTasks();
          renderTasks();
        }, 500);
      });

      li.appendChild(span);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    }
  });
}

// Fonction pour éditer une tâche
function editTask(index) {
  const li = taskList.children[index];
  const task = tasks[index];

  // Créer un champ de saisie en ligne
  const input = document.createElement("input");
  input.type = "text";
  input.className = "edit-input";
  input.value = task.text;

  // Remplacer le texte par le champ de saisie
  const span = li.querySelector(".task-text");
  li.replaceChild(input, span);

  // Focus sur le champ de saisie
  input.focus();

  // Gestion de la validation de l'édition
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const newTaskText = input.value.trim();
      if (newTaskText === "") {
        showMessage("La tâche ne peut pas être vide.", "error");
        return;
      }

      // Vérifier si la nouvelle tâche existe déjà
      if (
        tasks.some(
          (t, i) =>
            i !== index && t.text.toLowerCase() === newTaskText.toLowerCase()
        )
      ) {
        showMessage("Cette tâche existe déjà.", "error");
        return;
      }

      task.text = newTaskText;
      saveTasks();
      renderTasks();
      showMessage("Tâche modifiée avec succès.", "success");
    } else if (e.key === "Escape") {
      // Annuler l'édition
      renderTasks();
    }
  });

  // Si le champ de saisie perd le focus, annuler l'édition
  input.addEventListener("blur", function () {
    renderTasks();
  });
}

// Fonction pour filtrer les tâches
function filterTasks(filter) {
  renderTasks();
}

// Fonction pour sauvegarder les tâches dans le localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Fonction pour charger les tâches depuis le localStorage
function loadTasks() {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));
  if (storedTasks) {
    tasks = storedTasks;
  }
  renderTasks();
}

// Charger les tâches au chargement de la page
window.addEventListener("load", loadTasks);
