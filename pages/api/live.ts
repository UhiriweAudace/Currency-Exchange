import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;
  if (method !== 'POST') return res.status(405).send(`Method ${method} not allowed`);

  try {
    const apiKey = process.env.COINLAYER_API_KEY;
    const url = `http://api.coinlayer.com/live?access_key=${apiKey}&target=${body?.target}`;

    const response = await axios.get(url);
    console.log('RESPONSE LIVE DATA\n', response.data);
    res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).send('Something Went Wrong');
  }
}
