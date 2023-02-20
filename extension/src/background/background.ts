chrome.contextMenus.create({
  id: "Note",
  title: "Noteworthy - Create Note",
  contexts: ["all"]
}, () => chrome.runtime.lastError);

console.log('background running');
chrome.contextMenus.onClicked.addListener(menuItemClicked);

function menuItemClicked(info, tab) {
  let msg = {
    txt: "hello"
  }
  chrome.tabs.sendMessage(tab.id, msg);
}