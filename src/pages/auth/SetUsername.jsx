import { useSignUp, useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const SetupUsername = () => {
  const { user, isLoaded } = useUser();
  const { signUp, setActive } = useSignUp();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && user?.username) {
      navigate("/dashboard");
    }
  }, [isLoaded, user, navigate]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!username.trim()) {
  //     toast.error("Username is required");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     console.log("init in try block");
  //     await signUp.update({
  //       username,
  //     });

  //     toast.success("Username set successfully");
  //     navigate("/dashboard");
  //   } catch (error) {
  //     toast.error(error?.errors?.[0]?.longMessage || "failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }

    setLoading(true);

    try {
      // Update the SignUp object with missing fields
      const res = await signUp?.update({
        username,
      });

      if (res?.status === "complete") {
        await setActive({
          session: res.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              navigate("/sign-in/tasks");
              return;
            }

            toast.success("Username set successfully");
            navigate("/dashboard");
          },
        });
      }
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      toast.error(error?.errors?.[0]?.longMessage || "Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-sm p-6 rounded-md shadow-md flex flex-col gap-4"
      >
        <h1 className="text-lg font-semibold text-center">
          Fill in missing fields
        </h1>

        <p className="text-xs text-gray-500 text-center">
          Please fill in the remaining details to continue.
        </p>

        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className=""
        />

        <Button type="submit" disabled={loading} className="cursor-pointer">
          {loading ? "Saving..." : "Continue"}
        </Button>
      </form>
    </div>
  );
};

export default SetupUsername;
