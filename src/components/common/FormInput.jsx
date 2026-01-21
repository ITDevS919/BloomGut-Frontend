import { Input } from "@/components/ui/input";

const FormInput = ({
  type = "text",
  placeholder,
  register,
  name,
  rules,
  error,
  displayError = true,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <Input
        type={type}
        placeholder={placeholder}
        className={
          error ? "border-custom-17 focus:ring-0 focus-visible:ring-0" : ""
        }
        {...register(name, rules)}
      />
      {error && displayError && (
        <p className="text-text-danger text-xs text-center w-full">
          "{error.message}"
        </p>
      )}
    </div>
  );
};

export default FormInput;
