"use client";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { handleGoogleResponse, handleGoogleError } from "@/services/google-auth";
import userService from "@/services/user-service";
import { User } from "@/types/user";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const Signup: FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  // Submit form
  const onSubmit = (data: FormData) => {
    const user: User = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      joinDate: new Date().toISOString(),
      phone: "",
      address: "",
    };

    const { request } = userService.register(user);
    request
      .then(() => {
        setResultMessage("Registration successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      })
      .catch((error: any) => {
        console.error(error);
        setErrorMessage("Registration failed. Please try again.");
      });
  };

  // Google OAuth response handlers
  const googleResponseMessage = (credentialResponse: CredentialResponse) => {
    handleGoogleResponse(credentialResponse, () => {}, setErrorMessage, (path: string) => router.push(path));
  };

  const googleErrorMessage = () => {
    handleGoogleError(setErrorMessage);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Register to Voltrico</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Register to join Voltrico
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                id="inputFirstName"
                placeholder="First Name"
                {...register("firstName", { required: "First name is required." })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.firstName && (
                <span className="text-red-600 text-sm">{errors.firstName.message}</span>
              )}
            </div>
            <div className="flex-1">
              <input
                type="text"
                id="inputLastName"
                placeholder="Last Name"
                {...register("lastName", { required: "Last name is required." })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.lastName && (
                <span className="text-red-600 text-sm">{errors.lastName.message}</span>
              )}
            </div>
          </div>
          <div>
            <input
              type="email"
              id="inputEmailAddress"
              placeholder="Email"
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address. Please enter a valid email address.",
                },
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && (
              <span className="text-red-600 text-sm">{errors.email.message}</span>
            )}
          </div>
          <div>
            <input
              type="password"
              id="inputPassword"
              placeholder="Password"
              {...register("password", {
                required: "Password is required.",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long.",
                },
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.password && (
              <span className="text-red-600 text-sm">{errors.password.message}</span>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors mt-2"
          >
            Register
          </button>
          <div className="flex justify-center mt-2">
            <GoogleLogin onSuccess={googleResponseMessage} onError={googleErrorMessage} />
          </div>
        </form>
        {resultMessage && (
          <div className="mt-4 text-green-600 text-center font-medium">
            {resultMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mt-4 text-red-600 text-center font-medium">
            {errorMessage}
          </div>
        )}
        <div className="mt-6 text-center">
          <Link href="/login" className="text-blue-600 hover:underline">
            Already have an account? Login here!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;