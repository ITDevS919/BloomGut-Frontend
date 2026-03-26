import { useEffect, useState } from "react";
import { useAuth, useSignIn } from "@clerk/clerk-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FormInput from "@/components/common/FormInput";
import { emailValidation } from "@/utils/validators";
import Icon from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";
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

  const resetSecondFactorState = () => {
    setEmailCodeStep(false);
    setEmailCode("");
    setSecondFactorEmailAddressId(null);
  };

  const finishSignIn = async (sessionId) => {
    await setActive({ session: sessionId });
    resetSecondFactorState();
    toast.success("Login successful!");
    navigate("/dashboard");
  };

  const logClerkStatus = (label, res) => {
    console.log(label, {
      status: res?.status,
      supportedFirstFactors: res?.supportedFirstFactors,
      supportedSecondFactors: res?.supportedSecondFactors,
      firstFactorVerification: res?.firstFactorVerification,
      secondFactorVerification: res?.secondFactorVerification,
    });
  };

  const handleNeedsSecondFactor = async (res) => {
    const emailCodeFactor = res?.supportedSecondFactors?.find(
      (factor) => factor.strategy === "email_code"
    );

    if (!emailCodeFactor?.emailAddressId) {
      toast.error("This account requires a second-factor method this page does not support yet.");
      return;
    }

    await signIn.prepareSecondFactor({
      strategy: "email_code",
      emailAddressId: emailCodeFactor.emailAddressId,
    });

    setSecondFactorEmailAddressId(emailCodeFactor.emailAddressId);
    setEmailCode("");
    setEmailCodeStep(true);
    toast.success("We sent a verification code to your email.");
  };

  const handleSignInResult = async (res) => {
    logClerkStatus("handleSignInResult", res);

    if (res?.status === "complete" && res?.createdSessionId) {
      await finishSignIn(res.createdSessionId);
      return true;
    }

    if (res?.status === "needs_second_factor") {
      await handleNeedsSecondFactor(res);
      return true;
    }

    if (res?.status === "needs_first_factor") {
      toast.error("The first sign-in factor is still required. Please try again.");
      return true;
    }

    if (res?.status === "abandoned") {
      toast.error("The sign-in attempt was abandoned. Please try again.");
      return true;
    }

    toast.error(`Unsupported sign-in state: ${res?.status || "unknown"}`);
    return false;
  };

  const onSubmit = async (data) => {
    if (!isLoaded || loading) return;

    setLoading(true);
    resetSecondFactorState();

    try {
      let res = await signIn.create({
        identifier: data.identifier.trim(),
        password: data.password,
      });

      logClerkStatus("after signIn.create", res);

      if (res?.status === "needs_first_factor") {
        res = await signIn.attemptFirstFactor({
          strategy: "password",
          password: data.password,
        });

        logClerkStatus("after attemptFirstFactor", res);
      }

      await handleSignInResult(res);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.errors?.[0]?.longMessage || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const onVerifyEmailCode = async (e) => {
    e.preventDefault();

    if (!isLoaded || loading) return;

    if (!emailCode.trim()) {
      toast.error("Enter the verification code from your email.");
      return;
    }

    setLoading(true);

    try {
      const res = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code: emailCode.trim(),
      });

      logClerkStatus("after attemptSecondFactor", res);

      if (res?.status === "complete" && res?.createdSessionId) {
        await finishSignIn(res.createdSessionId);
        return;
      }

      if (res?.status === "needs_second_factor") {
        toast.error("More verification is still required.");
        return;
      }

      toast.error("That code is invalid or expired. Try again or request a new code.");
    } catch (error) {
      console.error("Second factor error:", error);
      toast.error(error?.errors?.[0]?.longMessage || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const onResendEmailCode = async () => {
    if (!isLoaded || loading || !secondFactorEmailAddressId) return;

    setLoading(true);

    try {
      await signIn.prepareSecondFactor({
        strategy: "email_code",
        emailAddressId: secondFactorEmailAddressId,
      });

      toast.success("A new code was sent to your email.");
    } catch (error) {
      console.error("Resend code error:", error);
      toast.error(error?.errors?.[0]?.longMessage || "Could not resend code");
    } finally {
      setLoading(false);
    }
  };

  const cancelEmailCodeStep = async () => {
    resetSecondFactorState();

    try {
      // Best effort cleanup: recreate a fresh sign-in attempt next time.
      // We do not continue using the old in-progress second-factor state.
      await signIn.create({});
    } catch (e) {
      // Ignore cleanup errors here.
      console.warn("Sign-in reset warning:", e);
    }
  };

  const oauthSignIn = async (provider) => {
    if (!isLoaded || loading) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (error) {
      console.error("OAuth error:", error);
      toast.error(error?.errors?.[0]?.longMessage || "OAuth sign-in failed");
    }
  };

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
            <Icon name="ArrowLeft" size={30} />
          </button>
          <span className="text-lg font-medium text-primary">Verify email</span>
        </p>

        <div className="mt-15">
          <p className="text-sm text-secondary mt-10 mb-4">
            Enter the verification code we sent to your email.
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
          <Icon name="ArrowLeft" size={30} />
        </NavLink>
        <span className="text-lg font-medium text-primary">Login</span>
      </p>

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

          <div className="flex items-center">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

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
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;