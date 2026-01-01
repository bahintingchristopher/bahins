
    // // 1. ASK FOR THE KEY AS SOON AS THE PAGE OPENS
    // const adminKey = prompt("Please enter the Admin Password:");

    // if (!adminKey) {
    //   alert("Access Denied: No key provided.");
    //   document.body.innerHTML = "<h1>Unauthorized</h1>";
    // } else {
    //   loadMessages();
    // }

    // function loadMessages() {
    //   // 2. SEND THE KEY IN THE HEADERS
    //   fetch('https://bahins-backend.onrender.com/messages', {
    //     headers: { 'x-admin-key': adminKey }
    //   })
    //   .then(res => {
    //     if (res.status === 401) throw new Error("Incorrect Secret Key!");
    //     if (!res.ok) throw new Error("Server Error");
    //     return res.json();
    //   })
    //   .then(messages => {
    //     const list = document.getElementById('allMessages');
    //     list.innerHTML = ''; 

    //     messages.forEach(msg => {
    //       const li = document.createElement('li');

    //       // Date Formatting
    //       let formattedDate = msg.created_at ? new Date(msg.created_at).toLocaleString('en-PH', { timeZone: 'Asia/Manila' }) : 'No Date';

    //       const messageSpan = document.createElement('span');
    //       messageSpan.textContent = `${formattedDate}, ${msg.name} (${msg.email}) - ${msg.reason}: ${msg.message}`;

    //       const deleteBtn = document.createElement('button');
    //       deleteBtn.textContent = 'Delete';
    //       deleteBtn.className = 'delete-btn';

    //       deleteBtn.addEventListener('click', () => {
    //         if (confirm(`Are you sure you want to delete the message from ${msg.name}?`)) {
    //           // 3. SEND THE KEY FOR DELETE REQUESTS TOO
    //           fetch(`https://bahins-backend.onrender.com/messages/${msg._id}`, {
    //             method: 'DELETE',
    //             headers: { 'x-admin-key': adminKey }
    //           })
    //           .then(response => {
    //             if (response.ok) {
    //               alert(`Deleted successfully.`);
    //               li.remove();
    //             } else {
    //               alert('Delete failed. Check your key.');
    //             }
    //           })
    //         }
    //       });

    //       li.appendChild(messageSpan);
    //       li.appendChild(deleteBtn);
    //       list.appendChild(li);
    //     });
    //   })
    //   .catch(error => {
    //     alert(error.message);
    //     console.error('Error:', error);
    //   });
    // }
  

    
//THIS IS MY  FINAL VERSION WITH NO AUTHENTICATION
// 1. Ask for the key immediately
const adminKey = prompt("Please enter the Admin Password:");
const GUEST_KEY = "guest1234!"; // The password for guests

if (!adminKey) {
    alert("Access Denied: No password provided.");
    document.body.innerHTML = "<h1 style='text-align:center; margin-top:50px;'>Unauthorized</h1>";
} else {
    window.addEventListener('DOMContentLoaded', loadMessages);
}

function loadMessages() {
    fetch('https://bahins-backend.onrender.com/messages', {
        headers: { 'x-admin-key': adminKey }
    })
    .then(res => {
        if (res.status === 401) throw new Error("Incorrect Secret Key!");
        return res.json();
    })
    .then(messages => {
        const list = document.getElementById('allMessages');
        list.innerHTML = ''; 

        messages.forEach(msg => {
            const li = document.createElement('li');

            // Date Formatting
            let formattedDate = msg.created_at 
                ? new Date(msg.created_at).toLocaleString('en-PH', { timeZone: 'Asia/Manila' }) 
                : 'No Date';

            const messageSpan = document.createElement('span');
            messageSpan.textContent = `${formattedDate}, ${msg.name}: ${msg.message}`;
            li.appendChild(messageSpan);

            // 2. CREATE THE BUTTON FOR EVERYONE
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';

            deleteBtn.addEventListener('click', () => {
                // 3. CHECK PERMISSION ONLY WHEN CLICKED
                if (adminKey === GUEST_KEY) {
                    alert("Sorry, you are not authorized to delete content.");
                } else {
                    // Actual Delete Logic for the Real Admin
                    if (confirm(`Are you sure you want to delete this message?`)) {
                        fetch(`https://bahins-backend.onrender.com/messages/${msg._id}`, {
                            method: 'DELETE',
                            headers: { 'x-admin-key': adminKey }
                        })
                        .then(response => {
                            if (response.ok) {
                                alert(`Deleted successfully.`);
                                li.remove();
                            } else {
                                alert('Delete failed. Check your admin permissions.');
                            }
                        });
                    }
                }
            });

            li.appendChild(deleteBtn);
            list.appendChild(li);
        });
    })
    .catch(error => alert(error.message));
}