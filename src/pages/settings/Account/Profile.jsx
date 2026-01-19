import { ChevronLeft } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

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

  const submit = (e) => {
    e.preventDefault();
    // Placeholder submit handler
    console.log({ username, email, gender, year, month, height, weight });
  };

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
    avatarWrap: { display: "flex", justifyContent: "center", marginBottom: 18 },
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
      right: -6,
      bottom: -6,
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: "#6b4d43",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 3px 6px rgba(0,0,0,0.12)",
      cursor: "pointer",
    },
    form: { display: "flex", flexDirection: "column", gap: 16 },
    label: { display: "block", fontSize: 15, marginBottom: 6 },
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
      background: "#cfa76f",
      color: "white",
      padding: "12px 16px",
      borderRadius: 12,
      border: "none",
      cursor: "pointer",
    },
  };

  const auth = useSelector((state) => state.auth);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(auth?.user?.imageUrl || "");

  useEffect(() => {
    return () => {
      if (avatarUrl && avatarUrl.startsWith("blob:"))
        URL.revokeObjectURL(avatarUrl);
    };
  }, [avatarUrl]);
  return (
    <div className="bg-ivory min-h-full p-6 text-secondary">
      <div className="flex items-center gap-4 mb-5">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-xl leading-none" />
        </button>
        <h2 className="text-xl font-semibold">Profile Settings</h2>
      </div>

      <div style={styles.avatarWrap}>
        <div style={styles.avatar}>
          <div style={{ fontSize: 36, color: "#6b4d43" }}>
            <img
              src={avatarUrl || auth?.user?.imageUrl}
              className="rounded-full"
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
            ✏️
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
                  /* placeholder */ console.log("Delete avatar");
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
        <div>
          <label style={styles.label}>
            <span style={styles.required}>*</span>Username or{" "}
            <small style={{ color: "#9b9b9b" }}>Nickname</small>
          </label>
          <input
            style={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nickname"
          />
        </div>

        <div>
          <label style={styles.label}>
            <span style={styles.required}>*</span>Email:{" "}
            <small style={{ color: "#9b9b9b" }}>
              Please enter your email address
            </small>
          </label>
          <input
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label style={styles.label}>
            <span style={styles.required}>*</span>Gender:
          </label>
          <div style={styles.radios}>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === "male"}
                onChange={(e) => setGender(e.target.value)}
              />{" "}
              <span style={{ marginLeft: 6 }}>Male</span>
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === "female"}
                onChange={(e) => setGender(e.target.value)}
              />{" "}
              <span style={{ marginLeft: 6 }}>Female</span>
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="other"
                checked={gender === "other"}
                onChange={(e) => setGender(e.target.value)}
              />{" "}
              <span style={{ marginLeft: 6 }}>Other</span>
            </label>
          </div>
        </div>

        <div>
          <label style={styles.label}>
            <span style={styles.required}>*</span>Birthday:
          </label>
          <div style={styles.birthdayRow}>
            <select
              style={{ ...styles.select, flex: 1 }}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <div style={{ fontSize: 14, color: "#6b4d43" }}>Year</div>
            <select
              style={{ ...styles.select, width: 110 }}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <div style={{ fontSize: 14, color: "#6b4d43" }}>Month</div>
          </div>
        </div>

        <div>
          <label style={styles.label}>
            <span style={styles.required}>*</span>Height (cm):
          </label>
          <input
            style={styles.input}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="e.g. 170"
          />
        </div>

        <div>
          <label style={styles.label}>
            <span style={styles.required}>*</span>Weight (kg):
          </label>
          <input
            style={styles.input}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g. 60"
          />
        </div>

        <button type="submit" style={styles.saveBtn}>
          Save Settings
        </button>
      </form>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;
          const url = URL.createObjectURL(file);
          if (avatarUrl && avatarUrl.startsWith("blob:"))
            URL.revokeObjectURL(avatarUrl);
          setAvatarUrl(url);
          // TODO: upload `file` to server here
        }}
      />
    </div>
  );
};

export default Profile;
