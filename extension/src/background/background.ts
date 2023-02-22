chrome.contextMenus.create({
  id: "Note",
  title: "Noteworthy - Create Note",
  contexts: ["all"]
}, () => chrome.runtime.lastError);

console.log('background running');

chrome.contextMenus.onClicked.addListener(menuItemClicked);

function menuItemClicked(info, tab) {
  let msg;
  info.selectionText ? msg = {
    info: info,
    tab: tab,
    txt: "HTML"
  } : msg = {
    info: info,
    tab: tab,
    txt: "Note"
  };
  console.log(msg);
  chrome.tabs.sendMessage(tab.id, msg);
}