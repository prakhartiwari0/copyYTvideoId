
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "copyToClipboard") {
    const variableValue = message.videoID;

    function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(
        () => {
          console.log("Text successfully copied to clipboard");
        },
        (err) => {
          console.error("Failed to copy text to clipboard", err);
        }
      );
    }

    // Copy the received value to clipboard
    copyToClipboard(variableValue);
  }
});