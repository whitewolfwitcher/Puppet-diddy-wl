const { google } = require('googleapis');

async function appendToSheet(ordinalsAddress, status) {
    try {
        // Parse credentials from environment variables
        const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        console.log("Credentials parsed successfully.");

        // Initialize Google authentication
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: credentials.client_email,
                private_key: credentials.private_key,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });
        console.log("Google Sheets client initialized.");

        const request = {
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: 'diddy',
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
