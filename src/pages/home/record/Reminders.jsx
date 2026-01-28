import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Clock, Trash2 } from "lucide-react";
import { MdDeleteSweep } from "react-icons/md";
import { FaBell } from "react-icons/fa6";

const Switch = ({ checked, onChange }) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative w-11 h-6 rounded-full transition-all cursor-pointer bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] ${checked ? "border border-[#79B6E2]" : ""
                }`}
        >
            {/* Blue section on right when checked */}
            {checked && (
                <div
                    className="absolute right-0 top-0 h-full rounded-r-full transition-all"
                />
            )}
            {/* Knob - always blue */}
            <div
                className="absolute top-1/2 -translate-y-1/2 rounded-full transition-transform bg-[#79B6E2]"
                style={{
                    width: 18,
                    height: 18,
                    transform: checked ? "translateX(20px)" : "translateX(3px)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
            />
        </button>
    );
};

const RadioButton = ({ checked, onChange, label }) => {
    return (
        <label
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onChange(true)}
        >
            <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${checked ? "border-[#79B6E2]" : "border-gray-300"
                    }`}
            >
                {checked && (
                    <div className="w-3 h-3 rounded-full bg-[#79B6E2]" />
                )}
            </div>
            <span className="text-sm text-primary">{label}</span>
        </label>
    );
};

const TimePickerModal = ({ isOpen, onClose, onConfirm, initialTime = "" }) => {
    const [selectedHour, setSelectedHour] = useState("09");
    const [selectedMinute, setSelectedMinute] = useState("00");
    const hourRef = useRef(null);
    const minuteRef = useRef(null);

    useEffect(() => {
        if (isOpen && initialTime) {
            const [hour, minute] = initialTime.split(":");
            if (hour && minute) {
                setSelectedHour(hour);
                setSelectedMinute(minute);
            }
        }
    }, [isOpen, initialTime]);

    useEffect(() => {
        if (isOpen) {
            // Scroll to selected values
            setTimeout(() => {
                if (hourRef.current) {
                    const hourElement = hourRef.current.querySelector(`[data-hour="${selectedHour}"]`);
                    if (hourElement) {
                        hourElement.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                }
                if (minuteRef.current) {
                    const minuteElement = minuteRef.current.querySelector(`[data-minute="${selectedMinute}"]`);
                    if (minuteElement) {
                        minuteElement.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                }
            }, 100);
        }
    }, [isOpen, selectedHour, selectedMinute]);

    const handleConfirm = () => {
        const time = `${selectedHour.padStart(2, "0")}:${selectedMinute.padStart(2, "0")}`;
        onConfirm(time);
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    if (!isOpen) return null;

    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/20"
                onClick={handleCancel}
            />
            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
                <div
                    className="bg-[#f7f6f1] rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] p-6 max-w-xs w-full pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Title */}
                    <h3 className="text-lg font-medium text-primary text-center mb-6">
                        Set Time
                    </h3>

                    {/* Time Picker Columns */}
                    <div className="flex justify-center gap-8 mb-6">
                        {/* Hours Column */}
                        <div
                            ref={hourRef}
                            className="flex-1 max-h-[200px] overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                        >
                            {hours.map((hour) => {
                                const isSelected = hour === selectedHour;
                                return (
                                    <div
                                        key={hour}
                                        data-hour={hour}
                                        onClick={() => setSelectedHour(hour)}
                                        className={`text-center py-2 cursor-pointer transition-all ${isSelected
                                            ? "text-[#3b82f6] text-xl font-semibold"
                                            : "text-gray-400 text-base"
                                            }`}
                                        style={{
                                            borderBottom: isSelected ? "2px solid #3b82f6" : "1px solid transparent",
                                        }}
                                    >
                                        {hour}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Minutes Column */}
                        <div
                            ref={minuteRef}
                            className="flex-1 max-h-[200px] overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                        >
                            {minutes.map((minute) => {
                                const isSelected = minute === selectedMinute;
                                return (
                                    <div
                                        key={minute}
                                        data-minute={minute}
                                        onClick={() => setSelectedMinute(minute)}
                                        className={`text-center py-2 cursor-pointer transition-all ${isSelected
                                            ? "text-[#3b82f6] text-xl font-semibold"
                                            : "text-gray-400 text-base"
                                            }`}
                                        style={{
                                            borderBottom: isSelected ? "2px solid #3b82f6" : "1px solid transparent",
                                        }}
                                    >
                                        {minute}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className="flex-1 bg-[#79B6E2] text-white px-4 py-3 rounded-lg text-base font-medium hover:opacity-90 transition-opacity"
                        >
                            OK
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex-1 bg-white border border-red-500 text-red-500 px-4 py-3 rounded-lg text-base font-medium hover:opacity-90 transition-opacity"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

const Reminders = () => {
    const [enabled, setEnabled] = useState(true);
    const [frequency, setFrequency] = useState("custom");
    const [customTime, setCustomTime] = useState("");
    const [reminders, setReminders] = useState(["09:00", "12:00"]);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleAddReminder = () => {
        if (customTime && customTime.match(/^\d{2}:\d{2}$/)) {
            setReminders([...reminders, customTime]);
            setCustomTime("");
        }
    };

    const handleDeleteReminder = (index) => {
        setReminders(reminders.filter((_, i) => i !== index));
    };

    const handleDeleteAll = () => {
        setReminders([]);
    };

    const handleTimeInputChange = (e) => {
        const value = e.target.value;
        // Allow format like "09:00" or "---:---"
        if (value.length <= 5) {
            setCustomTime(value);
        }
    };

    const handleTimeInputKeyDown = (e) => {
        if (e.key === "Enter") {
            handleAddReminder();
        }
    };

    const handleInputClick = () => {
        setShowTimePicker(true);
    };

    const handleTimeConfirm = (time) => {
        setCustomTime(time);
    };

    return (
        <div className="bg-ivory min-h-full p-6 text-primary flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 mb-[27px]">
                <button
                    type="button"
                    className="text-primary text-xl leading-none"
                    aria-label="back"
                    onClick={() => window.history.back()}
                >
                    <ChevronLeft className="text-primary text-[40px] leading-none cursor-pointer" />
                </button>
                <h2 className="text-lg font-['Noto_Sans_TC', sans-serif] flex items-center gap-2">
                    <FaBell className="text-[#79B6E2]" />
                    <span>Reminders</span>
                </h2>
            </div>

            <div className="text-lg text-secondary ml-2 mb-2">Reminder Time</div>
            {/* Enable Toggle */}
            <div className="flex items-center justify-between mb-6">
                <span className="text-base text-primary">Enable</span>
                <Switch checked={enabled} onChange={setEnabled} />
            </div>

            {/* Frequency Radio Buttons */}
            <div className="flex flex-col gap-4 mb-6">
                <RadioButton
                    checked={frequency === "2h"}
                    onChange={() => setFrequency("2h")}
                    label="Every 2 H"
                />
                <RadioButton
                    checked={frequency === "4h"}
                    onChange={() => setFrequency("4h")}
                    label="Every 4"
                />
                <RadioButton
                    checked={frequency === "custom"}
                    onChange={() => setFrequency("custom")}
                    label="Custom Time"
                />
            </div>

            {/* Custom Time Input */}
            {frequency === "custom" && (
                <div className="grid grid-cols-[1fr_auto] mb-6">
                    <input
                        type="text"
                        value={customTime}
                        onChange={handleTimeInputChange}
                        onClick={handleInputClick}
                        onKeyDown={handleTimeInputKeyDown}
                        placeholder="--:--"
                        readOnly
                        className="w-full bg-gray-100 rounded-[12px] border border-[#ccc] px-4 py-3 pr-12 text-primary text-base shadow-[0_2px_4px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-[#79B6E2] placeholder:text-gray-400 cursor-pointer"
                    />
                    <button
                        type="button"
                        onClick={handleAddReminder}
                        className="ml-2 text-primary cursor-pointer"
                        aria-label="Add reminder time"
                    >
                        <Clock className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Time Picker Modal */}
            <TimePickerModal
                isOpen={showTimePicker}
                onClose={() => setShowTimePicker(false)}
                onConfirm={handleTimeConfirm}
                initialTime={customTime}
            />

            {/* Reminders Section */}
            <div className="flex items-center mb-4">
                <span className="text-base text-primary">Reminders:</span>
                <button
                    type="button"
                    onClick={handleDeleteAll}
                    className="ml-1 bg-white text-red-500 px-4 py-2 rounded-[8px] text-sm font-medium hover:opacity-90 transition-opacity shadow-[0_2px_4px_rgba(0,0,0,0.08)]"
                >
                    Delete All
                </button>
            </div>

            {/* Reminder List */}
            <div className="flex flex-wrap gap-3">
                {reminders.map((time, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-[8px] px-4 py-3 flex items-center gap-3 border border-[#cdd3da]"
                    >
                        <span className="text-base text-secondary">{time}</span>
                        <button
                            type="button"
                            onClick={() => handleDeleteReminder(index)}
                            className=""
                            aria-label={`Delete reminder ${time}`}
                        >
                            <MdDeleteSweep className="w-4 h-4 text-[#f44336]" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reminders;
