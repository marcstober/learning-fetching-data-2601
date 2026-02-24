console.log("Loading JS");

const theButton = document.getElementById("the-button");
const clearButton = document.getElementById("clear-button");
const xhrButton = document.getElementById("xhr-button");
const fetchButton = document.getElementById("fetch-button");
const axiosButton = document.getElementById("axios-button");
const fetchWithPromiseButton = document.getElementById(
  "fetch-with-promise-button",
);

axiosButton.addEventListener("click", () => {
  console.log(axios);
  axios
    .get("https://dummyjson.com/todos")
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
});

const result = document.getElementById("result");

theButton.addEventListener("click", () => {
  writeMessage("You clicked the button!");

  //   setInterval(() => {
  setTimeout(() => {
    // callback function
    writeMessage("A. This comes after!");
  }, 0);
  // message A still comes after message B (even with 0 ms timeout!)

  writeMessage("B. This message comes next!");
});

clearButton.addEventListener("click", () => {
  result.textContent = "";
});

xhrButton.addEventListener("click", () => {
  writeMessage("You clicked the XHR button");

  let req = new XMLHttpRequest();

  // sets up the request, doesn't really "open" it
  req.open("GET", "https://dummyjson.com/todos");

  req.addEventListener("load", () => {
    console.log(req.responseText);
    let data = JSON.parse(req.responseText);
    console.log(data);
    displayTodos(data.todos);
  });

  req.send();
});

fetchButton.addEventListener("click", async function () {
  // not actually blocking
  const resp = await fetch("https://dummyjson.com/todos?delay=2000");

  const data = await resp.json();

  displayTodos(data.todos);
});

fetchWithPromiseButton.addEventListener("click", function () {
  // resp is going to be a Promise
  const resp = fetch("https://dummyjson.com/todos?delay=500");

  resp.then((result) => {
    // JavaScript Object Notation
    // Note that .json() returns the **objects** not the JSON text.
    result.json().then((data) => {
      displayTodos(data.todos);
    });
  });

  console.log(resp); // without "await"

  //   const data = await resp.json();

  //   displayTodos(data.todos);
});

// refactored by extracting code into a function:
function writeMessage(msg) {
  let p = document.createElement("p");
  p.textContent = msg;
  result.appendChild(p);
}

function displayTodos(todos) {
  todos.forEach((todo) => {
    writeMessage(`${todo.completed ? "✅" : "⏹️"} ${todo.todo}`);
  });
}
