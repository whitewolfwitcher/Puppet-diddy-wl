const { google } = require('googleapis');

// Function to append data to Google Sheets
async function appendToSheet(ordinalsAddress, status) {
    try {
        // Parse credentials from environment variables
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        console.log("Parsed credentials successfully.");

        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });
        console.log("Initialized Google Sheets client.");

        const request = {
            spreadsheetId: process.env.SPREADSHEET_ID, // Use environment variable for Spreadsheet ID
            range: 'diddy', // Sheet name or range
            valueInputOption: 'RAW',
            resource: {
                values: [[ordinalsAddress, status]]
            }
        };

        const response = await sheets.spreadsheets.values.append(request);
        console.log("Data appended successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error in appendToSheet:", error.message);
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

            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `🚀 Diddylist Alert!\n\nJoining the DiddyPuppets whitelist 🐶✨\n\nHere’s my address: ${ordinalsAddress}\n\nGet in on the action and apply here: ord.io/...`
            )}`;
            res.json({ message: "Submission successfully recorded!", redirectUrl: twitterUrl });

        } catch (error) {
            console.error("Error recording submission:", error.message);
            res.status(500).json({ message: "Error recording submission. Please try again later." });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
};
