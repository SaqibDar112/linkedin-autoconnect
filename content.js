chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startConnecting") {
      startConnecting().then(result => {
        sendResponse({ status: result });
      });
      return true;
    }
  });
  
  async function startConnecting() {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    let successCount = 0;
  
    try {
      const connectButtons = Array.from(document.querySelectorAll('button'))
        .filter(button => {
          const spans = button.querySelectorAll('span');
          return Array.from(spans).some(span => 
            span.textContent.trim() === 'Connect' ||
            span.textContent.trim() === 'Follow and connect'
          );
        })
        .filter(button => 
          button.offsetParent !== null &&
          !button.disabled &&
          !button.closest('.artdeco-modal')
        );
  
      console.log('Found connect buttons:', connectButtons.length);
  
      for (const button of connectButtons) {
        try {
          button.scrollIntoView({ behavior: 'smooth', block: 'center' });
          await delay(500);
  
          button.click();
          await delay(1000);
  
          const modalButtons = Array.from(document.querySelectorAll('.artdeco-modal__actionbar button, .artdeco-modal button'));
          const sendButton = modalButtons.find(button => {
            const buttonText = button.textContent.trim().toLowerCase();
            return (buttonText.includes('send') || buttonText.includes('connect')) &&
                   !buttonText.includes('add a note') &&
                   !button.disabled;
          });
  
          if (sendButton) {
            sendButton.click();
            successCount++;
            console.log('Connection sent successfully');
            await delay(2000);
          }
  
          const gotItButton = document.querySelector('button[aria-label="Got it"]');
          if (gotItButton) {
            return `LinkedIn rate limit reached. Sent ${successCount} connection${successCount === 1 ? '' : 's'} before stopping.`;
          }
  
        } catch (error) {
          console.error('Error processing connection:', error);
          continue;
        }
      }
  
      return `Successfully sent ${successCount} connection request${successCount === 1 ? '' : 's'}!`;
  
    } catch (error) {
      console.error('Error in startConnecting:', error);
      return 'An error occurred while connecting';
    }
  }
  
  console.log('LinkedIn Auto Connector content script loaded');