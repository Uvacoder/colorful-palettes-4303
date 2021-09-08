import type { NextApiRequest, NextApiResponse } from "next";

import palettes from "../../assets/palettesFormatted.json";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (typeof id === "string") {
    const palette = palettes.find(p => p.name === id)

    res.setHeader("Cache-Control", "max-age=0, s-maxage=86400");

    res.status(200).json(palette);
  } else {
    res.status(404).end();
  }
};

export default handler;
