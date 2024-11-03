// app.js
document.getElementById("submission-form").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevents page refresh
    const twitterName = document.getElementById("twitterName").value;
    const ordinalsAddress = document.getElementById("ordinalsAddress").value;
    const replyLink = document.getElementById("replyLink").value;

    // Send data to server
    const response = await fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ twitterName, ordinalsAddress, replyLink })
    });
    const result = await response.json();
    alert(result.message); // Show success or error message
});
