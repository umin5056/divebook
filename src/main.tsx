import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as KonstaApp } from "konsta/react";
import "./index.css";
import App from "./App.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <KonstaApp theme="ios">
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </KonstaApp>,
);
