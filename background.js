// chrome.action.onClicked.addListener((tab) => {
//   chrome.tabs.create({
//     url: chrome.runtime.getURL("settings.html")
//   });
// });

const GOOGLE_ORIGIN = 'https://www.google.com';

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));