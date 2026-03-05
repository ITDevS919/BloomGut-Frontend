import { useAuth } from "@clerk/clerk-react";
import { useMemo } from "react";
import { createApiClient } from "@/lib/apiClient";

const useApiClient = () => {
  const { getToken } = useAuth();

  const api = useMemo(() => createApiClient(getToken), [getToken]);

  return api;
};

export default useApiClient;

