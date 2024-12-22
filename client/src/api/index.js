const API_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL 
  : 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_URL
}); 