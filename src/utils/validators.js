export const usernameValidation = {
  required: "Name is required",
  setValueAs: (value) => value?.trim(),
  minLength: {
    value: 2,
    message: "Name must be at least 2 characters",
  },
  maxLength: {
    value: 64,
    message: "Name must be at most 64 characters",
  },
};
export const emailValidation = {
  required: "Email is required",
  setValueAs: (value) => value?.trim(),
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Enter a valid email address",
  },
};

export const passwordValidation = {
  required: "Password is required",
  setValueAs: (value) => value?.trim(),
  minLength: {
    value: 8,
    message: "Password must be at least 8 characters",
  },
  validate: {
    hasUppercase: (v) => /[A-Z]/.test(v) || "Must include one uppercase letter",
    hasNumber: (v) => /\d/.test(v) || "Must include one number",
  },
};
