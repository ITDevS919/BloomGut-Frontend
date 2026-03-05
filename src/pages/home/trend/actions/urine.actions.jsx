import axios from "axios";

export const getUrineScoreWeek = async ({ userId }) => {
    console.log(userId)
    const res = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/trend/urine/weeklyScore`, { params: { userId } });
    return res.data;
}

export const getUrineScoreBeforeWeek = async ({ userId }) => {
    const res = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/trend/urine/compareWeeklyScore`, { params: { userId } });
    return res.data;
}