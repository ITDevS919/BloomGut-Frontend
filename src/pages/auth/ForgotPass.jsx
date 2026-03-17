import FormInput from "@/components/common/FormInput";
import Icon from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { emailValidation } from "@/utils/validators";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";
import { FaHeadphones } from "react-icons/fa";
import { useClerk } from "@clerk/clerk-react";

const ForgotPass = () => {
  const [loading, setLoading] = useState(false);
  const { resetPasswordForEmail } = useClerk();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await resetPasswordForEmail(data);
      toast.success("Password reset link sent! Please check your email.");
    } catch (error) {
      toast.error(error?.errors?.[0]?.longMessage || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-6">
      {/* Back arrow or title */}
      <p className="w-full flex items-start">
        <NavLink to="/home">
          <Icon name={"ArrowLeft"} size={30} />
        </NavLink>
        <span className="text-lg font-medium text-primary">
          Retrive Password
        </span>
      </p>

      {/* Form */}
      <div className="mt-40 ">
        <form
          className="flex flex-col gap-4 mt-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Email Input */}
          <FormInput
            placeholder="Please enter your account/email"
            name="email"
            register={register}
            rules={emailValidation}
            error={errors.identifier}
          />

          <Button type="submit" className="w-[60%] mx-auto mt-4 cursor-pointer">
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
        <div className="mt-14 mb-auto">
          {/* Instructions */}
          <div className="mt-4 text-sm space-y-2.5">
            <p className="text-primary">Instructions:</p>
            <ul className="list-disc pl-5 text-primary space-y-1.75">
              <li>We will send a password reset link to your email.</li>
              <li>Please check your inbox and spam folders.</li>
              <li>Click the link in the email to reset your password.</li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="mt-5 flex justify-end items-center border-t border-custom-15 pt-6.5 w-full gap-1">
            <span className="text-primary">
              <FaHeadphones />
            </span>
            <span className="text-sm text-primary">Customer Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPass;
