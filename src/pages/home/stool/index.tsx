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

const StoolPage = () => {
  const [timeValue, setTimeValue] = useState("card");
  const [frequencyValue, setFrequencyValue] = useState("card");
  const [selectedStool, setSelectedStool] = useState(null);
  const handleSaveRecord = () => {
    console.log("Save Record clicked");
    // TODO: submit record to backend
  };
  const stoolImages = [
    {
      label: "Hard Lumps",
      image: "src/assets/images/stool-types/Stool type 1.png",
      onclick: () => {
        setSelectedStool("src/assets/images/stool-types/Type 1.png");
      },
    },
    {
      label: "Lumpy",
      image: "src/assets/images/stool-types/Stool type 2.png",
      onclick: () =>
        setSelectedStool("src/assets/images/stool-types/Type 2.png"),
    },
    {
      label: "Firm",
      image: "src/assets/images/stool-types/Stool type 3.png",
      onclick: () =>
        setSelectedStool("src/assets/images/stool-types/Type 3.png"),
    },
    {
      label: "Smooth",
      image: "src/assets/images/stool-types/Stool type 4.png",
      onclick: () =>
        setSelectedStool("src/assets/images/stool-types/Type 4.png"),
    },
    {
      label: "Soft",
      image: "src/assets/images/stool-types/Stool type 5.png",
      onclick: () =>
        setSelectedStool("src/assets/images/stool-types/Type 5.png"),
    },
    {
      label: "Mushy",
      image: "src/assets/images/stool-types/Stool type 6.png",
      onclick: () =>
        setSelectedStool("src/assets/images/stool-types/Type 6.png"),
    },
    {
      label: "Watery",
      image: "src/assets/images/stool-types/Stool type 7.png",
      onclick: () =>
        setSelectedStool("src/assets/images/stool-types/Type 7.png"),
    },
  ];

  const colorOptions = [
    { label: "Brown", colorCode: "#8b4513" },
    { label: "Black", colorCode: "#000000" },
    { label: "Yellow", colorCode: "#daa520" },
    { label: "Red", colorCode: "#990000" },
    { label: "Green", colorCode: "#556b2f" },
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

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <div className="flex flex-col gap-4">
      <div className="pt-4 px-3">
        <CustomButton
          icon={IoIosArrowBack}
          variant="ghost"
          size="lg"
          iconSize={24}
          onClick={() => window.history.back()}
        />
      </div>

      <div className="flex justify-between px-6">
        <div>
          <p className="text-xl text-primary font-bold font-base">
            {days[new Date().getDay()]}
          </p>
          <p className="text-base text-primary">
            {months[new Date().getMonth()]} {new Date().getDate()}
          </p>
        </div>
        <CustomButton variant="outline" className="bg-white">
          View Trend
        </CustomButton>
      </div>

      <div className="flex justify-center items-center">
        <img
          src={
            selectedStool
              ? selectedStool
              : "src/assets/images/stool-types/Type 1.png"
          }
          className="w-27 h-24.5 object-cover border border-custom-20 rounded-full shadow-sm"
          alt="Logo"
        />
      </div>

      <div className="px-5 flex flex-col gap-2">
        <CustomHeading label="Shape" isRequired />
        <span className="text-secondary font-rubik text-xs">
          Bristol Stool Scale
        </span>
        <div className="grid grid-cols-7 gap-5 mt-3">
          {stoolImages?.map((i, index) => {
            return (
              <div className="flex flex-col gap-3 items-center" key={index}>
                <img
                  src={i?.image}
                  className="w-10 h-9.5 object-cover rounded-full shadow-sm"
                  alt={i?.label}
                  onClick={() => i?.onclick()}
                />
                <p className="text-primary text-xs font-medium text-center capitalize">
                  {i?.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-5.5 flex flex-col gap-5">
        <CustomHeading label="Color" isRequired />
        <div className="flex justify-between items-center py-1">
          {colorOptions?.map((color, index) => {
            return (
              <div
                className="w-10.5 h-10 rounded-full shadow-xs flex items-center justify-center"
                style={{ backgroundColor: color.colorCode }}
              >
                <p className="text-white text-xs text-center">{color?.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-5.5 flex flex-col gap-5">
        <CustomHeading label="Amount" isRequired />
        <SegmentedControl
          labels={["Small", "Medium", "Large"]}
          onChange={(value) => console.log("Selected amount:", value)}
        />
      </div>

      <div className="px-5.5 flex flex-col gap-5">
        <CustomHeading label="Time" isRequired />
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
                className="px-4.5 py-3 w-fit"
              />
            );
          })}
        </CustomRadioGroup>
      </div>

      <div className="px-6 flex flex-col gap-5">
        <CustomHeading label="Frequency" isRequired />
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

      <div className="px-6.5 flex flex-col gap-5">
        <CustomHeading label="Time of Day" isRequired />
        <div className="flex gap-4">
          {timeOfTheDayOptions?.map((time, i) => {
            return (
              <CustomCheckbox label={time.label} value={time.value} key={i} />
            );
          })}
        </div>
      </div>

      <div className="px-6.5 flex flex-col gap-2">
        <CustomHeading label="Symptom Log" isRequired />
        <span className="text-custom-12 text-xs">
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

      <div className="px-6.5 flex flex-col gap-2">
        <CustomHeading
          label="Additional Status"
          isRequired
          requiredText="Required, Select ≥ 1"
        />
        <span className="text-custom-12 text-xs">Record observed status</span>
      </div>

      <div className="px-6.5 flex flex-col gap-4">
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
          className="w-10/12 mx-auto flex items-center justify-center text-white text-lg font-medium rounded-2xl bg-[#C69C6D] py-3 shadow-sm"
        >
          Save Record
        </button>
      </div>
    </div>
  );
};

export default StoolPage;
