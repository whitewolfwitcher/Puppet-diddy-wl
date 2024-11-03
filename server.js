const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const app = express();

// Import the credentials JSON file (replace with the actual path to your file)
const credentials = require('./credentials.json');

app.use(bodyParser.json());
app.use(express.static('frontend')); // Serve HTML files from frontend folder

// Function to append data to Google Sheets
async function appendToSheet(ordinalsAddress, status) {
    try {
        // Authenticate with Google Sheets API
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        // Google Sheet information, only using the sheet name
        const request = {
            spreadsheetId: '1C9szROweEiJRXLAh6mYH6VL8Eq0UR32xH4dCIlN6woI', // Spreadsheet ID
            range: 'diddy', // Only specify the sheet name without cell range
            valueInputOption: 'RAW',
            resource: {
                values: [[ordinalsAddress, "False"]]
            }
        };

        // Append data to Google Sheet
        const response = await sheets.spreadsheets.values.append(request);
        console.log("Data appended successfully:", response.data);
    } catch (error) {
        console.error("Error appending to Google Sheet:", error);
        throw error; // Re-throw to handle it in the calling function
    }
}

// Endpoint to handle form submissions
app.post('/submit', async (req, res) => {
    const { ordinalsAddress } = req.body;

    // Validate the input
    if (!ordinalsAddress) {
        return res.status(400).json({ message: "Ordinals address is required." });
    }

    try {
        // Set the status to 'False' initially; you can add logic to update it later if needed
        const status = 'False';

        // Append data to Google Sheets
        await appendToSheet(ordinalsAddress, status);

        // Send success response
        res.json({ message: "Submission successfully recorded!" });
    } catch (error) {
        console.error("Error recording submission:", error);
        res.status(500).json({ message: "Error recording submission. Please try again later." });
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
