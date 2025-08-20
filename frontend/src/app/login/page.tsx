"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import userService from "@/services/user-service";
import { handleGoogleResponse, handleGoogleError } from "@/services/google-auth";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

interface FormData {
  email: string;
  password: string;
}

const Login: FC = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const router = useRouter();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Submit form
  const onSubmit = (data: FormData) => {
    userService
      .login(data.email, data.password)
      .request
      .then((response: { data: { accessToken: string; refreshToken: string } }) => {
        login(response.data.accessToken, response.data.refreshToken); // Store tokens and update auth state
        router.push("/"); // Redirect to main page after successful login
      })
      .catch((error: unknown) => {
        console.error(error);
        setErrorMessage("Login failed. Please check your credentials and try again.");
      });
  };

  // Google OAuth response handlers
  const googleResponseMessage = (credentialResponse: CredentialResponse) => {
    handleGoogleResponse(credentialResponse, login, setErrorMessage, (path: string) => router.push(path));
  };

  const googleErrorMessage = () => {
    handleGoogleError(setErrorMessage);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to Voltrico</h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="inputEmail" className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="inputEmail"
              placeholder="Email"
              {...register("email", { required: true })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="inputPassword" className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
              type="password"
              id="inputPassword"
              placeholder="Password"
              {...register("password", { required: true })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign in
          </button>
          <div className="flex justify-center mt-2">
            <GoogleLogin onSuccess={googleResponseMessage} onError={googleErrorMessage} />
          </div>
        </form>
        {errorMessage && (
          <div className="mt-4 text-red-600 text-center font-medium">
            {errorMessage}
          </div>
        )}
        <div className="mt-6 text-center">
          <Link href="/signup" className="text-blue-600 hover:underline">
            Don't have an account? Sign up now!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;