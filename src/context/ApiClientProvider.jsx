import { useAuth } from "@clerk/clerk-react";
import { createContext, useContext, useMemo } from "react";
import { createApiClient } from "@/lib/apiClient";

const ApiClientContext = createContext(null);

export function ApiClientProvider({ children }) {
  const { getToken } = useAuth();
  const client = useMemo(() => createApiClient(getToken), [getToken]);

  return (
    <ApiClientContext.Provider value={client}>{children}</ApiClientContext.Provider>
  );
}

export function useApiClient() {
  const client = useContext(ApiClientContext);
  if (!client) {
    throw new Error("useApiClient must be used within ApiClientProvider");
  }
  return client;
}
