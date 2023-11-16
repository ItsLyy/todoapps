const todo = [];
const RENDER_EVENT = "render-todo";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    addToDo();
  });
});

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

function taskCompleted(id) {
  const toDoItem = findToDo(id);

  if (toDoItem == null) return;

  toDoItem.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findToDo(id) {
  for (const todoItems of todo) {
    if (todoItems === id) {
      return todoItems;
    }
  }
  return null;
}

document.addEventListener(RENDER_EVENT, function () {
  const incompletedContainer = document.getElementById("todos");
  incompletedContainer.innerHTML = "";

  for (const todoItem of todo) {
    if (!todoItem.isCompleted) {
      incompletedContainer.appendChild(makeToDo(todoItem));
    }
  }
});
