const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/generate', async (req, res) => {
  const { company, experience, goals, audience, reason, results } = req.body;

  const prompt = `
You are a professional copywriter tasked with crafting a polished, well-written testimonial for a satisfied client of The Business Journals.

Using the following rough notes and key points, rewrite them into a flowing testimonial that sounds authentic, positive, and professional. Use full sentences, excellent grammar, and a cohesive narrative — not a list of inputs. Avoid simply repeating the phrasing.

Client Input:
- Company: ${company}
- Experience: ${experience}
- Goals: ${goals}
- Audience: ${audience}
- Reason for recommending: ${reason}
- Results: ${results}

Testimonial:
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    const testimonial = completion.choices[0].message.content.trim();
    res.json({ testimonial });
  } catch (error) {
    console.error('Error generating testimonial:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate testimonial.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
