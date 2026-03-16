import axios from "axios";
import { toLocalISOString } from "@/utils/time";

export const getUrineScoreWeek = async ({ userId, referenceDate }) => {
  const ref = toLocalISOString(referenceDate || new Date());
  const res = await axios.get(
    `${import.meta.env.VITE_API_ENDPOINT}/trend/urine/weeklyScore`,
    { params: { userId, referenceDate: ref } }
  );
  return res.data;
};

export const getUrineScoreBeforeWeek = async ({ userId, referenceDate }) => {
  const ref = toLocalISOString(referenceDate || new Date());
  const res = await axios.get(
    `${import.meta.env.VITE_API_ENDPOINT}/trend/urine/compareWeeklyScore`,
    { params: { userId, referenceDate: ref } }
  );
  return res.data;
};
