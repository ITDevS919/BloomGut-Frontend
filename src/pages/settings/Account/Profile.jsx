import { ChevronLeft, Pencil } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import useApiClient from "@/hooks/useApiClient";
import { toast } from "sonner";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const [year, setYear] = useState(years[0]);
  const [month, setMonth] = useState(months[0]);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const styles = {
    page: {
      padding: 20,
      maxWidth: 420,
      margin: "0 auto",
      fontFamily: "sans-serif",
      color: "#4b332d",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 24,
    },
    back: { fontSize: 20, cursor: "pointer" },
    title: { fontSize: 20, fontWeight: 600 },
    avatarWrap: { display: "flex", justifyContent: "center" },
    avatar: {
      width: 112,
      height: 112,
      borderRadius: "50%",
      background: "#e9ece8",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
      position: "relative",
    },
    editBtn: {
      position: "absolute",
      right: 5,
      bottom: 5,
      width: 30,
      height: 30,
      borderRadius: "50%",
      background: "#5d4037",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      cursor: "pointer",
    },
    form: { display: "flex", flexDirection: "column", gap: 16 },
    label: { display: "block", fontSize: 16, color: "#705d56", marginBottom: "8px" },
    required: { color: "#c33", marginRight: 6 },
    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid #e6e0dc",
      background: "white",
    },
    radios: { display: "flex", gap: 16, alignItems: "center", marginTop: 6 },
    birthdayRow: { display: "flex", gap: 12, alignItems: "center" },
    select: {
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid #e6e0dc",
      background: "white",
    },
    saveBtn: {
      marginTop: 18,
      background: "#C69C6D",
      color: "white",
      padding: "12px 16px",
      borderRadius: 12,
      border: "none",
      cursor: "pointer",
    },
  };

  const auth = useSelector((state) => state.auth);
  const { user } = useUser();
  const api = useApiClient();
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(auth?.user?.imageUrl || "");
  const [avatarLoading, setAvatarLoading] = useState(true);

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Local preview
    const previewUrl = URL.createObjectURL(file);
    if (avatarUrl && avatarUrl.startsWith("blob:")) {
      URL.revokeObjectURL(avatarUrl);
    }
    setAvatarLoading(true);
    setAvatarUrl(previewUrl);

    if (!user) {
      toast.error("You must be logged in to change your avatar.");
      return;
    }

    try {
      const updatedUser = await user.setProfileImage({ file });
      const finalUrl =
        updatedUser?.profileImageUrl || updatedUser?.imageUrl || avatarUrl;

      if (finalUrl) {
        if (previewUrl && previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl);
        }
        setAvatarUrl(finalUrl);
      }
      // toast.success("Avatar updated.");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to update avatar in Clerk:", error);
      toast.error("Failed to update avatar. Please try again.");
    }
  };

  useEffect(() => {
    return () => {
      if (avatarUrl && avatarUrl.startsWith("blob:"))
        URL.revokeObjectURL(avatarUrl);
    };
  }, [avatarUrl]);
  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/profile", {
          params: { userId: auth.user.id },
        });
        const payload = res.data?.data ?? res.data;
        if (!payload) {
          // fall back to auth user
          setUsername(auth?.user?.username || auth?.user?.firstName || "");
          setEmail(
            auth?.user?.primaryEmailAddress ||
              auth?.user?.emailAddresses?.[0] ||
              ""
          );
          return;
        }

        setUsername(payload.username || "");
        setEmail(payload.email || "");
        if (payload.gender)
          setGender(
            typeof payload.gender === "string"
              ? payload.gender.toLowerCase()
              : payload.gender
          );
        if (payload.dob) {
          const d = new Date(payload.dob);
          if (!Number.isNaN(d.getTime())) {
            setYear(String(d.getFullYear()));
            setMonth(String(d.getMonth() + 1).padStart(2, "0"));
          }
        }
        if (payload.height != null) setHeight(String(payload.height));
        if (payload.weight != null) setWeight(String(payload.weight));
        if (payload.avatar) {
          setAvatarLoading(true);
          setAvatarUrl(payload.avatar);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load user profile:", error);
      }
    };

    fetchProfile();
  }, [api, auth?.user?.emailAddresses, auth?.user?.firstName, auth?.user?.id, auth?.user?.primaryEmailAddress, auth?.user?.username]);

  const submit = async (e) => {
    e.preventDefault();
    if (!auth?.user?.id) {
      toast.error("You must be logged in to update your profile.");
      return;
    }
    try {
      setIsSaving(true);
      const dobIso = `${year}-${month}-01T00:00:00.000Z`;
      const normalizedGender =
        typeof gender === "string" && gender.trim()
          ? gender.trim().toUpperCase()
          : undefined;
      await api.post("/user/profile", {
        userId: auth.user.id,
        username,
        email,
        gender: normalizedGender,
        dob: dobIso,
        height,
        weight,
      });
      toast.success("Profile updated.");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
    finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <style>{`
        input[type="radio"][name="gender"] {
          appearance: none;
          width: 16px;
          height: 16px;
          border: 2px solid #d1d5db;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          position: relative;
        }
        input[type="radio"][name="gender"]:checked {
          border-color: #C69C6D;
        }
        input[type="radio"][name="gender"]:checked::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #C69C6D;
        }
      `}</style>
      <div className="bg-ivory min-h-full p-6 text-primary">
        <div className="flex items-center gap-4 mb-[66px]">
          <button
            type="button"
            className="text-primary text-xl leading-none"
            aria-label="back"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="text-primary text-[40px] leading-none cursor-pointer " />
          </button>
          <h2 className="text-lg font-['Roboto', sans-serif]">Profile Settings</h2>
        </div>

        <div style={styles.avatarWrap} className="mb-[43px]">
          <div style={styles.avatar} className="relative">
            <div style={{ fontSize: 36, color: "#6b4d43" }}>
              {avatarLoading && (
                <div className="absolute inset-0 rounded-full bg-[#e9ece8] flex items-center justify-center animate-pulse">
                  <span className="text-[#c4b8aa] text-3xl">• • •</span>
                </div>
              )}
              <img
                src={avatarUrl || auth?.user?.imageUrl}
                className="rounded-full"
                width="100px"
                height="100px"
                alt="Profile avatar"
                onLoad={() => setAvatarLoading(false)}
                onError={() => setAvatarLoading(false)}
              />
            </div>
            <div
              style={styles.editBtn}
              title="Edit avatar"
              onClick={(e) => {
                e.stopPropagation();
                setShowAvatarMenu((s) => !s);
              }}
            >
              <FaPencilAlt className="text-white text-[12px] leading-none" />
            </div>

            {showAvatarMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "120%",
                  right: -6,
                  background: "white",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                  borderRadius: 8,
                  overflow: "hidden",
                  minWidth: 180,
                  zIndex: 80,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                  /* reuse select flow */ setShowAvatarMenu(false);
                    fileInputRef.current &&
                      fileInputRef.current.removeAttribute("capture");
                    fileInputRef.current && fileInputRef.current.click();
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: 12,
                    border: "none",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  Change Avatar
                </button>
                <button
                  onClick={() => {
                    setShowAvatarMenu(false);
                    if (fileInputRef.current) {
                      fileInputRef.current.setAttribute("capture", "environment");
                      fileInputRef.current.click();
                    }
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: 12,
                    border: "none",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  Take Photo
                </button>
                <button
                  onClick={() => {
                    setShowAvatarMenu(false);
                    fileInputRef.current &&
                      fileInputRef.current.removeAttribute("capture");
                    fileInputRef.current && fileInputRef.current.click();
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: 12,
                    border: "none",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  Select Image
                </button>
                <button
                  onClick={() => {
                    if (!confirm("Delete current avatar?")) return;
                    setAvatarUrl("");
                    setShowAvatarMenu(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: 12,
                    border: "none",
                    background: "white",
                    cursor: "pointer",
                    color: "#c33",
                  }}
                >
                  Delete Current Avatar
                </button>
              </div>
            )}
          </div>
        </div>

        <form style={styles.form} onSubmit={submit}>
          <div className="mb-[20px]">
            <label style={styles.label}>
              <span style={styles.required}>*</span>Username or{" "}
              <small style={{ color: "#4b5563" }}>Nickname</small>
            </label>
            <input
              className="w-full text-sm placeholder-custom-12 bg-white px-4 py-3 rounded-[8px] border border-[#ccc]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nickname"
            />
          </div>

          <div className="mb-[20px]">
            <label style={styles.label}>
              <span style={styles.required}>*</span>Email:{" "}
              <small style={{ color: "#4b5563" }}>
                Please enter your email address
              </small>
            </label>
            <input
              className="w-full text-sm placeholder-custom-12 bg-white px-4 py-3 rounded-[8px] border border-[#ccc]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-[20px]">
            <label style={styles.label}>
              <span style={styles.required}>*</span>Gender:
            </label>
            <div className="flex gap-6 items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <span className="text-base text-secondary">Male</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <span className="text-base text-secondary">Female</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={gender === "other"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <span className="text-base text-secondary">Other</span>
              </label>
            </div>
          </div>

          <div className="mb-[20px]">
            <label style={styles.label}>
              <span style={styles.required}>*</span>Birthday:
            </label>
            <div style={styles.birthdayRow}>
              <select
                className="w-[133px] bg-white text-secondary text-sm rounded-[8px] border border-[#ccc] px-4 py-3"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <div className="text-sm text-secondary">Year</div>
              <select
                className="w-[120px] bg-white text-secondary text-sm rounded-[8px] border border-[#ccc] px-4 py-3"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <div className="text-sm text-secondary">Month</div>
            </div>
          </div>

          <div className="mb-[20px]">
            <label style={styles.label}>
              <span style={styles.required}>*</span>Height (cm):
            </label>
            <input
              className="w-full text-sm placeholder-custom-12 bg-white px-4 py-3 rounded-[8px] border border-[#ccc]"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g. 170"
            />
          </div>

          <div className="mb-[20px]">
            <label className="text-base text-secondary">
              <span style={styles.required}>*</span>Weight (kg):
            </label>
            <input
              className="w-full text-sm placeholder-custom-12 bg-white px-4 py-3 rounded-[8px] border border-[#ccc] mt-[10px]"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 60"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-[242px] mx-auto transition-all duration-150 active:scale-[0.98] active:shadow-[0_4px_10px_rgba(0,0,0,0.18)] min-h-[48px] flex items-center justify-center text-white text-base rounded-[24px] bg-[#C69C6D] py-3 shadow-[0_4px_10px_rgba(0,0,0,0.18)] mt-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </form>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleAvatarFileChange}
        />
      </div>
    </>
  );
};

export default Profile;
