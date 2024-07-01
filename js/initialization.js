let userData;
let hubsData;
let abortController;
//let currentLocation = localStorage.getItem('coords'); disabled until full release

const userDataReadyEvent = new Event('userDataReady');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        abortController = new AbortController();
        userData = await fetchData('data/user.json');
        console.log("GET /users/{this-user-id}");
        hubsData = await fetchData('data/hubs.json');
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
