"use strict";

let todoItems = JSON.parse(localStorage.getItem("todoItems")) || [];
let selectedCategoryId = null;
let categoryItems = JSON.parse(localStorage.getItem("categories")) || [];

// adding category for todo items
function addCategory(ev) {
  const newCategoryName = prompt("Enter name to create category");

  if (newCategoryName != null) {
    categoryItems.push({
      id: generateRandomId(),
      name: newCategoryName,
    });
  }

  renderCategories();
}

// edit category name on the basis of selected id
function editCategory(selectedCategoryId) {
  for (let i = 0; i < categoryItems.length; i++) {
    if (categoryItems[i].id == selectedCategoryId) {
      if (categoryItems[i].name == null) {
        return;
      }
      let newCategoryName = prompt(
        "please change your todo item",
        categoryItems[i].name
      );
      if (newCategoryName != null) {
        categoryItems[i].name = newCategoryName;
      }
    }
  }

  renderCategories();
}

// delete category
function deleteCategory(selectedCategoryId) {
  for (let i = 0; i < categoryItems.length; i++) {
    if (categoryItems[i].id == selectedCategoryId) {
      console.log(categoryItems[i].id);
      categoryItems.splice(i, 1);
    }
  }

  renderCategories();
}

// render categories
function renderCategories() {
  localStorage.setItem("categories", JSON.stringify(categoryItems));

  const categoryList = document.getElementById("categoryList");
  categoryList.innerHTML = "";

  for (const category of categoryItems) {
    const categoryElem = document.createElement("button");
    categoryElem.className = "rounded-full h-7 w-64 flex justify-between px-2";
    if (category.id === selectedCategoryId) {
      categoryElem.className += " bg-sky-500";
    } else {
      categoryElem.className += " bg-white text-black";
    }
    categoryElem.innerText = category.name;

    categoryElem.addEventListener("click", () => {
      selectedCategoryId =
        selectedCategoryId == category.id ? null : category.id;

      renderCategories();
      renderTodoListItem();
    });

    const editButton = document.createElement("button");
    editButton.innerHTML = `<p class="text-yellow-600">Edit</p>`;
    editButton.addEventListener("click", (ev) => {
      editCategory(category.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = `<p class="text-red-600">x</p>`;
    deleteButton.addEventListener("click", (ev) => {
      deleteCategory(category.id);
    });

    categoryList.append(categoryElem);
    categoryElem.append(editButton);
    categoryElem.append(deleteButton);
  }
}

function addTodoItem(ev) {
  if (ev != null) {
    if (ev.currentTarget.previousElementSibling.value) {
      todoItems.push({
        id: generateRandomId(),
        isCompleted: false,
        message: ev.currentTarget.previousElementSibling.value,
        categoryId: selectedCategoryId,
      });
    } else {
      return;
    }

    ev.currentTarget.previousElementSibling.value = "";

    renderTodoListItem();
  }
}

function deleteTodoItem(id) {
  for (let i = 0; i < todoItems.length; i++) {
    if (todoItems[i].id == id) {
      todoItems.splice(i, 1);
    }
  }

  renderTodoListItem();
}

function deleteAll() {
  localStorage.clear();
  todoItems = [];
  categoryItems = [];

  renderTodoListItem();
  renderCategories();
}

function toggleComplete(id) {
  for (let i = 0; i < todoItems.length; i++) {
    if (todoItems[i].id == id) {
      todoItems[i].isCompleted = !todoItems[i].isCompleted;
    }
  }

  renderTodoListItem();
}

function editTodoItem(id) {
  for (let i = 0; i < todoItems.length; i++) {
    if (todoItems[i].id == id) {
      if (todoItems[i].message == null) {
        return;
      }
      let newTodoMessage = prompt(
        "please change your todo item",
        todoItems[i].message
      );
      if (newTodoMessage != null) {
        todoItems[i].message = newTodoMessage;
      }
    }
  }

  renderTodoListItem();
}

function renderTodoListItem() {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));

  let [div] = document.getElementsByClassName("order-list");
  div.innerHTML = ""; // first empty array

  for (let i = 0; i < todoItems.length; i++) {
    if (todoItems[i].categoryId != selectedCategoryId) continue;
    const li = document.createElement("li");
    li.className =
      "bg-gradient-to-r from-cyan-500 to-blue-500 box-border h-auto w-auto rounded-md p-2 text-center";
    if (todoItems[i].isCompleted) {
      li.innerHTML = `<s>${todoItems[i].message}</s>`;
    } else {
      li.textContent = todoItems[i].message;
    }

    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "m-4 rounded-full";
    input.checked = todoItems[i].isCompleted;
    input.addEventListener("change", (ev) => {
      toggleComplete(todoItems[i].id);
    });

    const button = document.createElement("button");
    button.innerHTML = `<p class="text-red-600 mr-4">x</p>`;
    button.addEventListener("click", (ev) => {
      deleteTodoItem(todoItems[i].id);
    });

    const editButton = document.createElement("button");
    editButton.innerHTML = `<button class="rounded-full bg-white text-black h-7 w-20 bg-yellow-300 mx-4">Edit</button>`;
    editButton.addEventListener("click", (ev) => {
      editTodoItem(todoItems[i].id);
    });

    li.prepend(input);
    li.append(editButton);
    li.append(button);
    div.append(li);
  }
}

renderTodoListItem();
renderCategories();

function generateRandomId() {
  return Math.random().toString().slice(2);
}
