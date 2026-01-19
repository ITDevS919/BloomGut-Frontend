import {
  AuthenticateWithRedirectCallback,
  ClerkLoaded,
  ClerkLoading,
} from "@clerk/clerk-react";

const SSOCallback = () => {
  return (
    <div className="bg-ivory flex flex-col justify-between">
      <ClerkLoading>Signing you in...</ClerkLoading>
      <ClerkLoaded />

      <AuthenticateWithRedirectCallback continueSignUpUrl="/auth/setup-username" />
      <div id="clerk-captcha" />
    </div>
  );
};

export default SSOCallback;
