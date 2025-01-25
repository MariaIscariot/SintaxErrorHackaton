let previousTabUrl = '';

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url) {
        previousTabUrl = tab.url;
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && tab.active) {
        previousTabUrl = changeInfo.url;
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPreviousTabUrl') {
        sendResponse({ previousTabUrl });
    }
});