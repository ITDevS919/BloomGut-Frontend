// import { SignIn } from "@clerk/clerk-react";

// const Login = () => {
//   return (
//     <div className="flex justify-center items-center w-full">
//       <SignIn afterSignInUrl="/dashboard" />
//     </div>
//   );
// };

// export default Login;

import { useState } from "react";
import { useSignIn, useUser } from "@clerk/clerk-react";
// import Icon from "@/components/common/Icon";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FormInput from "@/components/common/FormInput";
import { emailValidation } from "@/utils/validators";
import Icon from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaLine } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    console.log(data);
    try {
      const res = await signIn.create({
        identifier: data.identifier,
        password: data.password,
      });
      
      console.log("Sign-in result:", res);
      console.log("User after login:", user); // may still be null here (see below)
      navigate("/dashboard");
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error?.errors?.[0]?.longMessage || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const oauthSignIn = (provider) => {
    signIn.authenticateWithRedirect({
      strategy: `oauth_${provider}`,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/dashboard",
    });
  };

  // const handleForgotPassword = async (email) => {
  //   try {
  //     await resetPassword({ identifier: email });
  //     toast.success("Password reset link sent to your email!");
  //     setForgotPasswordMode(false); // Close the forgot password form
  //   } catch (error) {
  //     toast.error(error?.message || "Error sending reset link.");
  //   }
  // };

  if (!isLoaded) {
    return <div className="flex justify-center items-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full p-6">
      <p className="w-full flex items-start">
        <NavLink to="/home">
          <Icon name={"ArrowLeft"} size={30} />
        </NavLink>
        <span className="text-lg font-medium text-primary">Login</span>
      </p>

      {/* Form */}
      <div className="my-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-10">
          <FormInput
            placeholder="Email"
            name="identifier"
            register={register}
            rules={emailValidation}
            error={errors.identifier}
          />

          <FormInput
            type="password"
            placeholder="Password"
            name="password"
            register={register}
            error={errors.password}
          />

          <div className="text-right text-xs">
            <Button
              variant="ghost"
              type="button"
              className="text-custom-12 p-0"
              onClick={() => navigate("/auth/forgot-password")}
            >
              Forgot Password?
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* OAuth Buttons */}
          {/* <div className="flex flex-col gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => oauthSignIn("google")}
              className="flex gap-3 justify-center text-primary-muted"
            >
              <FcGoogle className="size-6" size={24} />
              Google
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => oauthSignIn("line")}
              className="flex gap-3 justify-center text-primary-muted"
            >
              <FaLine className="size-6" size={24} />
              Line
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => oauthSignIn("facebook")}
              className="flex gap-3 justify-center text-primary-muted"
            >
              <FaFacebook className="size-6" size={24} />
              Facebook
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => oauthSignIn("apple")}
              className="flex gap-3 justify-center text-primary-muted"
            >
              <FaApple className="size-6" size={24} />
              Apple
            </Button>
          </div> */}
          <div className="flex flex-col gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => oauthSignIn("google")}
              className="flex items-center text-primary-muted h-auto"
            >
              <span className="flex justify-center">
                <FcGoogle className="size-6" size={24} />
              </span>
              <span className="min-w-20">Google</span>
            </Button>
            {/* <Button
              type="button"
              variant="outline"
              onClick={() => oauthSignIn("line")}
              className="flex items-center text-primary-muted h-auto"
            >
              <span className="flex justify-center">
                <FaLine className="size-6" size={24} />
              </span>
              <span className="min-w-20">Line</span>
            </Button> */}
            {/* <Button
              type="button"
              variant="outline"
              onClick={() => oauthSignIn("facebook")}
              className="flex items-center text-primary-muted h-auto"
            >
              <span className="flex justify-center">
                <FaFacebook className="size-6" size={24} />
              </span>
              <span className="min-w-20">Facebook</span>
            </Button> */}
            <Button
              type="button"
              variant="outline"
              onClick={() => oauthSignIn("apple")}
              className="flex items-center text-primary-muted h-auto"
            >
              <span className="flex justify-center">
                <FaApple className="size-6" size={24} />
              </span>
              <span className="min-w-20">Apple</span>
            </Button>
          </div>

          <Button type="submit" className="w-[60%] mx-auto mt-3">
            {loading ? "Logging in..." : "Login"}
          </Button>

          <label className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <input type="checkbox" />
            Remember Me
          </label>
        </form>
      </div>
    </div>
  );
};

export default Login;
