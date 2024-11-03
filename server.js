// api/index.js
const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const app = express();

// Use environment variables for credentials and spreadsheet ID
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

app.use(bodyParser.json());
app.use(express.static('frontend'));

// Function to append data to Google Sheets
async function appendToSheet(ordinalsAddress, status) {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        const request = {
            spreadsheetId: process.env.SPREADSHEET_ID, // Use environment variable
            range: 'diddy',
            valueInputOption: 'RAW',
            resource: {
                values: [[ordinalsAddress, status]]
            }
        };

        const response = await sheets.spreadsheets.values.append(request);
        console.log("Data appended successfully:", response.data);
    } catch (error) {
        console.error("Error appending to Google Sheet:", error);
        throw error;
    }
}

// Endpoint to handle form submissions
app.post('/submit', async (req, res) => {
    const { ordinalsAddress } = req.body;

    if (!ordinalsAddress) {
        return res.status(400).json({ message: "Ordinals address is required." });
    }

    try {
        const status = 'False';
        await appendToSheet(ordinalsAddress, status);

        res.json({ message: "Submission successfully recorded!" });

        // Redirect to Twitter post page
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `🚀 Diddylist Alert!\n\nJoining the DiddyPuppets whitelist 🐶✨\n\nHere’s my address: ${ordinalsAddress}\n\nGet in on the action and apply here: ord.io/...`
        )}`;
        res.redirect(twitterUrl);

    } catch (error) {
        console.error("Error recording submission:", error);
        res.status(500).json({ message: "Error recording submission. Please try again later." });
    }
});

module.exports = app;
