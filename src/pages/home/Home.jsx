import Icon from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { FaToilet } from "react-icons/fa";
import { FaGlassWhiskey } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="flex flex-col gap-2 text-center mt-21">
        <h2 className="font-bold text-2xl text-primary">Welcome to BloomGut</h2>
        <p className="text-primary-muted">Your Personal Health</p>
      </div>
      <div className="flex flex-col gap-5 mt-auto">
        <Button
          onClick={() => {
            navigate("/auth/register");
          }}
          variant="outline"
        >
          Existing Account
        </Button>
        <Button
          onClick={() => {
            navigate("/auth/register");
          }}
          variant="outline"
        >
          Register New Account
        </Button>
      </div>
      <div className="flex flex-col gap-4 mt-16 mb-auto">
        <div className="flex gap-5">
          <FaToilet size={32} className="text-[#e29c53]" />
          <p className="text-primary">Bowel Movement</p>
        </div>
        <div className="flex gap-5">
          <FaGlassWhiskey size={32} className="text-[#79b6e2]" />
          <p className="text-primary">Water Intake</p>
        </div>
        <div className="flex gap-5">
          {/* <FaArrowTrendUp size={32} className="text-[#3fb96e]" /> */}
          <Icon name={"Trendup"} height={32} width={32} />
          <p className="text-primary">Health Trends</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
