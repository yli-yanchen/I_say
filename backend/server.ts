import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { DEEPSEEK_API_KEY } = process.env;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

app.post('/generate', async (req: Request, res: Response) => {
  try {
    const { prompt }: { prompt: string } = req.body;

    const response = await axios.post(DEEPSEEK_API_URL, {
      prompt,
      api_key: DEEPSEEK_API_KEY,
    });

    res.json({ text: response.data.output });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error generating text:', error.message);
      res.status(500).json({ error: error.message });
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
