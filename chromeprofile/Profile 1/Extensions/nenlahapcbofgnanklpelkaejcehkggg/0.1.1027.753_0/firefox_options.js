/* global browser */

const enabledButton = document.getElementById('enabled');
const disabledButton = document.getElementById('disabled');

async function getCurrentValueFromStorage() {
  try {
    const storageResult = await browser.storage.local.get('trackingEnabled');
    const currentTrackingValue = storageResult ? storageResult.trackingEnabled : null;
    if (currentTrackingValue === true) {
      enabledButton.checked = true;
    } else {
      disabledButton.checked = true;
    }
  } catch (e) {
    // do nothing
  }
}

getCurrentValueFromStorage();

enabledButton.addEventListener('click', async e => {
  await browser.storage.local.set({trackingEnabled: true});
});

disabledButton.addEventListener('click', async e => {
  await browser.storage.local.set({trackingEnabled: false});
});

browser.storage.onChanged.addListener((changes, areaName) => {
  const newTrackingValue =
    changes && changes.trackingEnabled ? changes.trackingEnabled.newValue : null;
  if (newTrackingValue) {
    enabledButton.checked = true;
  } else {
    disabledButton.checked = true;
  }
});
