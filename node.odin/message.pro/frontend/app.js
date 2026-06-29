async function sendMessage() {
    const receiverId = document.getElementById("receiverId").value;
    const content = document.getElementById("message").value;

    await fetch("/messages/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            receiverId: parseInt(receiverId),
            content
        })
    });

    alert("Message sent!");
}

async function loadChat(otherUserId) {
    const res = await fetch(`http://localhost:3000/messages/${otherUserId}`);
    const data = await res.json();

    const chatDiv = document.getElementById("chat");
    chatDiv.innerHTML = "";

    data.forEach(msg => {
        chatDiv.innerHTML += `
            <p><b>${msg.sender_id}</b>: ${msg.content}</p>
        `;
    });
}