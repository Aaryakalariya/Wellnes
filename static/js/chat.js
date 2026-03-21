/* ================= CONFIG ================= */
let CONFIG = {
    apiKey: "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",   // 🔴 PUT YOUR KEY HERE
    model: "mistralai/mistral-7b-instruct",  // ✅ stable + free
    apiUrl: "https://openrouter.ai/api/v1/chat/completions"
};
/* ========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const sendBtn = document.getElementById("sendBtn");
    const chatInput = document.getElementById("chatInput");
    const chatMessages = document.getElementById("chatMessages");

    // Safety check
    if (!sendBtn || !chatInput || !chatMessages) {
        console.error("Chat elements not found ❌");
        return;
    }

    /* ================= EVENTS ================= */

    sendBtn.addEventListener("click", sendMessage);

    chatInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });

    document.querySelectorAll(".quick-actions button").forEach(btn => {
        btn.addEventListener("click", () => {
            chatInput.value = btn.innerText;
            sendMessage();
        });
    });

    /* ================= FUNCTIONS ================= */

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === "") return;

        addMessage(message, "user");
        chatInput.value = "";

        getAIResponse(message);
    }

    function addMessage(text, sender) {
        const row = document.createElement("div");
        row.classList.add("chat-row");

        const msg = document.createElement("div");
        msg.classList.add("message", sender);
        msg.innerHTML = text;

        row.appendChild(msg);
        chatMessages.appendChild(row);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function getAIResponse(userMessage) {
        addMessage("Typing...", "bot");

        try {
            const response = await fetch(CONFIG.apiUrl, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + CONFIG.apiKey,
                    "Content-Type": "application/json",
                    "HTTP-Referer": window.location.origin, // ✅ required
                    "X-Title": "AI Chatbot"
                },
                body: JSON.stringify({
                    model: CONFIG.model,
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful AI health assistant. Give safe advice."
                        },
                        {
                            role: "user",
                            content: userMessage
                        }
                    ]
                })
            });

            // 🔍 RAW response debug
            const text = await response.text();
            console.log("RAW RESPONSE:", text);

            let data;
            try {
                data = JSON.parse(text);
            } catch {
                chatMessages.lastChild.remove();
                addMessage("Invalid server response ❌", "bot");
                return;
            }

            // Remove typing message
            chatMessages.lastChild.remove();

            // API error handling
            if (!response.ok) {
                addMessage("API Error ❌: " + (data.error?.message || "Unknown error"), "bot");
                return;
            }

            const botReply = data.choices?.[0]?.message?.content;

            if (!botReply) {
                addMessage("No response from AI ❌", "bot");
                return;
            }

            addMessage(botReply, "bot");

        } catch (error) {
            chatMessages.lastChild.remove();
            addMessage("Connection error ❌", "bot");
            console.error("Fetch Error:", error);
        }
    }

    /* ================= OPTIONAL SETTINGS ================= */

    window.updateAISettings = function(newKey, newModel) {
        if (newKey) CONFIG.apiKey = newKey;
        if (newModel) CONFIG.model = newModel;

        console.log("Updated Config:", CONFIG);
    };

});