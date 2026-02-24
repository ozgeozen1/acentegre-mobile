import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToursListScreen } from "./src/screens/ToursListScreen";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToursListScreen />
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
