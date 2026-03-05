import axios from "axios";

export const createStoolRecord = async (param) => {
    const res = await axios.put(`${import.meta.env.VITE_API_ENDPOINT}/record/bowel`, param);
    return res.data;
}