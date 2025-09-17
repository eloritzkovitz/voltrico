import { Request, Response } from "express";
import { elasticClient } from "../elastic/elasticClient.js";
import { handleError, logger } from "@eloritzkovitz/server-essentials";

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

  logger.info("Product search request", {
    query,
    category,
    priceMin,
    priceMax,
    page,
    limit,
    sortBy,
    order,
  });

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
    logger.info("Product search successful", { total: result.hits.total });
    res.json({
      total: result.hits.total,
      products: result.hits.hits.map((hit: any) => hit._source),
    });
  } catch (err) {
    handleError(res, "Product search failed", err);
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

  logger.info("Order search request", {
    status,
    customerId,
    dateFrom,
    dateTo,
    page,
    limit,
    sortBy,
    order,
  });

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
    logger.info("Order search successful", { total: result.hits.total });
    res.json({
      total: result.hits.total,
      orders: result.hits.hits.map((hit: any) => hit._source),
    });
  } catch (err) {
    handleError(res, "Order search failed", err);
  }
};

export default {
  searchProducts,
  searchOrders,
};