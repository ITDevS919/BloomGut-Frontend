import { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/Icon";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  emailValidation,
  passwordValidation,
  usernameValidation,
} from "@/utils/validators";
import FormInput from "@/components/common/FormInput";
import { ChevronLeft } from "lucide-react";

const getPasswordStrength = (password = "") => {
  if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)) {
    return password.length > 8 ? "Strong" : "Medium";
  }
  return "Weak";
};

const strengthValue = {
  Weak: 33,
  Medium: 66,
  Strong: 100,
};

const Register = () => {
  const { signUp, isLoaded } = useSignUp();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const passwordToValidate = watch("password");
  const passwordStrength = getPasswordStrength(passwordToValidate);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signUp.create(data);
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      sessionStorage.setItem(
        "pendingRegistrationProfile",
        JSON.stringify({
          username: data?.username,
          email: data?.emailAddress,
        })
      );
      toast.success("Verification code sent to your email.");
      navigate("/auth/verify-email");
    } catch (error) {
      const serverMessage = error?.response?.data?.message;
      const clerkMessage = error?.errors?.[0]?.longMessage;
      toast.error(serverMessage || clerkMessage || error?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded)
    return (
      <div className="flex justify-center items-center w-full">Loading...</div>
    );

  return (
    <>
      <div className="bg-ivory p-6 text-secondary">
        <div className="flex items-center gap-4 mb-35">
          <button
            type="button"
            className="text-primary text-xl leading-none cursor-pointer"
            aria-label="back"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="text-primary text-[40px] leading-none cursor-pointer " />
          </button>
          <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Create Account</h2>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          <FormInput
            placeholder="Name"
            name="username"
            register={register}
            rules={usernameValidation}
            error={errors.username}
          />

          <FormInput
            type="email"
            placeholder="Email"
            name="emailAddress"
            register={register}
            rules={emailValidation}
            error={errors.emailAddress}
          />

          <FormInput
            type="password"
            placeholder="Password"
            name="password"
            register={register}
            rules={passwordValidation}
            error={errors.password}
            displayError={true}
          />

          {passwordToValidate?.length > 0 && (
            <div className="flex flex-col mt-2 gap-2">
              <div className="flex justify-between text-xs text-primary">
                <span>Weak</span>
                <span>Medium</span>
                <span>Strong</span>
              </div>
              <Progress className="h-3" value={strengthValue[passwordStrength]} />
              {!errors.password && (
                <p className="text-xs text-danger mb-4">
                  Min 8 chars, 1 number & 1 uppercase
                </p>
              )}
            </div>
          )}

          <div id="clerk-captcha" />

          <Button type="submit" className="w-[60%] mx-auto cursor-pointer" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <p className="text-sm text-gray-400 mt-6 text-center border-t w-full py-3 flex items-end justify-center whitespace-nowrap gap-1">
          By registering, you agree to the
          <a href="#" className="text-blue-600">Terms</a>
          &
          <a href="#" className="text-blue-600">Privacy Policy</a>
        </p>
      </div>
    </>
  );
};

export default Register;

// import { useEffect, useState } from "react";
// import { useSignUp } from "@clerk/clerk-react";
// import { Button } from "@/components/ui/button";
// import Icon from "@/components/common/Icon";
// import { Input } from "@/components/ui/input";
// import { Progress } from "@/components/ui/progress";
// import { useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { emailValidation, passwordValidation } from "@/utils/validators";
// import FormInput from "@/components/common/FormInput";

// const getPasswordStrength = (password = "") => {
//   if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)) {
//     return password.length > 8 ? "Strong" : "Medium";
//   }
//   return "Weak";
// };

// const strengthValue = {
//   Weak: 33,
//   Medium: 66,
//   Strong: 100,
// };

// const Register = () => {
//   const { signUp, isLoaded } = useSignUp();
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm();

//   const password = watch("password");
//   const passwordStrength = getPasswordStrength(password);

//   const onSubmit = async (data) => {
//     try {
//       await signUp.create(data);
//       toast.success("Sign-up successful!");
//       navigate("/dashboard");
//     } catch (err) {
//       toast.error(err?.errors?.[0]?.longMessage);
//     }
//   };

//   if (!isLoaded) {
//     return (
//       <div className="flex justify-center items-center">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="bg-ivory flex flex-col">
//       <div className="flex items-center gap-3">
//         <Icon name="ArrowLeft" size={30} onClick={() => navigate("/home")} />
//         <h2 className="text-lg font-medium text-primary">Create Account</h2>
//       </div>

//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="flex flex-col gap-4 px-6"
//       >
//         <FormInput placeholder="Name" name="username" register={register} />

//         <FormInput
//           type="email"
//           placeholder="Email"
//           name="emailAddress"
//           register={register}
//           rules={emailValidation}
//           error={errors.emailAddress}
//         />

//         <FormInput
//           type="password"
//           placeholder="Password"
//           name="password"
//           register={register}
//           rules={passwordValidation}
//           error={errors.password}
//         />

//         <div className="flex flex-col gap-2">
//           <div className="flex justify-between text-xs text-secondary">
//             <span>Weak</span>
//             <span>Medium</span>
//             <span>Strong</span>
//           </div>
//           <Progress value={strengthValue[passwordStrength]} />
//           <p className="text-xs text-gray-400">
//             Min 8 chars, 1 number & 1 uppercase
//           </p>
//         </div>

//         <div id="clerk-captcha" />

//         <Button type="submit" className="w-[60%] mx-auto">
//           Register
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default Register;
