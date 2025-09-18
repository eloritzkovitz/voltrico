import { Client } from '@elastic/elasticsearch';

export const elasticClient = new Client({ node: process.env.ELASTIC_URL || 'http://elasticsearch:9200' });