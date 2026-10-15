const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 3000;
const ZHIPU_KEY = process.env.ZHIPU_KEY || '6a46ed71bbd3428ebc1aa4bba5e5573d.npXa-X_SHXjQrUPUMD5trJpi';

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Max AI Backend is running! 🤖' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }

    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + ZHIPU_KEY
      },
      body: JSON.stringify({
        model: model || 'glm-4-flash',
        messages: messages,
        temperature: 0.8,
        max_tokens: 800,
        stream: false
      })
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Max AI Backend running on port ${PORT}`);
});