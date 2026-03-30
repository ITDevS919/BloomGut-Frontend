/**
 * Single source of truth for backend HTTP calls. Pass the axios instance from useApiClient().
 * @param {import("axios").AxiosInstance} client
 */

export const getTrendBowelDailyCount = (client, config) =>
  client.get("/trend/bowel/dailyCount", config);

export const getTrendBowelWeeklySummary = (client, config) =>
  client.get("/trend/bowel/weeklySummary", config);

export const getTrendBowelMonthlySummary = (client, config) =>
  client.get("/trend/bowel/monthlySummary", config);

export const postTrendBowelWeeklyAdvice = (client, data, config) =>
  client.post("/trend/bowel/weeklyAdvice", data, config);

export const putRecordBowel = (client, data, config) =>
  client.put("/record/bowel", data, config);

export const getRecordBowelRecent = (client, config) =>
  client.get("/record/bowel/recent", config);

export const getTrendDietGutImpactCalendar = (client, config) =>
  client.get("/trend/diet/gutImpactCalendar", config);

export const getRecordDietToday = (client, config) =>
  client.get("/record/diet/today", config);

export const postThirdPartyDiet = (client, data, config) =>
  client.post("/third-party/diet", data, config);

export const postRecordDiet = (client, data, config) =>
  client.post("/record/diet", data, config);

export const getUserProfile = (client, config) =>
  client.get("/user/profile", config);

export const postUserProfile = (client, data, config) =>
  client.post("/user/profile", data, config);

export const getTrendDietTodayScore = (client, config) =>
  client.get("/trend/diet/todayScore", config);

export const getTrendDietPeriodSummary = (client, config) =>
  client.get("/trend/diet/periodSummary", config);

export const getTrendDietDailySummary = (client, config) =>
  client.get("/trend/diet/dailySummary", config);

export const getTrendUrineWeeklyScore = (client, config) =>
  client.get("/trend/urine/weeklyScore", config);

export const getTrendDietCategory = (client, config) =>
  client.get("/trend/diet/category", config);

export const getTrendDietMacroWeekly = (client, config) =>
  client.get("/trend/diet/macroWeekly", config);

export const getTrendBowelDailyTrendForDiet = (client, config) =>
  client.get("/trend/bowel/dailyTrendForDiet", config);

export const getTrendWaterDailyMl = (client, config) =>
  client.get("/trend/water/dailyMl", config);

export const getTrendWaterMonthlyTime = (client, config) =>
  client.get("/trend/water/monthlyTime", config);

export const postTrendWaterMonthlyAdvice = (client, data, config) =>
  client.post("/trend/water/monthlyAdvice", data, config);

export const getTrendWaterWeeklyTime = (client, config) =>
  client.get("/trend/water/weeklyTime", config);

export const postTrendWaterWeeklyAdvice = (client, data, config) =>
  client.post("/trend/water/weeklyAdvice", data, config);

export const postTrendBowelPremiumWeekAdvice = (client, data, config) =>
  client.post("/trend/bowel/premiumWeekAdvice", data, config);

export const postTrendBowelPremiumMonthAdvice = (client, data, config) =>
  client.post("/trend/bowel/premiumMonthAdvice", data, config);

export const getTrendBowelYearlyTopFoods = (client, config) =>
  client.get("/trend/bowel/yearlyTopFoods", config);

export const getTrendBowelYearlyTrend = (client, config) =>
  client.get("/trend/bowel/yearlyTrend", config);

export const postTrendBowelPremiumYearAdvice = (client, data, config) =>
  client.post("/trend/bowel/premiumYearAdvice", data, config);

export const postTrendDietWeeklyAdvice = (client, data, config) =>
  client.post("/trend/diet/weeklyAdvice", data, config);

export const getTrendUrineCompareWeeklyScore = (client, config) =>
  client.get("/trend/urine/compareWeeklyScore", config);

export const postTrendUrineHealthTips = (client, data, config) =>
  client.post("/trend/urine/healthTips", data, config);

export const getTrendWaterMonthlyWeeks = (client, config) =>
  client.get("/trend/water/monthlyWeeks", config);

export const getTrendBowelMonthlyTime = (client, config) =>
  client.get("/trend/bowel/monthlyTime", config);

export const getTrendWaterWeeklySummary = (client, config) =>
  client.get("/trend/water/weeklySummary", config);

export const putRecordUrine = (client, data, config) =>
  client.put("/record/urine", data, config);

export const getRecordUrineRecent = (client, config) =>
  client.get("/record/urine/recent", config);

export const getTrendUrineMonthlyDailyVolume = (client, config) =>
  client.get("/trend/urine/monthlyDailyVolume", config);

export const getTrendUrineYearlySummary = (client, config) =>
  client.get("/trend/urine/yearlySummary", config);

export const postTrendUrineMonthlyAdvice = (client, data, config) =>
  client.post("/trend/urine/monthlyAdvice", data, config);

export const postTrendDietMonthlyAdvice = (client, data, config) =>
  client.post("/trend/diet/monthlyAdvice", data, config);

export const getTrendUrineWeeklyDayNight = (client, config) =>
  client.get("/trend/urine/weeklyDayNight", config);

export const postTrendUrineWeeklyAdvice = (client, data, config) =>
  client.post("/trend/urine/weeklyAdvice", data, config);

export const getRecordWaterToday = (client, config) =>
  client.get("/record/water/today", config);

export const putRecordWater = (client, data, config) =>
  client.put("/record/water", data, config);

export const getTrendDietYearlySummary = (client, config) =>
  client.get("/trend/diet/yearlySummary", config);

export const postTrendDietYearlyAdvice = (client, data, config) =>
  client.post("/trend/diet/yearlyAdvice", data, config);

export const getTrendWaterYearlySummary = (client, config) =>
  client.get("/trend/water/yearlySummary", config);

export const postTrendUrineYearlyAdvice = (client, data, config) =>
  client.post("/trend/urine/yearlyAdvice", data, config);

export const getTrendWaterMonthlyDailyMl = (client, config) =>
  client.get("/trend/water/monthlyDailyMl", config);

export const getSettingApp = (client, config) =>
  client.get("/setting/app", config);

export const postSettingApp = (client, data, config) =>
  client.post("/setting/app", data, config);
