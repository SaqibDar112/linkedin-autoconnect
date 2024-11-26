document.getElementById('startConnecting').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.tabs.sendMessage(tab.id, { action: "startConnecting" }, (response) => {
      if (chrome.runtime.lastError) {
        document.getElementById('status').textContent = 'Error: Please refresh the LinkedIn page';
      } else if (response && response.status) {
        document.getElementById('status').textContent = response.status;
      }
    });
  });