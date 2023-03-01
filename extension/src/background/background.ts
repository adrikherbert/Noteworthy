chrome.contextMenus.create({
  id: "Note",
  title: "Noteworthy - Create Note",
  contexts: ["all"]
}, () => chrome.runtime.lastError);

console.log('background running');

chrome.contextMenus.onClicked.addListener(menuItemClicked);

function menuItemClicked(info, tab) {
  let msg =
  {
    info: info,
    tab: tab,
    txt: "Note"
  }
  chrome.tabs.sendMessage(tab.id, msg);
}