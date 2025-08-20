import React from "react";
import Link from "next/link";
import "../styles/NotFoundPage.css";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <p className="text-lg text-gray-700 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        href="/"
        className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;