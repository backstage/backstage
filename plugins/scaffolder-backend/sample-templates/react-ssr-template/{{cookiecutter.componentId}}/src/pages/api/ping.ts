import { NextApiRequest, NextApiResponse } from 'next';

export default function handle(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).send('ok');
}
