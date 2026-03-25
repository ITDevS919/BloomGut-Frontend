import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { Provider } from "react-redux";
import { store } from "./store";
import { ApiClientProvider } from "./context/ApiClientProvider.jsx";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim();
if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={publishableKey}>
      <ApiClientProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </ApiClientProvider>
    </ClerkProvider>
  </StrictMode>
);
