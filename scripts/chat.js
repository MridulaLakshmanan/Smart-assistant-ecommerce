/**
 * SmartCart AI - Chat Interface Logic
 * Configured with Google Gemini API
 */

// Read API Key securely from the un-versioned config file
const GEMINI_API_KEY = window.ENV ? window.ENV.GEMINI_API_KEY : "YOUR_API_KEY_HERE";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

document.addEventListener('DOMContentLoaded', () => {
  const chatInput = document.getElementById('chat-input');
  const btnSend = document.getElementById('btn-send');
  const chatHistory = document.getElementById('chat-history');

  if (!chatInput || !btnSend || !chatHistory) return;

  // Auto-resize textarea
  chatInput.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });

  // Handle Enter key (Shift+Enter for new line)
  chatInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  btnSend.addEventListener('click', handleSend);

  // Quick Action Buttons
  const quickActions = document.querySelectorAll('.quick-actions .badge');
  quickActions.forEach(badge => {
    badge.addEventListener('click', (e) => {
      chatInput.value = e.target.textContent;
      handleSend();
    });
  });

  function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Reset input
    chatInput.value = '';
    chatInput.style.height = 'auto';

    // Append User Message
    appendMessage(text, 'user');

    // Show Typing Indicator
    showTypingIndicator();

    // AI Response Integration
    if (GEMINI_API_KEY === "YOUR_API_KEY_HERE") {
      // Fallback if no API key is provided
      setTimeout(() => {
        removeTypingIndicator();
        const mockResponse = getMockResponse(text);
        appendMessage(mockResponse, 'bot');
      }, 1500);
    } else {
      // Call Real LLM API
      fetchGeminiResponse(text);
    }
  }

  async function fetchGeminiResponse(userText) {
    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are the SmartCart AI Assistant. Be helpful, concise, and recommend products accurately. User: ${userText}`
            }]
          }]
        })
      });

      const data = await response.json();
      removeTypingIndicator();

      if (data.candidates && data.candidates[0].content.parts[0].text) {
        // Render valid AI response
        appendMessage(data.candidates[0].content.parts[0].text, 'bot');
      } else {
        appendMessage("I'm sorry, I couldn't process that request right now.", 'bot');
      }

    } catch (error) {
      console.error("LLM Error:", error);
      removeTypingIndicator();
      appendMessage("Connection error while reaching the AI.", 'bot');
    }
  }

  function appendMessage(text, sender) {
    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper message-${sender}`;

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = text; // allow HTML for product embeds if needed

    wrapper.appendChild(bubble);
    chatHistory.appendChild(wrapper);

    scrollToBottom();
  }

  function showTypingIndicator() {
    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper message-bot typing-indicator-wrapper';
    wrapper.id = 'typing-indicator';

    wrapper.innerHTML = `
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;

    chatHistory.appendChild(wrapper);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  function scrollToBottom() {
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  function getMockResponse(query) {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('laptop') || lowerQuery.includes('macbook')) {
      return `I found some great laptops for you! The latest **MacBook Pro M3** is highly rated for performance. I've pinned a recommendation to your product panel.`;
    } else if (lowerQuery.includes('deal') || lowerQuery.includes('cheap')) {
      return `Sure thing. We have a <span class="badge badge-danger">20% OFF</span> flash sale on wireless headphones right now. Should I filter the results by price?`;
    } else if (lowerQuery.includes('thank')) {
      return `You're welcome! Let me know if you need anything else.`;
    }

    return `Based on your request "${query}", I'm bringing up a few options that match your criteria. Let me know if you have a specific price range!`;
  }
});
