console.log('Chrome Extension Running');

chrome.runtime.onMessage.addListener(gotMenuClick);
function gotMenuClick(message, sender, sendResponse) {
    console.log(message.txt);
    sendResponse();
}