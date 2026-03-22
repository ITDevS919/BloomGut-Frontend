import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Lock, LockKeyhole, ChevronRight, Tag } from "lucide-react";
import { Search, Mic } from "lucide-react";
import { CustomCheckbox } from "@/components/custom/CustomCheckbox";
import CustomHeading from "@/components/custom/CustomHeading";
import { CustomButton } from "@/components/custom/CustomButton";
import { MdAccessibilityNew, MdHttps } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaAccessibleIcon, FaUtensils } from "react-icons/fa6";
import { FaGlassWhiskey } from "react-icons/fa";
import { CustomCheckboxWater } from "@/components/custom/CustomCheckbox(Water)";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import {
  getRecordDietToday,
  getTrendDietGutImpactCalendar,
  postRecordDiet,
  postThirdPartyDiet,
} from "@/api/http";
import { toast } from "sonner";

const InlineLoader = () => (
  <div className="dash-load-3">
    <span className="dash-line" />
    <span className="dash-line" />
    <span className="dash-line" />
  </div>
);

const DietRecord = (props) => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const [searchValue, setSearchValue] = useState("");
  const [state, setState] = useState("idle");
  const [clickedNutritionLabel, setClickedNutritionLabel] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [nutritionSummary, setNutritionSummary] = useState(null);
  const [gutImpactStatus, setGutImpactStatus] = useState("");
  const [gutAnalysis, setGutAnalysis] = useState("");
  const [eatTips, setEatTips] = useState([]);
  const [drinkTips, setDrinkTips] = useState([]);
  const [relaxTips, setRelaxTips] = useState([]);
  const [dietItems, setDietItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [dietLoading, setDietLoading] = useState(false);
  const savedDietLoadAbortRef = useRef(null);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [dateColors, setDateColors] = useState({});
  const [calendarLoading, setCalendarLoading] = useState(false);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const calendarDays = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }

    return calendarDays;
  };

  const getDateColor = (day) => {
    return dateColors[day] || null;
  };

  const getColorClass = (color) => {
    const colorMap = {
      green: "bg-[#66BB6A]",
      yellow: "bg-[#FFEB3B]",
      red: "bg-[#EF5350]",
      grey: "bg-[#BDBDBD]",
      pink: "bg-[#F8C8C8]"
    };
    return colorMap[color] || "";
  };

  const formatFoodLabel = (name) => {
    if (!name) return "";
    const lower = name.toLowerCase();
    if (lower.includes("milk")) return "Milk";
    if (lower.includes("toast")) return "Toast";
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const getFriendlyTagsForItem = (item) => {
    const tags = Array.isArray(item?.nutrient_tags) ? item.nutrient_tags : [];
    const friendly = [];

    const sperated = [];
    
    if (tags.includes("high_sugar")) {
      friendly.push("High Sugar");
    }
    if (tags.includes("high_saturated_fat")) {
      friendly.push("Saturated Fat");
    }
    if (tags.includes("processed_food")) {
      friendly.push("Processed");
    }
    if (tags.includes("high_carb")) {
      friendly.push("High Carb");
    }

    // Special case: high carb + low fiber → refined carbs style wording
    if (tags.includes("high_carb") && tags.includes("low_fiber")) {
      friendly.push("Refined Carbs");
    }

    return friendly;
  };

  const getGutImpactFromItems = (items) => {
    const allTags = items.flatMap((it) => it?.nutrient_tags || []);
    const hasHighSugar = allTags.includes("high_sugar");
    const hasLowFiber = allTags.includes("low_fiber");

    // Default
    let status = "";
    let message = "";

    if (!items.length) {
      return { status, message };
    }

    // Match the example for "Low-fat milk & toast"
    if (hasHighSugar || hasLowFiber) {
      status = "Neutral";
      message = "This meal may cause gut discomfort due to high sugar or low fiber";
    } else {
      status = "Neutral";
      message = "This meal looks generally balanced for gut comfort.";
    }

    return { status, message };
  };

  const getGutImpactBadgeColor = (status) => {
    if (status === "Beneficial") return "bg-[#66BB6A]";
    if (status === "Irritating") return "bg-[#EF5350]";
    if (status === "Neutral") return "bg-[#FFEB3B]";
    return "bg-[#BDBDBD]";
  };

  // Load gut impact calendar colors from backend whenever month changes
  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchCalendar = async () => {
      setCalendarLoading(true);
      try {
        const response = await getTrendDietGutImpactCalendar(api, {
          params: {
            userId: auth.user.id,
            referenceDate: currentDate.toISOString(),
            timezoneOffsetMinutes: new Date().getTimezoneOffset(),
          },
        });
        const payload = response.data?.data ?? response.data;
        if (payload && payload.dateColors && typeof payload.dateColors === "object") {
          setDateColors(payload.dateColors);
        } else {
          setDateColors({});
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load diet gut impact calendar:", error);
        setDateColors({});
      } finally {
        setCalendarLoading(false);
      }
    };

    fetchCalendar();
  }, [api, auth?.user?.id, currentDate]);

  // Load saved diet entries for today (same calendar day / timezone as trend charts)
  useEffect(() => {
    if (!auth?.user?.id) return;
    if ((props.recordResult || "").trim()) return;

    const ac = new AbortController();
    savedDietLoadAbortRef.current = ac;

    const loadTodaySaved = async () => {
      setDietLoading(true);
      try {
        const response = await getRecordDietToday(api, {
          params: {
            userId: auth.user.id,
            referenceDate: new Date().toISOString(),
            timezoneOffsetMinutes: new Date().getTimezoneOffset(),
          },
          signal: ac.signal,
        });
        const records = response.data?.data ?? response.data;
        if (!Array.isArray(records) || records.length === 0) return;

        const mergedItems = records.flatMap((r) => (Array.isArray(r.items) ? r.items : []));
        const mergedTotals = records.reduce(
          (acc, r) => {
            const t = r.totals || {};
            acc.calories += Number(t.calories || 0);
            acc.protein_g += Number(t.protein_g || 0);
            acc.fat_g += Number(t.fat_g || 0);
            acc.carb_g += Number(t.carb_g || 0);
            acc.fiber_g += Number(t.fiber_g || 0);
            acc.sugar_g += Number(t.sugar_g || 0);
            acc.sodium_mg += Number(t.sodium_mg || 0);
            return acc;
          },
          {
            calories: 0,
            protein_g: 0,
            fat_g: 0,
            carb_g: 0,
            fiber_g: 0,
            sugar_g: 0,
            sodium_mg: 0,
          }
        );

        const prompts = records.map((r) => (typeof r.prompt === "string" ? r.prompt.trim() : "")).filter(Boolean);
        if (prompts.length) {
          setSearchValue(prompts.join(" · "));
        }

        setDietItems(mergedItems);
        setNutritionSummary({
          totals: mergedTotals,
          itemCount: mergedItems.length,
        });

        const gutImpact = getGutImpactFromItems(mergedItems);
        setGutImpactStatus(gutImpact.status);
        setGutAnalysis(gutImpact.message);

        if (mergedItems.length) {
          setClickedNutritionLabel(true);
        }
      } catch (error) {
        if (error?.code === "ERR_CANCELED" || error?.name === "CanceledError") return;
        // eslint-disable-next-line no-console
        console.error("Failed to load saved diet records:", error);
      } finally {
        if (!ac.signal.aborted) {
          setDietLoading(false);
        }
      }
    };

    loadTodaySaved();
    return () => {
      ac.abort();
    };
  }, [api, auth?.user?.id, props.recordResult]);

  const handleSearch = async (value) => {
    const trimmed = (value || "").trim();
    if (!trimmed) return;
    savedDietLoadAbortRef.current?.abort();
    setState("submitting");
    setDietLoading(true);
    try {
      const response = await postThirdPartyDiet(api, {
        prompt: trimmed,
      });
      const payload = response.data?.data || response.data;
      const items = Array.isArray(payload?.items) ? payload.items : [];
      if (!items.length) {
        setNutritionSummary(null);
        setGutImpactStatus("");
        setGutAnalysis("");
        setEatTips([]);
        setDrinkTips([]);
        setRelaxTips([]);
        return;
      }

      const totals = payload?.totals
        ? {
          calories: Number(payload.totals.calories || 0),
          protein_g: Number(payload.totals.protein_g || 0),
          fat_g: Number(payload.totals.fat_g || 0),
          carb_g: Number(payload.totals.carb_g || 0),
          fiber_g: Number(payload.totals.fiber_g || 0),
          sugar_g: Number(payload.totals.sugar_g || 0),
          sodium_mg: Number(payload.totals.sodium_mg || 0),
        }
        : items.reduce(
          (acc, item) => ({
            calories: acc.calories + (item.calories || 0),
            protein_g: acc.protein_g + (item.protein_g || 0),
            fat_g: acc.fat_g + (item.fat_g || 0),
            carb_g: acc.carb_g + (item.carb_g || 0),
            fiber_g: acc.fiber_g + (item.fiber_g || 0),
            sugar_g: acc.sugar_g + (item.sugar_g || 0),
            sodium_mg: acc.sodium_mg + (item.sodium_mg || 0),
          }),
          {
            calories: 0,
            protein_g: 0,
            fat_g: 0,
            carb_g: 0,
            fiber_g: 0,
            sugar_g: 0,
            sodium_mg: 0,
          }
        );

      setDietItems(items);

      setNutritionSummary({
        totals,
        itemCount: items.length,
      });

      const gutImpact = getGutImpactFromItems(items);
      setGutImpactStatus(gutImpact.status);
      setGutAnalysis(gutImpact.message);

      // Simple gut impact heuristics based on totals
      const gutMessages = [];
      const eatFromHeuristics = [];
      const drink = [];
      const relax = [];

      if (totals.fiber_g < 20) {
        gutMessages.push("Fiber intake looks on the low side for the day.");
        eatFromHeuristics.push("Add more vegetables, fruits, or whole grains to increase fiber for smoother digestion.");
      } else {
        gutMessages.push("Fiber intake is roughly within a gut‑friendly range.");
      }

      if (totals.sugar_g > 40) {
        gutMessages.push("Added sugar is relatively high, which may upset blood sugar and gut balance.");
        eatFromHeuristics.push("Reduce sugary drinks and desserts; swap for fruit or unsweetened options where possible.");
      }

      if (totals.sodium_mg > 2300) {
        gutMessages.push("Sodium is on the high side, which may increase bloating and water retention.");
        eatFromHeuristics.push("Limit processed or very salty foods at your next meals.");
        drink.push("Drink extra water across the day to help flush excess sodium.");
      }

      if (totals.calories < 800) {
        gutMessages.push("Total calories are quite low; make sure you are not under‑fueling.");
        eatFromHeuristics.push("Include a balanced meal with protein, complex carbs, and healthy fats.");
      }

      // We now rely on tag‑based gut impact messaging above for the UI example;
      // keep this as a softer, aggregate note if needed.
      if (!gutMessages.length) {
        gutMessages.push("Today’s foods look generally balanced for gut comfort.");
      }

      if (!drink.length) {
        drink.push("Sip water regularly with meals and between them to support digestion and urine clarity.");
      }

      if (!relax.length) {
        relax.push("Take 5–10 minutes after meals for gentle walking or deep breathing to support digestion.");
      }

      // If tag‑based gut analysis has not set a message, fall back to this aggregate text.
      if (!gutImpact.message) {
        setGutAnalysis(gutMessages.join(" "));
      }

      const eatTipsFromApi = Array.isArray(payload?.eatTips) ? payload.eatTips.filter((t) => typeof t === "string" && t.trim()) : [];
      setEatTips(eatTipsFromApi.length ? eatTipsFromApi : eatFromHeuristics);
      setDrinkTips(drink);
      setRelaxTips(relax);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to analyze diet:", error);
      setNutritionSummary(null);
      setGutImpactStatus("");
      setGutAnalysis("");
      setEatTips([]);
      setDrinkTips([]);
      setRelaxTips([]);
    } finally {
      setDietLoading(false);
      setState("idle");
    }
  };

  const handleVoiceInput = () => {
    // Trigger your existing voice recognition
    props.setRecordUI("food record");
  };

  const handleViewTrend = () => {
    navigate("/trend-analysis", { state: { trendType: "diet" } });
  };

  // When voice recording in FoodRecord finishes, automatically
  // set the text and trigger analysis once.
  useEffect(() => {
    const trimmed = (props.recordResult || "").trim();
    if (!trimmed) return;
    setSearchValue(trimmed);
    handleSearch(trimmed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.recordResult]);

  return (
    <div className="bg-ivory min-h-full p-6 text-primary flex flex-col">
      <div className="flex items-center gap-4 mb-[27px]">
        <button
          type="button"
          className="text-primary text-xl leading-none w-12 h-12 flex items-center justify-center"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none cursor-pointer " />
        </button>
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Diet Record</h2>
      </div>

      {!clickedNutritionLabel && <>
        <div className="flex justify-between mb-10">
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
      </>}
      <>
        {/* Search Bar */}
        {(clickedNutritionLabel || props.recordResult) && <>

          <div className="flex justify-center">
            <div className="relative flex items-center bg-white rounded-full shadow-md overflow-hidden w-full max-w-md mb-5">
              {/* Magnifying Glass Icon */}
              <div className="pl-4 pr-3 flex items-center">
                <Search className="w-5 h-5" style={{ color: "#a78bfa" }} />
              </div>

              {/* Vertical Separator */}
              <div className="h-6 w-px bg-gray-300"></div>

              {/* Input Field */}
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Enter food (e.g., chicken rice)"
                className="flex-1 px-4 py-4 text-sm outline-none placeholder:text-custom-12 text-gray-700 bg-transparent"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch(searchValue);
                  }
                }}
              />

              {/* Microphone Icon */}
              <button
                type="button"
                onClick={handleVoiceInput}
                className="pr-4 pl-3 flex items-center hover:opacity-70 transition-opacity"
                aria-label="Voice input"
              >
                <Mic className="w-5 h-5" style={{ color: "#a78bfa" }} />
              </button>
            </div>

          </div>
          {!searchValue && (
            <div className="text-secondary text-center text-sm mb-[11px]">
              💡 You can enter a full sentence like: 'I had     eggs and vegetables for breakfas
            </div>
          )}

          <div className="text-custom-12 text-center text-xs mb-[46px]">
            Nutrition label generated automatically
          </div>

        </>}


      </>
      <div className="flex flex-col gap-4 text-primary font-medium mb-3">
        Nutrition Label
      </div>
      <div className={`bg-white rounded-[27px] shadow-[0_2px_4px_rgba(0,0,0,0.15)] p-6 text-custom-12 ${searchValue ? "mb-[10px]" : "mb-[28px]"}`}
        onClick={() => setClickedNutritionLabel(true)}
      >
        {dietLoading && (
          <div className="flex justify-center items-center py-1">
            <InlineLoader />
          </div>
        )}
        {!dietLoading && dietItems.length > 0 && (
          <div className="text-sm space-y-3">
            {dietItems.map((item, idx) => {
              const friendlyTags = getFriendlyTagsForItem(item);
              return (
                <div key={`${item.food_name || idx}-${idx}`} className="flex">
                  <span className="font-medium mr-1 text-secondary">{item.food_name}:</span>
                  <span><Tag className="rotate-90 w-4 h-4 text-[#F8DE8A]"/></span>
                  <span className="text-xs text-secondary">
                    {item.nutrient_tags ? item.nutrient_tags.join(", ") : "No special flags"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        {!dietLoading && !dietItems.length && (
          <span>No data yet, record your first meal</span>
        )}
      </div>
      {searchValue &&
        <div className="text-xs text-custom-12 text-center mb-[28px] italic">
          This label is estimated by the system based on the default word bank, not the actual query result
        </div>
      }

      <div className="flex flex-col gap-1 text-primary font-medium mb-3">
        Gut Impact Analysis
        <span className="text-xs font-normal text-secondary">
          Suggestions based on general health principles
        </span>
      </div>
      <div className="bg-white rounded-[27px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] p-6 text-custom-12 text-sm mb-[28px]">
        {dietLoading && (
          <div className="flex justify-center items-center py-1">
            <InlineLoader />
          </div>
        )}
        {!dietLoading && gutImpactStatus && gutAnalysis && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-primary">Current Impact:</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-primary">{gutImpactStatus}</span>
                <span className={`w-3 h-3 rounded-full ${getGutImpactBadgeColor(gutImpactStatus)}`} />
              </div>
            </div>
            <p className="text-sm text-primary">{gutAnalysis}</p>
          </div>
        )}
        {!dietLoading && !gutImpactStatus && !gutAnalysis && (
          <p>No records yet, start your log</p>
        )}
      </div>

      {searchValue &&
        <>
          <div className="flex items-center gap-2 text-primary font-medium mb-3">
            How to Eat
            <FaUtensils color="#6aa84f" />
          </div>
          <div className="bg-white rounded-[27px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] p-6 text-custom-12 text-sm mb-[28px]">
            <div className="flex flex-col space-y-2 text-xs text-custom-12">
              {dietLoading ? (
                <div className="flex justify-center items-center py-1">
                  <InlineLoader />
                </div>
              ) : eatTips.length ? (
                eatTips.map((tip, idx) => <p key={idx}>{tip}</p>)
              ) : (
                <>
                  <p>Eat high-fiber veggies & quality protein.</p>
                  <p>Limit sodium & refined carbs.</p>
                </>
              )}
            </div>
          </div>
        </>
      }

      {searchValue &&
        <>
          <div className="flex items-center gap-2 text-primary font-medium mb-3">
            How to Drink
            <FaGlassWhiskey color="#6fa8dc" />
          </div>
          <div className="bg-white rounded-[27px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] p-6 text-custom-12 text-sm mb-[28px]">
            <div className="flex flex-col space-y-2 text-xs text-custom-12">
              {dietLoading ? (
                <div className="flex justify-center items-center py-1">
                  <InlineLoader />
                </div>
              ) : drinkTips.length ? (
                drinkTips.map((tip, idx) => <p key={idx}>{tip}</p>)
              ) : (
                <>
                  <p>Drink 300ml water before 10 AM.</p>
                  <p>Sip 2-3 times to prevent bloating.</p>
                </>
              )}
            </div>
          </div>
        </>
      }

      {searchValue &&
        <>
          <div className="flex items-center gap-2 text-primary font-medium mb-3">
            How to Relax
            <MdAccessibilityNew size={24} color="#e69138" />
          </div>
          <div className="bg-white rounded-[27px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] p-6 text-custom-12 text-sm mb-[28px]">
            <div className="flex flex-col space-y-2 text-xs text-custom-12">
              {dietLoading ? (
                <div className="flex justify-center items-center py-1">
                  <InlineLoader />
                </div>
              ) : relaxTips.length ? (
                relaxTips.map((tip, idx) => <p key={idx}>{tip}</p>)
              ) : (
                <>
                  <p>Take short breaks for gentle stretching or a brief walk after meals.</p>
                  <p>Practice slow breathing for 5 minutes to help your gut relax.</p>
                </>
              )}
            </div>
          </div>
        </>
      }



      <div className="flex flex-col gap-4 text-primary  mb-3 ">
        <CustomHeading label="Daily Progress" isRequired />
        {!clickedNutritionLabel ?
          <>
            <div className="bg-white rounded-[27px] shadow-[0_2px_4px_rgba(0,0,0,0.15)] p-6 text-custom-12 mb-[28px] text-sm">
              Complete your food and symptoms log to see progress
            </div>
          </> : <>
            <div className="flex flex-col gap-2">
              <CustomCheckboxWater label="Breakfast" borderColor="#b3a2d0" checkColor="#b3a2d0" />
              <CustomCheckboxWater label="Lunch" borderColor="#b3a2d0" checkColor="#b3a2d0" />
              <CustomCheckboxWater label="Dinner" borderColor="#b3a2d0" checkColor="#b3a2d0" />
            </div>
          </>}
      </div>

      <div className="flex flex-col gap-4 text-primary font-medium mb-4 mt-5">
        Gut Impact Records
      </div>

      {!clickedNutritionLabel ? (
        <div className="bg-white rounded-[27px] shadow-[0_2px_4px_rgba(0,0,0,0.15)] p-6 text-custom-12 mb-[28px] text-sm">
          No records found
        </div>
      ) : (
        <>
          {searchValue ? (
            <div className="rounded-[27px]  p-2 mb-[28px]">
              {calendarLoading ? (
                <div className="flex flex-col items-center justify-center py-4 text-xs text-secondary gap-2">
                  <InlineLoader />
                  <span>Loading gut impact calendar…</span>
                </div>
              ) : (
              <>
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => navigateMonth("prev")}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="w-5 h-5 text-primary" />
                  </button>
                  <h3 className="text-lg font-medium text-primary">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h3>
                  <button
                    onClick={() => navigateMonth("next")}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Next month"
                  >
                    <ChevronRight className="w-5 h-5 text-primary" />
                  </button>
                </div>

                {/* Days of Week Header */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs text-gray-600 font-medium py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {renderCalendar().map((day, index) => {
                    const color = day ? getDateColor(day) : null;
                    return (
                      <div
                        key={index}
                        className={`aspect-square flex items-center justify-center text-sm ${day ? "cursor-pointer hover:bg-gray-50 rounded-full" : ""
                          }`}
                      >
                        {day && (
                          color === "pink" ? (
                            <div
                              className={`w-8 h-8 flex items-center justify-center ${getColorClass(
                                color
                              )} text-white`}
                              style={{
                                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                              }}
                            >
                              {day}
                            </div>
                          ) : (
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${color
                                  ? `${getColorClass(color)} text-white`
                                  : "text-secondary"
                                }`}
                            >
                              {day}
                            </div>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-secondary">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#66BB6A]" />
                    <span>Beneficial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FFEB3B]" />
                    <span>Neutral</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#EF5350]" />
                    <span>Irritating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#BDBDBD]" />
                    <span>Unrecorded</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#F8C8C8]" />
                    <span>Incomplete</span>
                  </div>
                </div>

                {/* Instruction Text */}
                <p className="text-xs text-custom-12 text-center mt-4">
                  Click on calendar date/expand for details
                </p>
              </>
              )}
            </div>
          ) : (
            <div className="mb-[40px] mt-[40px] text-sm text-custom-12">
              No records found
            </div>
          )}
        </>
      )}

      <div className="text-primary mt-5 mb-[63px]">
        <div className="font-medium">Gut Trends</div>
        <div className="flex justify-center bg-white rounded-[27px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-6 mt-3">
          <div className="bg-gray-200 rounded-[24px] h-12 w-56 text-center flex items-center justify-center text-sm">
            Unlocks in 3 days &nbsp;&nbsp;&nbsp;&nbsp;
            <MdHttps className="text-custom-9 w-[24px] h-[24px]" />
          </div>
        </div>
      </div>


      <button
        type="button"
        className="w-[242px] mx-auto transition-all duration-150 active:scale-[0.98] active:shadow-[0_4px_10px_rgba(0,0,0,0.18)] min-h-[48px] flex items-center justify-center text-white text-base rounded-[24px] bg-[#C69C6D] py-3 shadow-[0_4px_10px_rgba(0,0,0,0.18)] mt-5 disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={saving || !searchValue || !nutritionSummary}
        onClick={async () => {
          if (!auth?.user?.id) {
            toast.error("You must be logged in to save diet records.");
            return;
          }
          if (!searchValue || !nutritionSummary) {
            toast.error("Please enter a meal description and analyze it first.");
            return;
          }
          try {
            setSaving(true);
            const res = await postRecordDiet(api, {
              userId: auth.user.id,
              prompt: searchValue,
              items: dietItems,
              totals: nutritionSummary.totals,
            });
            const message = res.data?.data ?? res.data;
            toast.success(
              typeof message === "string"
                ? message
                : "Diet record saved successfully."
            );
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Failed to save diet record:", error);
            toast.error("Failed to save diet record. Please try again.");
          } finally {
            setSaving(false);
          }
        }}
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default DietRecord;
