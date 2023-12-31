const todo = [];
const RENDER_EVENT = "render-todo";
const SAVE_KEY = "KEYSAVE";
const SAVE_EVENT = 'render-save'

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    addToDo();
  });

  if(storageExist()){
    loadData();
  }
});

function storageExist() {
  if (typeof Storage === undefined) {
    alert("HAHAHAHAH YOU BROKE AS FUCK");
    return false;
  }
  return true;
}

function saveData() {
  if (storageExist()) {
    localStorage.setItem(SAVE_KEY, JSON.stringify(todo));
  }
}

function loadData(){
  const valueStorage = localStorage.getItem(SAVE_KEY);
  const todoValue = JSON.parse(valueStorage);

  if(todoValue !== null){
    for(const todosValue of todoValue){
      todo.push(todosValue);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addToDo() {
  const titleToDo = document.getElementById("title");
  const timeToDo = document.getElementById("date");

  const generateID = generateId();
  const toDoObject = generateToDoObject(
    generateID,
    titleToDo.value,
    timeToDo.value,
    false
  );

  todo.push(toDoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateToDoObject(id, task, time, isCompleted) {
  return {
    id,
    task,
    time,
    isCompleted,
  };
}
function taskCompleted(id) {
  const toDoItem = findToDo(id);

  if (toDoItem == null) return;

  toDoItem.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteTaskFromCompleted(id) {
  const toDoItem = findToDoIndex(id);
  if (toDoItem == -1) return;
  
  todo.splice(toDoItem, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findToDoIndex(id) {
  for (const index in todo) {
    if (todo[index].id === id) {
      return index;
    }
  }
  return -1;
}

function undoTaskFromCompleted(id) {
  const toDoItem = findToDo(id);
  if (toDoItem == null) return;
  
  toDoItem.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findToDo(id) {
  for (let y of todo) {
    if (y.id === id) {
      return y;
    }
  }
  return null;
}

function makeToDo(toDoObject) {
  const titleText = document.createElement("h2");
  titleText.innerText = toDoObject.task;

  const timeText = document.createElement("p");
  timeText.innerText = toDoObject.time;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(titleText, timeText);

  const container = document.createElement("div");
  container.classList.add("shadow", "item");
  container.appendChild(textContainer);
  container.setAttribute("id", `todo-${toDoObject.id}`);
  if (toDoObject.isCompleted) {
    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      deleteTaskFromCompleted(toDoObject.id);
    });

    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(toDoObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", function () {
      taskCompleted(toDoObject.id);
    });
    container.append(checkButton);
  }
  return container;
}

document.addEventListener(RENDER_EVENT, function () {
  const incompletedContainer = document.getElementById("todos");
  const completedContainer = document.getElementById("todos-completed");
  incompletedContainer.innerHTML = "";
  completedContainer.innerHTML = "";

  for (const todoItem of todo) {
    const todoValue = makeToDo(todoItem);
    if (!todoItem.isCompleted) {
      incompletedContainer.append(todoValue);
    } else {
      completedContainer.append(todoValue);
    }
  }
});


