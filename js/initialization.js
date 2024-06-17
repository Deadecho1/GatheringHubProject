let userData;
let hubsData;
let abortController;
let currentLocation = localStorage.getItem('coords');
const defaultLocation = [32.0681777049327, 34.803421411031955];

const userDataReadyEvent = new Event('userDataReady');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        abortController = new AbortController();
        userData = await fetchData('data/user.json');
        hubsData = await fetchData('data/hubs.json');

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
