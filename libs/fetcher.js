import { request } from 'graphql-request';
const API_ENDPOINT = process.env.NEXT_PUBLIC_GQL_URI_PROD;
const fetcher = (query) => request(API_ENDPOINT, query);
export default fetcher;
