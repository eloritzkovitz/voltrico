import axios, { CanceledError } from "axios";

export { CanceledError };

const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
const apiClient = axios.create({
    baseURL: `${backend_url}/api`,
});

export default apiClient;