// URL de la API
const apiUrl =
  "https://653485e2e1b6f4c59046c7c7.mockapi.io/api/users/218209052/tasks";

// Elementos del formulario y la lista de tareas
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

// Variable para controlar el modo de edición
let isEditing = false;

// Agregar evento al formulario para manejar la creación de tareas
taskForm.addEventListener("submit", handleTaskFormSubmit);

// Función para manejar el envío del formulario de tareas
function handleTaskFormSubmit(e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const completed = document.getElementById("completed").checked;
  const priority = document.getElementById("priority").value;
  const tag = document.getElementById("tag").value;
  const dueDate = document.getElementById("dueDate").value;

  const newTask = {
    title,
    description,
    completed,
    priority,
    tag,
    dueDate,
  };

  // Realizar una solicitud POST para agregar una nueva tarea
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTask),
  })
    .then((response) => response.json())
    .then((data) => {
      addTaskToList(data);
      taskForm.reset();
    })
    .catch((error) => console.error("Error: ", error));
}

// Función para agregar una tarea a la lista
function addTaskToList(task) {
  const taskItem = document.createElement("tr");
  taskItem.dataset.taskId = task.id;

  // Establecer clases CSS en función del estado completado de la tarea
  if (task.completed) {
    taskItem.classList =
      "flex flex-row gap-4 mb-10 justify-between p-4 w-full h-fit bg-zinc-800 text-zinc-400 line-through cursor-pointer rounded-md";
  } else {
    taskItem.classList =
      "flex flex-row gap-4 mb-10 justify-between p-4 w-full h-fit bg-zinc-200 text-zinc-800 cursor-pointer rounded-md";
  }

  // Agregar evento de clic a la fila solo si no estás en modo de edición
  if (!isEditing || isEditing !== task.id) {
    taskItem.addEventListener("click", () => {
      if (!isEditing) {
        task.completed = !task.completed;
        fetch(`${apiUrl}/${task.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        })
          .then(() => {
            fetchTasks();
          })
          .catch((error) => console.error("Error: ", error));
      }
    });
  }

  // Construir contenido de la fila
  if (!isEditing || isEditing !== task.id) {
    taskItem.innerHTML = `
        <span class="max-w-lg whitespace-normal break-words">${
          task.title
        }</span>
        <span class="max-w-lg whitespace-normal break-words">${
          task.priority
        }</span>
        <span class="max-w-lg whitespace-normal break-words">${task.tag}</span>
        <span class="max-w-lg whitespace-normal break-words">${
          task.dueDate
        }</span>
        <span class="max-w-lg whitespace-normal break-words">${
          task.completed ? "Completada" : "Por completar"
        }</span>
        <div class="flex flex-row gap-4">
        ${
          !task.completed
            ? `<button onclick="editTask('${task.id}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pen-square">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>
              </svg>
            </button>`
            : ""
        }
        <button onclick="deleteTask('${task.id}')">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2">
            <path d="M3 6h18"/>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
          </svg>
        </button>
        </div>
    `;
  } else {
    taskItem.innerHTML = `
      <input class="bg-transparent border-b border-gray-600" type="text" id="editedTitle" value="${task.title}" />
      <select class="bg-transparent border-b border-gray-600" id="editedPriority">
        <option value="Alta">Alta</option>
        <option value="Media">Media</option>
        <option value="Baja">Baja</option>
      </select>
      <input class="bg-transparent border-b border-gray-600" type="text" id="editedTag" value="${task.tag}" />
      <input type="date" class="bg-transparent border-b border-gray-600" id="editedDueDate" value="${task.dueDate}" />
      <div class="flex flex-row gap-4">
        <button onclick="saveEditedTask('${task.id}')">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#145bff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
        </button>
        <button onclick="cancelEdit('${task.id}')">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#363535" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>
    `;
  }

  taskList.appendChild(taskItem);
}

// Función para cambiar al modo de edición de una tarea
function editTask(taskId) {
  isEditing = taskId;
  fetchTasks();
}

// Función para guardar una tarea editada
function saveEditedTask(taskId) {
  if (isEditing) {
    isEditing = false;
    const title = document.getElementById("editedTitle").value;
    const priority = document.getElementById("editedPriority").value;
    const tag = document.getElementById("editedTag").value;
    const dueDate = document.getElementById("editedDueDate").value;

    // Realiza una solicitud PUT para guardar los cambios en la tarea
    fetch(`${apiUrl}/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        priority,
        tag,
        dueDate,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        fetchTasks();
      })
      .catch((error) => console.error("Error: ", error));
  } else {
    fetchTasks();
  }
}

// Función para cancelar la edición de una tarea
function cancelEdit(taskId) {
  if (isEditing) {
    isEditing = false;
    fetchTasks();
  } else {
    fetchTasks();
  }
}

// Función para eliminar una tarea
function deleteTask(taskId) {
  const confirmDelete = confirm(
    "¿Estás seguro de que deseas eliminar esta tarea?"
  );

  if (confirmDelete) {
    fetch(`${apiUrl}/${taskId}`, {
      method: "DELETE",
    })
      .then(() => {
        const taskItem = document.querySelector(`tr[data-task-id="${taskId}"`);
        taskItem.remove();
      })
      .then(fetchTasks())
      .catch((error) => console.error("Error: ", error));
  }
}

// Función para cargar y mostrar todas las tareas
function fetchTasks() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      taskList.innerHTML = ""; // Limpiar todas las tareas existentes
      data.forEach((task) => addTaskToList(task));
    })
    .catch((error) => console.error("Error: ", error));
}

// Cargar las tareas al cargar la página
fetchTasks();
