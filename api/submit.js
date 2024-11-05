const { google } = require('googleapis');

// Function to append data to Google Sheets
async function appendToSheet(ordinalsAddress, status) {
    try {
        // Parse credentials from environment variables
        const credentials = {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') // Correct newline formatting
        };
        console.log("Credentials parsed successfully.");

        const auth = new google.auth.JWT(
            credentials.client_email,
            null,
            credentials.private_key,
            ['https://www.googleapis.com/auth/spreadsheets']
        );

        const sheets = google.sheets({ version: 'v4', auth });
        console.log("Google Sheets client initialized.");

        const request = {
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: 'diddy', // Adjust this to your sheet's range or name
            valueInputOption: 'RAW',
            resource: {
                values: [[ordinalsAddress, status]],
            },
        };

        const response = await sheets.spreadsheets.values.append(request);
        console.log("Data appended successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error appending to Google Sheet:", error);
        throw error;
    }
}

module.exports = async (req, res) => {
    console.log("API /submit endpoint hit");

    if (req.method === 'POST') {
        const { ordinalsAddress } = req.body;
        console.log("Received ordinalsAddress:", ordinalsAddress);

        if (!ordinalsAddress) {
            console.log("No ordinals address provided");
            return res.status(400).json({ message: "Ordinals address is required." });
        }

        try {
            const status = 'False';
            console.log("Calling appendToSheet...");
            await appendToSheet(ordinalsAddress, status);
            console.log("appendToSheet call successful");

            // Send success message and Twitter redirect URL back to the frontend
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `🚀 Diddylist Alert!\n\nJoining the DiddyPuppets whitelist 🐶✨\n\nHere’s my address: ${ordinalsAddress}\n\nGet in on the action and apply here: ord.io/...`
            )}`;
            res.json({ message: "Submission successfully recorded!", redirectUrl: twitterUrl });
        } catch (error) {
            console.error("Error recording submission:", error);
            res.status(500).json({ message: "Error recording submission. Please try again later." });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
};
