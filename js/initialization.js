let userData;
let hubsData;
let abortController;
//let currentLocation = localStorage.getItem('coords'); disabled until full release

const userDataReadyEvent = new Event('userDataReady');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        abortController = new AbortController();
        userData = await fetchData('http://localhost:3000/api/users/1');
        console.log("GET /users/{this-user-id}");
        hubsData = await fetchData('http://localhost:3000/api/hubs/all-hubs');
        console.log("GET /hubs");

        document.dispatchEvent(userDataReadyEvent);
    } catch (error) {
        handleError(error, 'Initialization error:');
    }
});

window.addEventListener('beforeunload', () => {
    if (abortController) {
        abortController.abort();
    }
});
