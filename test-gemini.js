require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  try {
    const chat = model.startChat({
      history: [{ role: 'model', parts: [{ text: 'Hello' }] }]
    });
    await chat.sendMessage('Hi');
    console.log('Success');
  } catch (err) {
    console.error('Error:', err.message);
  }
}
test();
