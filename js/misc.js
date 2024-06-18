function setElementImage(id, src, alt) {
    const element = document.getElementById(id);
    if (element) {
        element.src = src;
        element.alt = alt;
    }
}

function setElementText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

async function fetchData(url) {
    try {
        const response = await fetch(url, { signal: abortController.signal });
        if (!response.ok) {
            throw new Error('Network response error');
        }
        return response.json();
    } catch (error) {
        handleError(error, `Error fetching data from ${url}:`);
    }
}

function handleError(error, message) {
    if (error.name !== 'AbortError') {
        console.error(message, error);
    }
}