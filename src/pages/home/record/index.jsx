import DietRecord from "./DietRecord";
import { useState } from "react";
import FoodRecord from "./FoodRecord";

const Record = () => {
  const [recordUI, setRecordUI] = useState("diet record");
  const [recordResult, setRecordResult] = useState(null);
  return (
    <main>
      {recordUI == "diet record" ? (
        <DietRecord setRecordUI={setRecordUI} recordResult={recordResult} />
      ) : (
        <FoodRecord setRecordUI={setRecordUI} setRecordResult={setRecordResult} />
      )}
    </main>
  );
};

export default Record;
