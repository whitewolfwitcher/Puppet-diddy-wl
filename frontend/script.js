document.getElementById("submission-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const ordinalsAddress = document.getElementById("ordinalsAddress").value;

    if (!ordinalsAddress) {
        alert("Please enter your ordinals address.");
        return;
    }

    try {
        // Use the full deployment URL for the API endpoint
        const response = await fetch('https://puppet-diddy-4ifggwlu5-witchers-projects-89d7c206.vercel.app/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ordinalsAddress })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);

            // Check if there's a redirect URL and open it
            if (result.redirectUrl) {
                window.open(result.redirectUrl, "_blank");
            }
        } else {
            console.error("Error:", result.message);
            alert("Error submitting data: " + result.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to submit the address. Please try again.");
    }
});
