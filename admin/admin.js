/**
 * ADMIN PORTAL LOGIC
 * Features: Password protection, Guest/Master modes, Secure Deletion, Live Stats
 */

// 1. CONFIGURATION
const GUEST_KEY = "guest1234!"; 
const API_URL = 'https://bahins-backend.onrender.com/messages';
const COUNT_URL = 'https://bahins-backend.onrender.com/message-count';

let activeAdminKey = "";

// 2. WAIT FOR PAGE TO LOAD
window.addEventListener('DOMContentLoaded', () => {
    const userInput = prompt("Please enter the Admin Password to access the messages:");

    if (userInput === null) {
        lockPage("Login Cancelled", "Please refresh the page and enter a password to view messages.");
    } else if (userInput.trim() === "") {
        lockPage("Password Required", "Access is forbidden without a valid security key.");
    } else {
        activeAdminKey = userInput;
        loadMessages();
    }
});

// 3. FETCH MESSAGES & STATS
function loadMessages() {
    fetch(API_URL, {
        method: 'GET',
        headers: { 
            'x-admin-key': activeAdminKey,
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if (res.status === 401) throw new Error("Invalid Password. Access Denied.");
        if (!res.ok) throw new Error("Server connection failed.");
        return res.json();
    })
    .then(messages => {
        // Reveal UI
        const header = document.getElementById('adminHeader');
        const main = document.getElementById('adminMain');
        if (header) header.style.display = 'block';
        if (main) main.style.display = 'block';
        
        renderMessages(messages);
        updateMessageCount(); // Load the count bubble
    })
    .catch(error => {
        lockPage("Access Forbidden", error.message);
    });
}

// 4. FETCH TOTAL COUNT
function updateMessageCount() {
    fetch(COUNT_URL)
        .then(res => res.json())
        .then(data => {
            const badge = document.getElementById('msgCountBadge');
            if (badge) {
                badge.textContent = data.count;
            }
        })
        .catch(err => console.error("Error fetching count:", err));
}

// 5. RENDER MESSAGES LIST
function renderMessages(messages) {
    const list = document.getElementById('allMessages');
    if (!list) return;
    list.innerHTML = ''; 

    if (messages.length === 0) {
        list.innerHTML = '<p style="text-align:center; padding: 20px;">No messages found.</p>';
        return;
    }

    messages.forEach(msg => {
        const li = document.createElement('li');
        li.className = "message-card";
        const date = msg.created_at ? new Date(msg.created_at).toLocaleString('en-PH') : 'N/A';

        li.innerHTML = `
            <div class="msg-info">
                <strong>From:</strong> ${msg.name} <strong>Emal:</strong>(<a href="mailto:${msg.email}">${msg.email}</a>)<br>
                <strong>Reason:</strong> ${msg.reason || 'General'} | <strong>Date:</strong> ${date}
            </div>
            <p class="msg-body">${msg.message}</p>
        `;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete Message';
        deleteBtn.className = 'delete-btn';

        deleteBtn.onclick = () => {
            if (activeAdminKey === GUEST_KEY) {
                alert("🔒 Guest Mode: You cannot delete messages.");
                return;
            }

            if (confirm("Permanently delete this message?")) {
                fetch(`${API_URL}/${msg._id}`, {
                    method: 'DELETE',
                    headers: { 'x-admin-key': activeAdminKey }
                })
                .then(res => {
                    if (res.ok) {
                        li.remove();
                        updateMessageCount(); // <-- Automatically update the bubble after deleting!
                    } else {
                        alert("Error: Server rejected deletion.");
                    }
                })
                .catch(err => alert("Connection error: " + err.message));
            }
        };

        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
}

// 6. LOCK SCREEN UI
function lockPage(title, description) {
    document.body.innerHTML = `
        <div class="lock-screen-container">
            <div class="lock-card">
                <div class="lock-icon">🔐</div>
                <h2 class="lock-title">${title}</h2>
                <p class="lock-text">${description}</p>
                <button class="lock-button" onclick="location.reload()">
                    Login Again
                </button>
            </div>
        </div>
    `;
}