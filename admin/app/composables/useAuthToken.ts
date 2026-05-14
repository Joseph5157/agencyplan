const TOKEN_KEY = "school_platform_admin_token";

export function useAuthToken() {
  const token = useState<string | null>("admin-token", () => null);

  const loadToken = () => {
    if (!import.meta.client) return;
    token.value = localStorage.getItem(TOKEN_KEY);
  };

  const setToken = (value: string) => {
    token.value = value;
    if (import.meta.client) {
      localStorage.setItem(TOKEN_KEY, value);
    }
  };

  const clearToken = () => {
    token.value = null;
    if (import.meta.client) {
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  return {
    token,
    loadToken,
    setToken,
    clearToken,
  };
}

