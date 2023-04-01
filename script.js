let form = document.getElementById("todoform");
let todoInput = document.getElementById("newtodo");
let todosListEl = document.getElementById("todos-list");
let notificationEl = document.querySelector(".notification");
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let EditTodo = -1;

renderTodo();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  saveTodo();
  renderTodo();
  localStorage.setItem('todos', JSON.stringify(todos));
});

//save todos
function saveTodo(params) {
  const todoValue = todoInput.value;
  const isDuplicate = todos.some(
    (todo) => todo.value.toUpperCase() === todoValue.toUpperCase()
  );

  if (todoValue === "") {
    showNotification("Don't leave empty");
  } else if (isDuplicate) {
    console.log(isDuplicate);
    showNotification("To-Do Already Exist");
  } else {
    if (EditTodo >= 0) {
      todos = todos.map((todo, index) => {
        return {
          ...todo,
          value: EditTodo === index ? todoValue : todo.value,
        };
      });
      EditTodo = -1;
    } else {
      todos.push({
        value: todoValue,
        checked: false,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      });
    }
    todoInput.value = "";
  }
}

//render todos
function renderTodo() {
  if (todos.length === 0) {
    todosListEl.innerHTML = '<center> Nothing to do! </center>' 
    return;
  } 

  todosListEl.innerHTML = "";

  todos.forEach((todo, index) => {
    todosListEl.innerHTML += `
        <div class="todo" id=${index}>
         <i
          class="bi ${todo.checked ? "bi-check-circle-fill" : "bi-circle"}" 
          style = "color : ${todo.color}"
          data-action = "check"  
          ></i>
         <p class="" data-action = "check">${todo.value}</p>
         <i class="bi bi-pencil-square" data-action = "edit"></i>
         <i class="bi bi-trash" data-action = "delete"></i>
        </div>
     `;
    //custom attribute [data-action = "check"]
  });
}

todosListEl.addEventListener("click", (e) => {
  const target = e.target;
  const parentTraget = target.parentNode;

  if (parentTraget.className != "todo") return; //In the given code, the return
  //statement is used to exit the event listener function early when the clicked
  // element's parent does not have a class name of 'todo'.

  //todo is
  const todoId = +parentTraget.id;

  //todo action target
  const action = target.dataset.action;
  action === "check" && checkTodo(todoId);
  action === "edit" && editTodo(todoId);
  action === "delete" && deleteTodo(todoId);
});

function checkTodo(todoId) {
  todos = todos.map((todo, index) => ({
    ...todo,
    checked: todoId === index ? !todo.checked : todo.checked,
  }));
  renderTodo();
  localStorage.setItem('todos', JSON.stringify(todos))

}

function editTodo(todoId) {
  todoInput.value = todos[todoId].value;
  EditTodo = todoId;
}

function deleteTodo(todoId) {
  todos = todos.filter((todo, index) => index !== todoId);
  renderTodo();
  localStorage.setItem('todos', JSON.stringify(todos))

}

function showNotification(msg) {
  notificationEl.innerHTML = msg;
  notificationEl.classList.add("notif-enter");

  setTimeout(() => {
    notificationEl.classList.remove("notif-enter");
  }, 2000);
}

// function render(params) {
//   todoList.innerHTML = '';
//   const todoItems = todos.map((todo, index) => {
//     return `
//     <div class="todo" id=${index}>
//                 <i class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'}"
//                 data-action = 'check'
//                 ></i>
//                 <p class="checked" data-action = 'check'>${todo.value}</p>
//                 <i class="bi bi-pencil-square" data-action = 'edit'></i>
//                 <i class="bi bi-trash-fill" data-action = 'delete'></i>
//             </div>
//     `;
//   });
//   todoList.innerHTML = todoItems.join('');
// }
