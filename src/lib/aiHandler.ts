import { GoogleGenerativeAI } from '@google/generative-ai';
import { EventEmitter } from 'events';

const emitter = new EventEmitter();
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) throw new Error('Google Gemini API key is missing');

const genAI = new GoogleGenerativeAI(apiKey);
// @ts-expect-error apiVersion missing in types
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', apiVersion: 'v1' });

export async function generateText(prompt: string) {
  try {
    emitter.emit('ai:prompt', prompt);

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    emitter.emit('ai:success', text);
    return text || '';
  } catch (err) {
    emitter.emit('ai:error', err);
    throw new Error('AI generation failed');
  }
}

export default emitter;
