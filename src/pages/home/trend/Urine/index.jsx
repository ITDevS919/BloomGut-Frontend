import { useSearchParams } from "react-router-dom";
import Free from "./Free";
import Intermediate from "./Intermediate";
import Premium from "./Premium";

const Urine = () => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");

  // Determine which component to show based on plan parameter
  const renderComponent = () => {
    switch (plan) {
      case "free":
        return <Free />;
      case "intermediate":
        return <Intermediate />;
      case "premium":
        return <Premium />;
      default:
        return <Free />; // Default to Free if no plan specified
    }
  };

  return (
    <>
      {renderComponent()}
    </>
  );
};

export default Urine;
