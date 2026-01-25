import { FaPoop } from "react-icons/fa";
import { FaUtensils } from "react-icons/fa";
import { FaGlassWhiskey } from "react-icons/fa";
import { MdWaterDrop } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa6";

import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

const Dashboard = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate()

  const auth = useSelector((state) => state.auth);
  console.log(auth)
  return (
    <div className="flex flex-col relative h-full p-4">
      {/* Upper Scrollable Area */}
      <div className="flex flex-col overflow-y-auto">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-primary mb-5">Hi {auth.user != null && auth.user.firstName}</h3>
          <p className="text-primary-muted">How is your health today?</p>
        </div>
        <div className="flex flex-col gap-5 mt-4">
          <div
            className="flex justify-start gap-3 bg-[#dfd2b2] rounded-[15px] p-5 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
            onClick={() => navigate("/stool")}
          >
            <div className="flex-0">
              <FaPoop className="text-primary" size={24} />
            </div>
            <div className="flex-1 flex flex-col text-start gap-2">
              <div className="flex gap-2 items-center">
                <span className="text-primary font-medium text-lg">Poop</span>
                <span className="text-primary-muted text-sm">
                  Monitor your Bowel health
                </span>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col w-full gap-1">
                  <span className="text-primary-muted text-sm">
                    Bowel Status
                  </span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((_, index) => (
                      <p
                        key={index}
                        className={`h-6 rounded-full transition-all duration-300 w-6 bg-[#dfe1db]`}
                      />
                    ))}
                  </div>
                  <p className="text-primary-muted text-xs">Not Recorded</p>
                </div>
                <div className="flex items-center">
                  <FaChevronRight className="text-primary" size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-start gap-3 bg-[#e0d5e6] rounded-[15px] p-5 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.16)]" onClick={() => navigate("/diet-record")}>
            <div>
              <FaUtensils className="text-primary" size={24} />
            </div>
            <div className="flex-1 flex flex-col text-start gap-2">
              <div className="flex gap-2 items-center">
                <span className="text-primary font-medium text-lg">
                  Diet Record
                </span>
                <span className="text-primary-muted text-sm">
                  Help Adjust Eating
                </span>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col w-full gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-primary text-sm ">
                      Today's Intake
                    </span>
                    <span className="text-primary text-sm ">
                      0%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
                    <div
                      className="bg-[#ac95cc] h-3 rounded-full transition-all"
                      style={{ width: `0%` }}
                    />
                  </div>
                  <p className="text-primary text-sm">Not Recorded</p>
                </div>
                <div className="flex items-center">
                  <FaChevronRight className="text-primary" size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-start gap-3 bg-[#d7eaf8] rounded-[15px] p-5 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.16)]" onClick={() => navigate("/water-record")}>
            <div>
              <FaGlassWhiskey className="text-primary" size={24} />
            </div>
            <div className="flex-1 flex flex-col text-start gap-2">
              <div className="flex gap-2 items-center">
                <span className="text-primary font-bold text-lg">Water</span>
                <span className="text-primary-muted text-sm">
                  Track Water Intake
                </span>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col w-full gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-primary text-sm ">
                      Today's Intake
                    </span>
                    <span className="text-primary text-sm ">
                      0%
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
                    <div
                      className="bg-[#79b6e2] h-3 rounded-full transition-all"
                      style={{ width: `${0}%` }}
                    />
                  </div>
                  <p className="text-primary-muted text-xs">Not Recorded</p>
                </div>
                <div className="flex items-center">
                  <FaChevronRight className="text-primary" size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-start gap-3 bg-[#fff3cd] rounded-[15px] p-5 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.16)]" onClick={() => navigate("/urine-record")}>
            <div>
              <MdWaterDrop className="text-primary" size={24} />
            </div>
            <div className="flex-1 flex flex-col text-start gap-2">
              <div className="flex gap-2 items-center">
                <span className="text-primary font-bold text-lg">
                  Urine Record
                </span>
                <span className="text-primary-muted text-sm">
                  Check Urine Health
                </span>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col w-full gap-1">
                  <span className="text-primary-muted text-sm">
                    Urine Status
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((_, index) => (
                      <p
                        key={index}
                        className={`h-6 rounded-full transition-all duration-300 w-6 bg-[#dfe1db]`}
                      />
                    ))}
                  </div>
                  <p className="text-primary-muted text-xs">Not Recorded</p>
                </div>
                <div className="flex items-center">
                  <FaChevronRight className="text-primary" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
