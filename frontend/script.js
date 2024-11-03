document.getElementById("submission-form").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    const ordinalsAddress = document.getElementById("ordinalsAddress").value;

    if (!ordinalsAddress) {
        alert("Please enter your ordinals address.");
        return;
    }

    try {
        // Send the data to the backend
        const response = await fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ordinalsAddress })
        });

        const result = await response.json();

        if (response.ok) {
            // Show success message
            alert(result.message);

            // Define the tweet content
            const tweetText = encodeURIComponent(
                `🚀 Diddylist Alert!\n\nJoining the DiddyPuppets whitelist 🐶✨\n\nHere’s my address: ${ordinalsAddress}\n\nGet in on the action and apply here: ord.io/......`
            );

            // Open Twitter post link with pre-filled tweet
            const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
            window.open(twitterUrl, "_blank"); // Open Twitter in a new tab
        } else {
            console.error("Error:", result.message);
            alert("Error submitting data: " + result.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to submit the address. Please try again.");
    }
});
