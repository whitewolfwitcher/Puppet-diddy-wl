document.getElementById("submission-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const ordinalsAddress = document.getElementById("ordinalsAddress").value;

    if (!ordinalsAddress) {
        alert("Please enter your ordinals address.");
        return;
    }

    try {
        const response = await fetch('/api/submit', {  // This will automatically use the deployed Vercel URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ordinalsAddress })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);

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
