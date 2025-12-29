
    // 1. ASK FOR THE KEY AS SOON AS THE PAGE OPENS
    const adminKey = prompt("Please enter the Admin Password:");

    if (!adminKey) {
      alert("Access Denied: No key provided.");
      document.body.innerHTML = "<h1>Unauthorized</h1>";
    } else {
      loadMessages();
    }

    function loadMessages() {
      // 2. SEND THE KEY IN THE HEADERS
      fetch('https://bahins-backend.onrender.com/messages', {
        headers: { 'x-admin-key': adminKey }
      })
      .then(res => {
        if (res.status === 401) throw new Error("Incorrect Secret Key!");
        if (!res.ok) throw new Error("Server Error");
        return res.json();
      })
      .then(messages => {
        const list = document.getElementById('allMessages');
        list.innerHTML = ''; 

        messages.forEach(msg => {
          const li = document.createElement('li');

          // Date Formatting
          let formattedDate = msg.created_at ? new Date(msg.created_at).toLocaleString('en-PH', { timeZone: 'Asia/Manila' }) : 'No Date';

          const messageSpan = document.createElement('span');
          messageSpan.textContent = `${formattedDate}, ${msg.name} (${msg.email}) - ${msg.reason}: ${msg.message}`;

          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Delete';
          deleteBtn.className = 'delete-btn';

          deleteBtn.addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete the message from ${msg.name}?`)) {
              // 3. SEND THE KEY FOR DELETE REQUESTS TOO
              fetch(`https://bahins-backend.onrender.com/messages/${msg._id}`, {
                method: 'DELETE',
                headers: { 'x-admin-key': adminKey }
              })
              .then(response => {
                if (response.ok) {
                  alert(`Deleted successfully.`);
                  li.remove();
                } else {
                  alert('Delete failed. Check your key.');
                }
              })
            }
          });

          li.appendChild(messageSpan);
          li.appendChild(deleteBtn);
          list.appendChild(li);
        });
      })
      .catch(error => {
        alert(error.message);
        console.error('Error:', error);
      });
    }
  

