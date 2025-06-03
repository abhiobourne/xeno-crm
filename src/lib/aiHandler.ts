import { GoogleGenerativeAI } from '@google/generative-ai';
import { EventEmitter } from 'events';

const emitter = new EventEmitter();
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;

if (!apiKey) throw new Error('Google Gemini API key is missing. Make sure to add NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY to your .env.local file');

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

export async function generateMessageSuggestions(objective: string, targetAudience?: string): Promise<string[]> {
  try {
    const prompt = `Generate 3 engaging marketing message variants for the following campaign:
    
Objective: ${objective}
${targetAudience ? `Target Audience: ${targetAudience}` : ''}

Please provide 3 distinct message variants that are concise, persuasive, and aligned with the campaign objective. Each message should be on a new line starting with a number.`;

    const result = await generateText(prompt);
    
    // Split the response into individual messages and clean them up
    const messages = result
      .split('\n')
      .filter(line => /^\d/.test(line.trim())) // Only keep lines starting with numbers
      .map(line => line.replace(/^\d[\.\)]\s*/, '').trim()) // Remove the numbering
      .filter(Boolean);

    return messages.slice(0, 3); // Ensure we only return max 3 messages
  } catch (err) {
    emitter.emit('ai:error', err);
    throw new Error('Failed to generate message suggestions');
  }
}

export async function autoCategorizeCampaign(messageContent: string, audienceDescription: string): Promise<string[]> {
  try {
    const prompt = `Analyze this marketing campaign and provide up to 3 relevant category tags. Consider both the message content and target audience.

Message Content: ${messageContent}
Target Audience: ${audienceDescription}

Provide only the tags, each on a new line. Choose from these categories:
- Win-back
- High Value Customers
- New Customer Acquisition
- Retention
- Promotional
- Seasonal
- Product Launch
- Customer Feedback
- Loyalty Program
- Educational
- Brand Awareness`;

    const result = await generateText(prompt);
    
    // Split the response into individual tags and clean them up
    const tags = result
      .split('\n')
      .map(tag => tag.replace(/^[-•]\s*/, '').trim())
      .filter(Boolean);

    return tags.slice(0, 3); // Ensure we only return max 3 tags
  } catch (err) {
    emitter.emit('ai:error', err);
    throw new Error('Failed to auto-categorize campaign');
  }
}

export default emitter;
