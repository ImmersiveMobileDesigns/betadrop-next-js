const https = require('https');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.error('No API key found.');
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
                console.error('API Error:', parsed.error.message);
            } else {
                console.log('Available Models:');
                parsed.models.forEach(m => {
                    if (m.supportedGenerationMethods.includes('generateContent')) {
                        console.log(`- ${m.name.replace('models/', '')}`);
                    }
                });
            }
        } catch (e) {
            console.error('Error parsing response:', e);
        }
    });

}).on('error', (err) => {
    console.error('Request error:', err);
});
