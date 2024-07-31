let userData;
let hubsData;
let abortController;

const userDataReadyEvent = new Event('userDataReady');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        abortController = new AbortController();
        json = localStorage.getItem('userInfo');
        userData = JSON.parse(json)
        hubsData = await fetchData('http://localhost:3000/api/hubs/all-hubs');
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
