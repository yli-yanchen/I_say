import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { OPENAI_API_KEY } = process.env;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

app.post('/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt }: { prompt: string } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo', // 你可以换成 "gpt-4" 如果你有访问权限
        messages: [{ role: 'user', content: prompt }], // OpenAI 需要 messages 数组
        temperature: 0.7, // 控制生成文本的随机性
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json({ text: response.data.choices[0].message.content });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        'API request error:',
        error.response?.data || error.message
      );
      res
        .status(error.response?.status || 500)
        .json({ error: error.response?.data || error.message });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
