import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Free from "./Free";
import Intermediate from "./Intermediate";
import Premium from "./Premium";

const Water = () => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simple loading animation for initial render
    const timeout = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timeout);
  }, []);

  const renderComponent = () => {
    switch (plan) {
      case "free":
        return <Free />;
      case "intermediate":
        return <Intermediate />;
      case "premium":
        return <Premium />;
      default:
        return <Free />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return <>{renderComponent()}</>;
};

export default Water;
