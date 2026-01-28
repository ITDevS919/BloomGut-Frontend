import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { FaTint } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const CustomVolume = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const initialVolume = 250;
    const [volume, setVolume] = useState(initialVolume);

    const handleDecrease = () => {
        if (volume > 0) {
            setVolume(volume - 10);
        }
    };

    const handleIncrease = () => {
        setVolume(volume + 10);
    };

    const handleRecord = () => {
        console.log("Record volume:", volume);
        navigate("/water-record");
    };

    const handleCancel = () => {
        navigate("/water-record");
    };

    return (
        <div className="bg-ivory min-h-full p-6 text-primary flex flex-col">
            <div className="flex items-center gap-4 mb-[27px]">
                <button
                    type="button"
                    className="text-primary text-xl leading-none"
                    aria-label="back"
                    onClick={() => window.history.back()}
                >
                    <ChevronLeft className="text-primary text-[40px] leading-none cursor-pointer " />
                </button>
                <h2 className="text-lg font-['Noto_Sans_TC', sans-serif] flex items-center gap-2">
                    <FaTint className="text-[#2190EE]" />
                    <span>Custom Volume</span>
                </h2>
            </div>
            <div className="bg-ivory min-h-full p-6 flex flex-col items-center justify-center mt-20">

                {/* Volume Selector */}
                <div className="flex items-center justify-center gap-6 mb-12">
                    {/* Decrease Button */}
                    <button
                        type="button"
                        onClick={handleDecrease}
                        className="text-[30px] text-secondary leading-none cursor-pointer"
                        aria-label="Decrease volume"
                    >
                        −
                    </button>

                    {/* Volume Display */}
                    <div className="bg-white rounded-[12px] px-8 py-4 shadow-[0_2px_4px_rgba(0,0,0,0.1)] min-w-[140px] text-center">
                        <span className="text-2xl font-bold text-primary">
                            {volume} ml
                        </span>
                    </div>

                    {/* Increase Button */}
                    <button
                        type="button"
                        onClick={handleIncrease}
                        className="text-[30px] text-secondary leading-none cursor-pointer"
                        aria-label="Increase volume"
                    >
                        +
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 w-full max-w-[280px]">
                    {/* Record Button */}
                    <button
                        type="button"
                        onClick={handleRecord}
                        className="flex-1 bg-[#79B6E2] text-white px-6 py-3 rounded-[8px] text-base font-medium shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:opacity-90 transition-opacity"
                    >
                        Record
                    </button>

                    {/* Cancel Button */}
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 bg-white border border-red-500 text-red-500 px-6 py-3 rounded-[8px] text-base font-medium shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:opacity-90 transition-opacity"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>

    );
};

export default CustomVolume;
