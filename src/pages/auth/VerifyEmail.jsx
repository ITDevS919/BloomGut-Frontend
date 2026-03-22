import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";
import useApiClient from "@/hooks/useApiClient";
import { postUserProfile } from "@/api/http";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/common/Loader";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const api = useApiClient();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const syncProfileToDb = async (userId) => {
    const raw = sessionStorage.getItem("pendingRegistrationProfile");
    if (!raw) return;

    let profile = null;
    try {
      profile = JSON.parse(raw);
    } catch {
      profile = null;
    }

    await postUserProfile(api, {
      userId,
      username: profile?.username,
      email: profile?.email,
    });

    sessionStorage.removeItem("pendingRegistrationProfile");
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!isLoaded || loading) return;
    if (!code.trim()) {
      toast.error("Verification code is required.");
      return;
    }

    setLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (completeSignUp.status !== "complete" || !completeSignUp.createdSessionId) {
        toast.error("Verification is incomplete. Please try again.");
        return;
      }

      await setActive({ session: completeSignUp.createdSessionId });

      const clerkUserId = completeSignUp.createdUserId || signUp?.createdUserId;
      if (clerkUserId) {
        await syncProfileToDb(clerkUserId);
      }

      toast.success("Email verified and account is ready.");
      navigate("/dashboard");
    } catch (error) {
      const serverMessage = error?.response?.data?.message;
      const clerkMessage = error?.errors?.[0]?.longMessage;
      toast.error(serverMessage || clerkMessage || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <Loader />;
  }

  return (
    <div className="bg-ivory p-6 text-secondary min-h-full">
      <div className="max-w-md mx-auto pt-10">
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif] mb-2">Verify Email</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter the code sent to your email to complete sign up.
        </p>

        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <Input
            type="text"
            inputMode="numeric"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <Button type="submit" disabled={loading} className="cursor-pointer">
            {loading ? "Verifying..." : "Verify"}
          </Button>
        </form>

        <Button
          type="button"
          variant="ghost"
          className="mt-3 p-0 text-sm cursor-pointer"
          onClick={() => navigate("/auth/login")}
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default VerifyEmail;
