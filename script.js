console.log("Loading JS");

const timeoutButton = document.getElementById("timeout-button");
const clearButton = document.getElementById("clear-button");

const xhrButton = document.getElementById("xhr-button");
const xhrServerErrorButton = document.getElementById("xhr-server-error-button");
const xhrErrorButton = document.getElementById("xhr-error-button");
const xhrProgressButton = document.getElementById("xhr-progress-button");
const xhrTimeoutButton = document.getElementById("xhr-timeout-button");

const fetchButton = document.getElementById("fetch-button");
const fetchWithPromiseButton = document.getElementById(
  "fetch-with-promise-button"
);

const axiosButton = document.getElementById("axios-button");

const resultDiv = document.getElementById("result");
const progressDiv = document.getElementById("progress");

// const url = "https://jsonplaceholder.typicode.com/todos" // another option suggested by Copilot, keeping in case we ever want to try it
const url = "https://dummyjson.com/todos";

timeoutButton.addEventListener("click", () => {
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
  resultDiv.textContent = "";
});

xhrButton.addEventListener("click", () => {
  startXHRRequest(url);
});

xhrServerErrorButton.addEventListener("click", () => {
  startXHRRequest(url + "badurl");
});

xhrErrorButton.addEventListener("click", () => {
  startXHRRequest("http://invalid-url"); // intentionally invalid URL to trigger network error
});

xhrProgressButton.addEventListener("click", () => {
  alert(
    "🚧 This should be an example of reporting progress as data is downloaded, " +
      "but that would require specific server-side code." +
      "\n\n" +
      "Currently, it doesn't do anything different the the Fetch Data button."
  );
  startXHRRequest(url + "?delay=500");
});

xhrTimeoutButton.addEventListener("click", () => {
  alert(
    "🚧 This should be an example of a request timing out " +
      "using the timeout features XMLHttpRequest, " +
      "but this example isn't finished yet."
  );
  startXHRRequest(url + "?delay=5000");
});

function startXHRRequest(url) {
  resultDiv.textContent = "";
  progressDiv.textContent = "Loading...";

  let xhr = new XMLHttpRequest();
  // sets up the request, doesn't really "open" it
  xhr.open("GET", url); // doesn't actually "open" it, just gets it ready

  // set up event handlers
  xhr.addEventListener("load", () => {
    console.log(xhr.responseText);
    if (xhr.status === 200) {
      let data = JSON.parse(xhr.responseText);
      console.log(data);
      displayTodos(data.todos);
    } else {
      progressDiv.textContent = `❌ Server error occurred: ${xhr.status} ${xhr.statusText}`;
    }
  });

  xhr.addEventListener("error", () => {
    progressDiv.textContent = "❌ Network error occurred!";
    // the browser doesn't give us much more information, ostensibly for security reasons
  });

  xhr.addEventListener("progress", (event) => {
    progressDiv.textContent = `${event.loaded} / ${event.total} bytes received.`;
  });

  // actually send the request here
  xhr.send();
}

fetchButton.addEventListener("click", async () => {
  resultDiv.textContent = "";
  progressDiv.textContent = "Loading...";

  // not actually blocking
  const resp = await fetch("https://dummyjson.com/todos?delay=500");

  progressDiv.textContent = "Response received, processing data...";

  const data = await resp.json();

  displayTodos(data.todos);
});

fetchWithPromiseButton.addEventListener("click", () => {
  resultDiv.textContent = "";
  progressDiv.textContent = "Loading...";

  // return value will be a Promise
  // (usually don't bother assigning it to a variable like this)
  const promise = fetch("https://dummyjson.com/todos?delay=500");
  promise
    .then((response) => {
      progressDiv.textContent = "Promise resolved, processing data...";

      // .json() also returns a Promise;
      // note that we don't assign it to a variable,
      // just call .then() on it as the next step.
      // And by return-ing it, we can chain another .then()
      // without nesting it inside the first .then().

      // Also, while JSON means "JavaScript Object Notation",
      // the .json() method gets us the actual JavaScript object,
      // not the string in JSON "notation."

      return response.json();
    })
    .then((data) => displayTodos(data.todos));
});

axiosButton.addEventListener("click", () => {
  resultDiv.textContent = "";
  progressDiv.textContent = "Loading...";

  axios
    .get(url)
    .then((response) => displayTodos(response.data.todos))
    .catch((error) => console.error("Error fetching data with Axios:", error));
});

// refactored by extracting code into a function:
function writeMessage(msg) {
  let p = document.createElement("p");
  p.textContent = msg;
  resultDiv.appendChild(p);
}

function displayTodos(todos) {
  todos.forEach((todo) => {
    writeMessage(`${todo.completed ? "✅" : "⏹️"} ${todo.todo}`);
  });
}
