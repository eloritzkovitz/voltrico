import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { CredentialResponse } from "@react-oauth/google";
import { handleGoogleAuth } from "@/services/google-auth";

// Custom hook for Google authentication
export function useGoogleAuth() {
  const router = useRouter();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle Google login
  const handleGoogle = (credentialResponse?: CredentialResponse) => {
    handleGoogleAuth({
      credentialResponse,
      login,
      setErrorMessage,
      navigate: (path: string) => router.push(path),
    });
  };

  return { handleGoogle, errorMessage, setErrorMessage };
}