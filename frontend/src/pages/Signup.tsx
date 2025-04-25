import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import userService, { User } from "../services/user-service";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { handleGoogleResponse, handleGoogleError } from "../services/google-auth";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;  
}

const Signup: FC = () => {
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Submit form
  const onSubmit = (data: FormData) => {
    const user: User = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      address: data.address,      
    };
    const { request: registerRequest } = userService.register(user);
    registerRequest
      .then(() => {
        navigate("/login"); // Redirect to login page after successful registration
      })
      .catch((error) => {
        console.error(error);
        setResultMessage("Registration failed. Please try again.");
      });
  };

  // Google OAuth response handlers
  const googleResponseMessage = (credentialResponse: CredentialResponse) => {
    handleGoogleResponse(credentialResponse, login, setErrorMessage, navigate);
  };

  const googleErrorMessage = () => {
    handleGoogleError(setErrorMessage);
  };

  return (
    <div className="container-fluid min-vh-100">
      <div style={{ textAlign: "center" }}>
        <h1>Register to AREA</h1>
        <div className="card panel-form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row" style={{ marginTop: "20px" }}>
              <label>Register to join AREA</label>
              <div className="form-group col-md-6" style={{ marginTop: "20px" }}>
                <input
                  type="text"
                  className="form-control"
                  id="inputFirstName"
                  placeholder="First Name"
                  {...register("firstName", { required: "First name is required." })}
                />
                {errors.firstName && <span className="text-danger">{errors.firstName.message}</span>}
              </div>
              <div className="form-group col-md-6">
                <input
                  type="text"
                  className="form-control"
                  id="inputLastName"
                  placeholder="Last Name"
                  {...register("lastName", { required: "Last name is required." })}
                />
                {errors.lastName && <span className="text-danger">{errors.lastName.message}</span>}
              </div>
            </div>
            <div className="form-group" style={{ marginTop: "20px" }}>
              <input
                type="email"
                className="form-control"
                id="inputEmailAddress"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required.",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email address.",
                  },
                })}
              />
              {errors.email && <span className="text-danger">{errors.email.message}</span>}
            </div>
            <div className="form-group" style={{ marginTop: "20px" }}>
              <input
                type="password"
                className="form-control"
                id="inputPassword"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required.",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long.",
                  },
                })}
              />
              {errors.password && <span className="text-danger">{errors.password.message}</span>}
            </div>
            <div className="form-group" style={{ marginTop: "20px" }}>
              <input
                type="text"
                className="form-control"
                id="inputPhone"
                placeholder="Phone Number"
                {...register("phone")}
              />
            </div>
            <div className="form-group" style={{ marginTop: "20px" }}>
              <input
                type="text"
                className="form-control"
                id="inputAddress"
                placeholder="Address"
                {...register("address")}
              />
            </div>            
            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: "20px", marginBottom: "20px" }}
            >
              Register
            </button>
            <GoogleLogin onSuccess={googleResponseMessage} onError={googleErrorMessage} />
          </form>
          {resultMessage && (
            <div className="alert alert-danger" style={{ marginTop: "20px" }}>
              {resultMessage}
            </div>
          )}
        </div>
        <a href="/login">Already have an account? Login here!</a>
      </div>
    </div>
  );
};

export default Signup;