// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// PWA Install Prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Show install button or notification
  showInstallPrompt();
});

function showInstallPrompt() {
  // Create install button or notification
  const installBanner = document.createElement('div');
  installBanner.id = 'install-banner';
  installBanner.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 1rem;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      backdrop-filter: blur(10px);
    ">
      <div>
        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">Install WriteGen</h4>
        <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Get quick access to your content creation tools</p>
      </div>
      <div style="display: flex; gap: 0.5rem;">
        <button id="install-btn" style="
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
        ">Install</button>
        <button id="dismiss-btn" style="
          background: transparent;
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
        ">Dismiss</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(installBanner);
  
  // Handle install button click
  document.getElementById('install-btn').addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      deferredPrompt = null;
      installBanner.remove();
    }
  });
  
  // Handle dismiss button click
  document.getElementById('dismiss-btn').addEventListener('click', () => {
    installBanner.remove();
  });
}

// Handle app installed
window.addEventListener('appinstalled', (evt) => {
  console.log('PWA was installed');
  // Hide install banner if visible
  const installBanner = document.getElementById('install-banner');
  if (installBanner) {
    installBanner.remove();
  }
});

// Offline detection
window.addEventListener('online', () => {
  console.log('App is online');
  // Show online indicator
  showStatusMessage('You are back online!', 'success');
});

window.addEventListener('offline', () => {
  console.log('App is offline');
  // Show offline indicator
  showStatusMessage('You are offline. Some features may be limited.', 'warning');
});

function showStatusMessage(message, type) {
  const statusMessage = document.createElement('div');
  statusMessage.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? '#22c55e' : '#f59e0b'};
    color: white;
    padding: 1rem 2rem;
    border-radius: 25px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 1001;
    font-weight: 600;
    animation: slideDown 0.3s ease;
  `;
  statusMessage.textContent = message;
  
  document.body.appendChild(statusMessage);
  
  setTimeout(() => {
    statusMessage.remove();
  }, 3000);
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      transform: translateX(-50%) translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);



