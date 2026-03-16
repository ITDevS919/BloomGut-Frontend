import axios from "axios";

export const getUrineScoreWeek = async ({ userId, referenceDate }) => {
    const ref = referenceDate ? referenceDate.toISOString() : new Date().toISOString();
    const res = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/trend/urine/weeklyScore`,
        {
            params: {
                userId,
                referenceDate: ref,
                timezoneOffsetMinutes: new Date().getTimezoneOffset(),
            },
        }
    );
    return res.data;
}

export const getUrineScoreBeforeWeek = async ({ userId, referenceDate }) => {
    const ref = referenceDate ? referenceDate.toISOString() : new Date().toISOString();
    const res = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/trend/urine/compareWeeklyScore`,
        {
            params: {
                userId,
                referenceDate: ref,
                timezoneOffsetMinutes: new Date().getTimezoneOffset(),
            },
        }
    );
    return res.data;
}