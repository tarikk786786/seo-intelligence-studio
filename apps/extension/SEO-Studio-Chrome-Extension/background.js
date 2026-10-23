// Background Service Worker (Manifest V3)
chrome.runtime.onInstalled.addListener(() => {
    console.log('[SEO Intelligence Studio] Extension installed successfully.');
});
// Message listener for tab communication
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'GET_WORKSPACE_STATUS') {
        sendResponse({ status: 'ACTIVE', backendUrl: 'http://localhost:3000' });
    }
    return true;
});
