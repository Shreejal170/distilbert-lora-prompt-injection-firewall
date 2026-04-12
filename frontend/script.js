const sendBtn = document.getElementById('send-btn');
const promptInput = document.getElementById('prompt-input');
const chatBox = document.getElementById('chat-box');

// Function to add messages to the UI
function addMessage(text, type, resultClass = '') {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', type === 'user' ? 'user-msg' : 'system-msg');
    
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    if (resultClass) {
        contentDiv.classList.add(resultClass);
    }
    
    contentDiv.innerText = text;
    msgDiv.appendChild(contentDiv);
    
    chatBox.appendChild(msgDiv);
    
    // Auto-scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to handle the scan logic
async function processPrompt() {
    const text = promptInput.value.trim();
    if (!text) return;
    
    // Display what the user typed
    addMessage(text, 'user');
    promptInput.value = '';
    
    // Create an initial analyzing message
    const tempMsgDiv = document.createElement('div');
    tempMsgDiv.classList.add('message', 'system-msg');
    tempMsgDiv.innerHTML = `<div class="message-content">⏳ Analyzing...</div>`;
    chatBox.appendChild(tempMsgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('http://127.0.0.1:8000/scan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text })
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Remove analyzing message
        chatBox.removeChild(tempMsgDiv);

        if (data.prediction === 'Safe') {
            addMessage(`✅ Result: Safe`, 'system', 'safe-result');
        } else {
            addMessage(`🚨 Alert: Malicious Injection Detected! 🔴`, 'system', 'alert-result');
        }

    } catch (error) {
        // Remove analyzing message if there's an error
        if (chatBox.contains(tempMsgDiv)) {
            chatBox.removeChild(tempMsgDiv);
        }
        addMessage(`⚠️ Failed to connect to server: ${error.message}`, 'system', 'alert-result');
    }
}

// Click listener for the Test button
sendBtn.addEventListener('click', processPrompt);

// Allow pressing "Enter" key to send message
promptInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        processPrompt();
    }
});