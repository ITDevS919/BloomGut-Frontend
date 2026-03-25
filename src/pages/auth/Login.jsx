// import { SignIn } from "@clerk/clerk-react";

// const Login = () => {
//   return (
//     <div className="flex justify-center items-center w-full">
//       <SignIn afterSignInUrl="/dashboard" />
//     </div>
//   );
// };

// export default Login;

import { useEffect, useState } from "react";
import { useAuth, useSignIn } from "@clerk/clerk-react";
// import Icon from "@/components/common/Icon";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FormInput from "@/components/common/FormInput";
import { emailValidation } from "@/utils/validators";
import Icon from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaLine } from "react-icons/fa";
import Loader from "@/components/common/Loader";

const Login = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [loading, setLoading] = useState(false);
  const [emailCodeStep, setEmailCodeStep] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [secondFactorEmailAddressId, setSecondFactorEmailAddressId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const finishSignIn = async (sessionId) => {
    await setActive({ session: sessionId });
    toast.success("Login successful!");
    navigate("/dashboard");
  };

  const onSubmit = async (data) => {
    if (!isLoaded || loading) return;
    setLoading(true);
    try {
      let res = await signIn.create({
        identifier: data.identifier,
        password: data.password,
      });

      if (res.status === "needs_first_factor") {
        res = await signIn.attemptFirstFactor({
          strategy: "password",
          password: data.password,
        });
      }

      if (res.status === "complete" && res.createdSessionId) {
        await finishSignIn(res.createdSessionId);
        return;
      }

      if (res.status === "needs_second_factor") {
        const emailCodeFactor = res.supportedSecondFactors?.find(
          (factor) => factor.strategy === "email_code",
        );

        if (emailCodeFactor?.emailAddressId) {
          await signIn.prepareSecondFactor({
            strategy: "email_code",
            emailAddressId: emailCodeFactor.emailAddressId,
          });
          setSecondFactorEmailAddressId(emailCodeFactor.emailAddressId);
          setEmailCode("");
          setEmailCodeStep(true);
          toast.success("We sent a verification code to your email.");
          return;
        }

        toast.error("This account requires another sign-in step this app does not support yet.");
        return;
      }

      toast.error("Additional sign-in steps are required. Please try again.");
    } catch (error) {
      toast.error(error?.errors?.[0]?.longMessage || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const onVerifyEmailCode = async (e) => {
    e.preventDefault();
    if (!isLoaded || loading || !emailCode.trim()) {
      if (!emailCode.trim()) toast.error("Enter the verification code from your email.");
      return;
    }
    setLoading(true);
    try {
      const res = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code: emailCode.trim(),
      });

      if (res.status === "complete" && res.createdSessionId) {
        setEmailCodeStep(false);
        setSecondFactorEmailAddressId(null);
        await finishSignIn(res.createdSessionId);
        return;
      }

      toast.error("That code is invalid or expired. Try again or request a new code.");
    } catch (error) {
      toast.error(error?.errors?.[0]?.longMessage || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const onResendEmailCode = async () => {
    if (!isLoaded || !secondFactorEmailAddressId) return;
    setLoading(true);
    try {
      await signIn.prepareSecondFactor({
        strategy: "email_code",
        emailAddressId: secondFactorEmailAddressId,
      });
      toast.success("A new code was sent to your email.");
    } catch (error) {
      toast.error(error?.errors?.[0]?.longMessage || "Could not resend code");
    } finally {
      setLoading(false);
    }
  };

  const cancelEmailCodeStep = () => {
    setEmailCodeStep(false);
    setEmailCode("");
    setSecondFactorEmailAddressId(null);
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

  useEffect(() => {
    if (isSignedIn) {
      navigate("/dashboard");
    }
  }, [isSignedIn, navigate]);

  if (!isLoaded) {
    return <Loader />;
  }

  if (emailCodeStep) {
    return (
      <main className="flex flex-col h-full p-6">
        <p className="w-full flex items-start">
          <button
            type="button"
            className="cursor-pointer bg-transparent border-0 p-0"
            onClick={cancelEmailCodeStep}
            aria-label="Back to login"
          >
            <Icon name={"ArrowLeft"} size={30} />
          </button>
          <span className="text-lg font-medium text-primary">Verify email</span>
        </p>

        <div className="mt-15">
          <p className="text-sm text-secondary mt-10 mb-4">
            Enter the verification code we sent to your email. This step is required when signing in from a new browser or
            device (Clerk Client Trust).
          </p>
          <form onSubmit={onVerifyEmailCode} className="flex flex-col gap-4">
            <Input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Verification code"
              value={emailCode}
              onChange={(e) => setEmailCode(e.target.value)}
              className="w-full"
            />
            <div className="flex flex-col gap-3 w-[60%] mx-auto">
              <Button type="submit" className="w-full rounded-md cursor-pointer" disabled={loading}>
                {loading ? "Verifying..." : "Verify and sign in"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-md cursor-pointer"
                disabled={loading}
                onClick={onResendEmailCode}
              >
                Resend code
              </Button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col h-full p-6">
      <p className="w-full flex items-start">
        <NavLink to="/home">
          <Icon name={"ArrowLeft"} size={30} />
        </NavLink>
        <span className="text-lg font-medium text-primary">Login</span>
      </p>

      {/* Form */}
      <div className="mt-15">
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
              className="text-custom-12 p-0 cursor-pointer"
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
              className="flex items-center text-primary-muted h-auto rounded-md cursor-pointer"
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
            <Button
              type="button"
              variant="outline"
              onClick={() => oauthSignIn("facebook")}
              className="flex items-center text-primary-muted h-auto rounded-md cursor-pointer"
            >
              <span className="flex justify-center">
                <FaFacebook className="size-6" size={24} color="#365999" />
              </span>
              <span className="min-w-20">Facebook</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => oauthSignIn("apple")}
              className="flex items-center text-primary-muted h-auto rounded-md cursor-pointer"
            >
              <span className="flex justify-center">
                <FaApple className="size-6" size={24} />
              </span>
              <span className="min-w-20">Apple</span>
            </Button>
          </div>

          <div className="w-[60%] mx-auto mt-3">
            <Button
              type="submit"
              className="w-full rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.08)] cursor-pointer"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <div className="mt-3">
              <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                <input type="checkbox" className="cursor-pointer" />
                Remember Me
              </label>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;
