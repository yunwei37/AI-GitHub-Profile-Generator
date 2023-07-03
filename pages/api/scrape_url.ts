import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // get username from query
    const { username } = req.query;
  
  try {
    const url = "https://plugin.wegpt.ai/scrape_url";
    const data = {
      url: `https://github.com/${username}`
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
    const r = await response.json();
    
    res.status(200).json(r);
  } catch (error: any) {
    res.status(404).json({ error: 'Unexpected error.' + error.message });
  }
}
