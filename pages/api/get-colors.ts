import type { NextApiRequest, NextApiResponse } from "next";

import palettes from "../../assets/palettes.json";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (typeof id === "string") {
    const colors = palettes[id];
    res.setHeader("Cache-Control", "max-age=0, s-maxage=86400");
    res.status(200).json({ colors });
  } else {
    res.status(404).end();
  }
};

export default handler;
