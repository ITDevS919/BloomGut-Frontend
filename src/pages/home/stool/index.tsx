import { AccordionItem } from "@/components/custom/AccordionItem";
import { CustomButton } from "@/components/custom/CustomButton";
import { CustomCheckbox } from "@/components/custom/CustomCheckbox";
import CustomHeading from "@/components/custom/CustomHeading";
import {
  CustomRadioGroup,
  CustomRadioItem,
} from "@/components/custom/CustomRadioGroup";
import SegmentedControl from "@/components/custom/SegmentedControl";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import StoolType1 from "@/assets/Images/stool-types/Stool type 1.png";
import StoolType2 from "@/assets/Images/stool-types/Stool type 2.png";
import StoolType3 from "@/assets/Images/stool-types/Stool type 3.png";
import StoolType4 from "@/assets/Images/stool-types/Stool type 4.png";
import StoolType5 from "@/assets/Images/stool-types/Stool type 5.png";
import StoolType6 from "@/assets/Images/stool-types/Stool type 6.png";
import StoolType7 from "@/assets/Images/stool-types/Stool type 7.png";
import Type1 from "@/assets/Images/stool-types/Type 1.png";
import Type2 from "@/assets/Images/stool-types/Type 2.png";
import Type3 from "@/assets/Images/stool-types/Type 3.png";
import Type4 from "@/assets/Images/stool-types/Type 4.png";
import Type5 from "@/assets/Images/stool-types/Type 5.png";
import Type6 from "@/assets/Images/stool-types/Type 6.png";
import Type7 from "@/assets/Images/stool-types/Type 7.png";

const StoolPage = () => {
  const navigate = useNavigate();
  const [timeValue, setTimeValue] = useState("card");
  const [frequencyValue, setFrequencyValue] = useState("card");
  const [selectedStool, setSelectedStool] = useState(null);
  const [selectedStoolImage, setSelectedStoolImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  
  const handleSaveRecord = () => {
    console.log("Save Record clicked");
    // TODO: submit record to backend
  };

  const handleViewTrend = () => {
    navigate("/trend-analysis", { state: { trendType: "bowel" } });
  };
  const stoolImages = [
    {
      label: "Hard Lumps",
      image: StoolType1,
      onclick: () => {
        setSelectedStool(Type1);
        setSelectedStoolImage("Hard Lumps");
      },
    },
    {
      label: "Lumpy",
      image: StoolType2,
      onclick: () => {
        setSelectedStool(Type2);
        setSelectedStoolImage("Lumpy");
      }

    },
    {
      label: "Firm",
      image: StoolType3,
      onclick: () => {
        setSelectedStool(Type3);
        setSelectedStoolImage("Firm");
      }
    },
    {
      label: "Smooth",
      image: StoolType4,
      onclick: () => {
        setSelectedStool(Type4);
        setSelectedStoolImage("Smooth");
      }
    },
    {
      label: "Soft",
      image: StoolType5,
      onclick: () => {
        setSelectedStool(Type5);
        setSelectedStoolImage("Soft");
      }
    },
    {
      label: "Mushy",
      image: StoolType6,
      onclick: () => {
        setSelectedStool(Type6);
        setSelectedStoolImage("Mushy");
      }
    },
    {
      label: "Watery",
      image: StoolType7,
      onclick: () => {
        setSelectedStool(Type7);
        setSelectedStoolImage("Watery");
      }
    },
  ];

  const colorOptions = [
    { label: "Brown", colorCode: "#8b4513", onclick: () => { setSelectedColor("Brown"); } },
    { label: "Black", colorCode: "#000000", onclick: () => { setSelectedColor("Black"); } },
    { label: "Yellow", colorCode: "#daa520", onclick: () => { setSelectedColor("Yellow"); } },
    { label: "Red", colorCode: "#990000", onclick: () => { setSelectedColor("Red"); } },
    { label: "Green", colorCode: "#556b2f", onclick: () => { setSelectedColor("Green"); } },
  ];

  const timeOfTheDayOptions = [
    { label: "Morning", value: "morning" },
    { label: "Noon", value: "noon" },
    { label: "Evening", value: "evening" },
  ];

  const symptomsOptions = [
    { label: "Constipated", value: "constipated" },
    { label: "Diarrhea", value: "diarrhea" },
    { label: "Stomach Pain", value: "stomachPain" },
    { label: "Bloating", value: "bloating" },
    { label: "Belly Ache", value: "bellyAche" },
    { label: "None", value: "none" },
  ];

  const timeOptions = [
    { label: "1-3 min", value: "1-3minute" },
    { label: "3-10 min", value: "3-10minute" },
    { label: "10+ min", value: "10+ minute" },
  ];

  const frequencyOptions = [
    { label: "3+ times/day", value: "threePlus" },
    { label: "1–2 times (Normal)", value: "normal" },
    { label: "No bowel movement for 3+ days", value: "noBowl" },
  ];

  const mucusConditionOptions = [
    { label: "Mucus (clear/white)", value: "mucus_clear" },
    { label: "Black Clots", value: "black_clots" },
  ];

  const textureConditionOptions = [
    { label: "Viscous", value: "viscous" },
    { label: "Undigested Food", value: "undigested_food" },
  ];

  const odorConditionOptions = [
    { label: "Yellow (Normal Odor)", value: "odor_yellow" },
    { label: "Metallic", value: "odor_metallic" },
    { label: "Foul", value: "odor_foul" },
  ];

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="flex flex-col gap-4 font-['Noto_Sans_TC', sans-serif]">
      <div className="pt-4 px-3">
        <CustomButton
          icon={IoIosArrowBack}
          variant="ghost"
          size="lg"
          iconSize={20}
          onClick={() => window.history.back()}
        />
      </div>

      <div className="flex justify-between px-6">
        <div>
          <p className="text-[20px] text-primary font-bold font-base">
            {days[new Date().getDay()]}
          </p>
          <p className="text-[20px] text-primary">
            {months[new Date().getMonth()]} {new Date().getDate()}
          </p>
        </div>
        <CustomButton variant="outline" className="bg-white" onClick={handleViewTrend}>
          View Trend
        </CustomButton>
      </div>

      <div className="flex justify-center items-center">
        <img
          src={
            selectedStool
              ? selectedStool
              : Type1
          }
          className="w-27 h-24.5 object-cover border border-custom-20 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
          alt="Logo"
        />
      </div>

      <div className="px-5 flex flex-col gap-2">
        <CustomHeading label="Shape" isRequired />
        <span className="text-secondary font-rubik text-xs">
          Bristol Stool Scale
        </span>
        <div className="flex justify-between items-center">
          {stoolImages?.map((i, index) => {
            return (
              <div className="flex flex-col gap-3 items-center cursor-pointer" key={index}>
                <img
                  src={i?.image}
                  className={`w-10 h-10 object-cover rounded-full aspect-square flex-shrink-0
                    ${selectedStoolImage === i?.label ? "border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]" : "shadow-[0_1px_3px_rgba(0,0,0,0.04)]"}
                    ${index === 0 ? "mt-3" : ""}
                    `}
                  alt={i?.label}
                  onClick={() => i?.onclick()}
                />
                <p className="text-primary text-xs font-medium text-center capitalize max-w-[50px] leading-tight">
                  {i?.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-5.5 flex flex-col mb-[39px]">
        <CustomHeading label="Color" isRequired className="mb-[8px]" />
        <div className="flex justify-between items-center">
          {colorOptions?.map((color, index) => {
            return (
              <div
                className={`w-10.5 h-10 cursor-pointer rounded-full flex items-center justify-center
                  ${selectedColor === color?.label ? "border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]" : "shadow-[0_1px_3px_rgba(0,0,0,0.04)]"}`}
                style={{ backgroundColor: color.colorCode }}
                onClick={() => color?.onclick()}
              >
                <p className="text-white text-xs text-center">{color?.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-5.5 flex flex-col mb-[37px]">
        <CustomHeading label="Amount" isRequired className="mb-[11px]" />
        <SegmentedControl
          labels={["Small", "Medium", "Large"]}
          onChange={(value) => console.log("Selected amount:", value)}
        />
      </div>

      <div className="px-5.5 flex flex-col mb-[37px]">
        <CustomHeading label="Time" isRequired className="mb-[9px]" />
        <CustomRadioGroup
          value={timeValue}
          onValueChange={setTimeValue}
          className="flex gap-8.5 items-center"
        >
          {timeOptions?.map((time, index) => {
            return (
              <CustomRadioItem
                key={index}
                value={time.value}
                label={time.label}
                variant="card"
                className="px-4.5 py-3 w-fit text-secondary text-sm"
              />
            );
          })}
        </CustomRadioGroup>
      </div>

      <div className="px-6 flex flex-col mb-[29px]">
        <CustomHeading label="Frequency" isRequired className="mb-2" />
        <CustomRadioGroup
          value={frequencyValue}
          onValueChange={setFrequencyValue}
          className="flex gap-5 items-center flex-wrap"
        >
          {frequencyOptions?.map((time, index) => {
            return (
              <CustomRadioItem
                key={index}
                value={time.value}
                label={time.label}
                variant="card"
                className="px-4.5 py-3 w-fit text-nowrap"
              />
            );
          })}
        </CustomRadioGroup>
      </div>

      <div className="px-6.5 flex flex-col mb-[30px]">
        <CustomHeading label="Time of Day" isRequired className="mb-[20px]" />
        <div className="flex gap-4">
          {timeOfTheDayOptions?.map((time, i) => {
            return (
              <CustomCheckbox label={time.label} value={time.value} key={i} />
            );
          })}
        </div>
      </div>

      <div className="px-6.5 flex flex-col mb-[34px]">
        <CustomHeading label="Symptom Log" isRequired className="mb-[5px]" />
        <span className="text-custom-12 text-xs mb-[31px]">
          Select symptoms today (Multiple)
        </span>
        <div className="flex gap-4 flex-wrap">
          {symptomsOptions?.map((symptom, i) => {
            return (
              <CustomCheckbox
                label={symptom.label}
                value={symptom.value}
                key={i}
              />
            );
          })}
        </div>
      </div>

      <div className="px-6.5 flex flex-col">
        <CustomHeading
          label="Additional Status"
          isRequired
          requiredText="Required, Select ≥ 1"
          className="mb-[6px]"
        />
        <span className="text-custom-12 text-xs mb-[20px]">Record observed status</span>
      </div>

      <div className="px-6.5 flex flex-col gap-[20px] mb-[49px]">
        <AccordionItem
          title="Mucus Condition"
          options={[
            { label: "Mucus (clear/white)", value: "mucus_clear" },
            { label: "Black Clots", value: "black_clots" },
          ]}
        />

        <AccordionItem
          title="Texture Condition"
          options={[
            { label: "Viscous", value: "viscous" },
            { label: "Undigested Food", value: "undigested_food" },
          ]}
        />

        <AccordionItem
          title="Odor Condition"
          options={[
            { label: "Yellow (Normal Odor)", value: "odor_yellow" },
            { label: "Metallic", value: "odor_metallic" },
            { label: "Foul", value: "odor_foul" },
          ]}
        />

        <AccordionItem title="Other Symptoms" showTextarea />
      </div>
      <div className="px-6.5 pb-6 flex justify-center">
        <button
          onClick={handleSaveRecord}
          aria-label="Save Record"
          className="w-[242px] mx-auto transition-all duration-150 active:scale-[0.98] active:shadow-[0_4px_10px_rgba(0,0,0,0.18)] min-h-[48px] flex items-center justify-center text-white text-base rounded-[24px] bg-[#C69C6D] py-3 shadow-[0_4px_10px_rgba(0,0,0,0.18)]"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default StoolPage;
