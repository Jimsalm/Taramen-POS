import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "sonner";
import { ConfirmationDialog } from "./shared/helpers/confirmAction.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Toaster position='top-center' richColors />
				<App />
				<ConfirmationDialog />
				<ReactQueryDevtools initialIsOpen={false} />
			</BrowserRouter>
		</QueryClientProvider>
	</StrictMode>
);
