
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/generate', async (req, res) => {
  const { company, benefit1, benefit2, benefit3 } = req.body;

  const prompt = `
    Please write a grammatically correct and professionally worded client testimonial based on the following:
    - Company: ${company}
    - Positive Results: ${benefit1}
    - Most Valuable Experience: ${benefit2}
    - Recommendation Reason: ${benefit3}

    The testimonial should flow smoothly, sound authentic, and include all points naturally.
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 200,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.text?.trim() || 'Error: No response from AI';

    res.json({ testimonial: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to contact OpenAI' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
