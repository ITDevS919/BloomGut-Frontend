import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_ENDPOINT || "http://localhost:3000/api/v1";

export const createApiClient = (getToken) => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
  });

  instance.interceptors.request.use(
    async (config) => {
      if (typeof getToken === "function") {
        try {
          const template = import.meta.env.VITE_CLERK_JWT_TEMPLATE;
          const token = template
            ? await getToken({ template })
            : await getToken();

          if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          // If token retrieval fails, proceed without Authorization header
          // so that public endpoints can still be called.
        }
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  return instance;
};

