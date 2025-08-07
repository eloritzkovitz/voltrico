import { Request, Response } from "express";
import { elasticClient } from "../elastic/elasticClient";

export const searchProducts = async (req: Request, res: Response) => {
  const { query, category } = req.query;
  const must: any[] = [];
  if (query) must.push({ match: { name: query } });
  if (category) must.push({ term: { category } });

  try {
    const result = await elasticClient.search({
      index: "products",
      query: { bool: { must } },
    });
    res.json(result.hits.hits.map((hit: any) => hit._source));
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};