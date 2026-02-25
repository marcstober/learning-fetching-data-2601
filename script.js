console.log("Loading JS");

const timeoutButton = document.getElementById("timeout-button");
const clearButton = document.getElementById("clear-button");
const xhrButton = document.getElementById("xhr-button");
const xhrServerErrorButton = document.getElementById("xhr-server-error-button");
const xhrErrorButton = document.getElementById("xhr-error-button");
const xhrSlowButton = document.getElementById("xhr-slow-button");

const fetchButton = document.getElementById("fetch-button");
const axiosButton = document.getElementById("axios-button");
const fetchWithPromiseButton = document.getElementById(
    "fetch-with-promise-button"
);
const resultDiv = document.getElementById("result");
const progressDiv = document.getElementById("progress");

// const url = "https://jsonplaceholder.typicode.com/todos" // Copilot suggestion - TODO: try it?
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

xhrSlowButton.addEventListener("click", () => {
    startXHRRequest(url + "?delay=5000");
});

function startXHRRequest(url) {
    resultDiv.textContent = "";
    progressDiv.textContent = "Loading...";

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url); // doesn't actually "open" it, just gets it ready

    // set up event handlers
    xhr.onload = () => {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            displayTodos(data.todos);
        } else {
            progressDiv.textContent = `❌ Server error occurred: ${xhr.status} ${xhr.statusText}`;
        }
    };

    xhr.onerror = () => {
        progressDiv.textContent = "❌ Network error occurred!";
        // the browser doesn't give us much more information, ostensibly for security reasons
    };

    xhr.onprogress = (event) => {
        progressDiv.textContent = `${event.loaded} / ${event.total} bytes received`;
    };

    // actually send the request here
    xhr.send();
}

fetchButton.addEventListener("click", () => {
    resultDiv.textContent = "";
    progressDiv.textContent = "Loading...";

    // return value will be a Promise
    // (usually don't bother assigning it to a variable like this)
    const promise = fetch("https://dummyjson.com/todos?delay=500");
    promise
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            // .json() also returns a Promise,
            // note that we don't assign it to a variable,
            // just call .then() on it as the next step
            return response.json();
        })
        .then((data) => displayTodos(data.todos))
        .catch((error) =>
            console.error("Error fetching data with Fetch API:", error)
        );
});

axiosButton.addEventListener("click", () => {
    resultDiv.textContent = "";
    progressDiv.textContent = "Loading...";

    axios
        .get(url)
        .then((response) => displayTodos(response.data.todos))
        .catch((error) =>
            console.error("Error fetching data with Axios:", error)
        );
});

// function displayData(data) {
//     resultDiv.innerHTML = ""
//     data.forEach((item) => {
//         const p = document.createElement("p")
//         p.textContent = `ID: ${item.id}, Title: ${item.title}`
//         resultDiv.appendChild(p)
//     })
// }

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
