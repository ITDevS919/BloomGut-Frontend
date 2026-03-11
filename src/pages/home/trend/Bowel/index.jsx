import { useSearchParams } from "react-router-dom";
import Free from "./Free";
import Intermediate from "./Intermediate";
import Premium from "./Premium";

const Bowel = () => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");

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

  return <>{renderComponent()}</>;
};

export default Bowel;
