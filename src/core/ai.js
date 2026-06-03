// src/core/ai.js
require('dotenv').config();

const apiKey = process.env.AI_API_KEY;

async function reviewCode(code) {
    // TODO: Implement the actual API call to the AI model
    console.log('Sending code to AI for review...');
    console.log(code);

    // Placeholder response
    return `This is a review for the following code:

${code}`;
}

module.exports = {
    reviewCode,
};
