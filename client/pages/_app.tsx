import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId="466915149423-09pajtkfq3oh4uli261m1fi792ge6mbq.apps.googleusercontent.com">
          <Toaster />
          <Component {...pageProps} />
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </div>
  );
}
