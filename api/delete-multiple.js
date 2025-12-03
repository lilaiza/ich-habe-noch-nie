import { createClient } from '@vercel/kv';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const kv = createClient({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });

    // Get indices from body
    const { indices } = req.body;
    
    if (!indices || !Array.isArray(indices) || indices.length === 0) {
      return res.status(400).json({ error: 'Invalid indices' });
    }

    let questions = await kv.get('questions') || [];
    
    // Sort indices in descending order to delete from end first
    const sortedIndices = [...indices].sort((a, b) => b - a);
    
    for (const index of sortedIndices) {
      if (index >= 0 && index < questions.length) {
        questions.splice(index, 1);
      }
    }
    
    await kv.set('questions', questions);
    
    return res.status(200).json({ success: true, deleted: indices.length });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to delete questions' });
  }
}
