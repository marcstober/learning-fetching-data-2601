console.log("Loading JS")

const xhrButton = document.getElementById("xhr-button")
const xhrServerErrorButton = document.getElementById("xhr-server-error-button")
const xhrErrorButton = document.getElementById("xhr-error-button")
const xhrSlowButton = document.getElementById("xhr-slow-button")

const fetchButton = document.getElementById("fetch-button")
const axiosButton = document.getElementById("axios-button")
const resultDiv = document.getElementById("result")
const progressDiv = document.getElementById("progress")

// const url = "https://jsonplaceholder.typicode.com/todos" // Copilot suggestion - TODO: try it?
const url = "https://dummyjson.com/todos"

xhrButton.addEventListener("click", () => {
    startXHRRequest(url)
})

xhrServerErrorButton.addEventListener("click", () => {
    startXHRRequest(url + "badurl")
})

xhrErrorButton.addEventListener("click", () => {
    startXHRRequest("http://invalid-url") // intentionally invalid URL to trigger network error
})

xhrSlowButton.addEventListener("click", () => {
    startXHRRequest(url + "?delay=5000")
})

function startXHRRequest(url) {
    progressDiv.textContent = "Loading..."

    const xhr = new XMLHttpRequest()
    xhr.open("GET", url) // doesn't actually "open" it, just gets it ready

    // set up event handlers
    xhr.onload = () => {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText)
            displayData(data)
        } else {
            progressDiv.textContent = `❌ Server error occurred: ${xhr.status} ${xhr.statusText}`
        }
    }

    xhr.onerror = () => {
        progressDiv.textContent = "❌ Network error occurred!"
        // the browser doesn't give us much more information, ostensibly for security reasons
    }

    xhr.onprogress = (event) => {
        progressDiv.textContent = `${event.loaded} / ${event.total} bytes received`
    }

    // actually send the request here
    xhr.send()
}

fetchButton.addEventListener("click", () => {
    progressDiv.textContent = "Loading..."

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok")
            }
            return response.json()
        })
        .then((data) => displayData(data))
        .catch((error) =>
            console.error("Error fetching data with Fetch API:", error)
        )
})

axiosButton.addEventListener("click", () => {
    progressDiv.textContent = "Loading..."

    axios
        .get(url)
        .then((response) => displayData(response.data))
        .catch((error) =>
            console.error("Error fetching data with Axios:", error)
        )
})

function displayData(data) {
    resultDiv.innerHTML = ""
    data.forEach((item) => {
        const p = document.createElement("p")
        p.textContent = `ID: ${item.id}, Title: ${item.title}`
        resultDiv.appendChild(p)
    })
}
