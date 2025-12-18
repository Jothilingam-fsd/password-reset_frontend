const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

if (!API_BASE_URL) {
  throw new Error(
    "REACT_APP_BACKEND_URL is not defined. Please set it in environment variables."
  );
}

export default API_BASE_URL;
