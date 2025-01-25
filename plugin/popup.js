document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.sendMessage({ action: 'getPreviousTabUrl' }, function(response) {
        const linkElement = document.getElementById('link');
        linkElement.textContent = 'Link: ' + response.previousTabUrl;
        console.log('Previous tab URL:', response.previousTabUrl);
    });
});