import type { Metadata } from "next";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Voltrico",
  icons: {
    icon: "/favicon.ico",
  },
  description: "A microservices-based e-commerce platform",
};

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  if (!googleClientId) {
    console.error("Google Client ID is not defined. Please check your .env file.");
  }

  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider>
            <CartProvider>
              <div className="app-container">
                <Navbar />
                <main className="page-content bg-white">{children}</main>
                <Footer />
              </div>
            </CartProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
