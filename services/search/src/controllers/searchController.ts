import { Request, Response } from "express";
import { elasticClient } from "../elastic/elasticClient";

// Search products
const searchProducts = async (req: Request, res: Response) => {
  const { query, category, priceMin, priceMax, page = 1, limit = 10, sortBy = "name", order = "asc" } = req.query;
  const must: any[] = [];
  const filter: any[] = [];

  if (query) must.push({ match: { name: query } });
  if (category) filter.push({ term: { category } });
  if (priceMin || priceMax) {
    const range: any = {};
    if (priceMin) range.gte = Number(priceMin);
    if (priceMax) range.lte = Number(priceMax);
    filter.push({ range: { price: range } });
  }

  try {
    const result = await elasticClient.search({
      index: "products",
      from: (Number(page) - 1) * Number(limit),
      size: Number(limit),
      sort: [{ [sortBy as string]: { order: order === "desc" ? "desc" : "asc" } }],
      query: {
        bool: {
          must,
          filter,
        },
      },
    });
    res.json({
      total: result.hits.total,
      products: result.hits.hits.map((hit: any) => hit._source),
    });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Search orders
export const searchOrders = async (req: Request, res: Response) => {
  const { status, customerId, dateFrom, dateTo, page = 1, limit = 10, sortBy = "date", order = "desc" } = req.query;
  const must: any[] = [];
  const filter: any[] = [];

  if (status) filter.push({ term: { status } });
  if (customerId) filter.push({ term: { customerId } });
  if (dateFrom || dateTo) {
    const range: any = {};
    if (dateFrom) range.gte = dateFrom;
    if (dateTo) range.lte = dateTo;
    filter.push({ range: { date: range } });
  }

  try {
    const result = await elasticClient.search({
      index: "orders",
      from: (Number(page) - 1) * Number(limit),
      size: Number(limit),
      sort: [{ [sortBy as string]: { order: order === "asc" ? "asc" : "desc" } }],
      query: {
        bool: {
          must,
          filter,
        },
      },
    });
    res.json({
      total: result.hits.total,
      orders: result.hits.hits.map((hit: any) => hit._source),
    });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export default {
  searchProducts,
  searchOrders,
};