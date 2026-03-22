import {
  ChevronLeft,
  ChevronRight,
  User,
  Plus,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { FaShieldAlt } from "react-icons/fa";
import { MdFolderShared } from "react-icons/md";
import { FaLink, FaLock } from "react-icons/fa6";
import useApiClient from "@/hooks/useApiClient";
import { getUserProfile } from "@/api/http";

const Account = () => {
  const navigate = useNavigate();
  const api = useApiClient();
  const [profileFromDb, setProfileFromDb] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const accountItems = [
    {
      icon: <MdFolderShared size={24} className="text-[#705D56]" />,
      label: "Personal Info",
      onclick: () => navigate("/setting/account/profile"),
    },
    {
      icon: <FaShieldAlt size={20} className="text-[#705D56]" />,
      label: "Account Security",
      onclick: () => navigate("/setting/account/security"),
    },
    {
      icon: <FaLock size={20} className="text-[#705D56]" />,
      label: "Password",
      onclick: () => navigate("/setting/account/password"),
    },
    {
      icon: <FaLink size={20} className="text-[#705D56]" />,
      label: "Service Binding",
      onclick: () => navigate("/setting/account/binding"),
    },
  ];

  const auth = useSelector((state) => state.auth);
  const { user } = useUser();

  const displayName = useMemo(() => {
    const fromDb = profileFromDb?.username;
    if (typeof fromDb === "string" && fromDb.trim()) return fromDb.trim();
    return (
      auth?.user?.username ||
      auth?.user?.firstName ||
      "Username"
    );
  }, [profileFromDb?.username, auth?.user?.username, auth?.user?.firstName]);

  const displayEmail = useMemo(() => {
    const fromDb = profileFromDb?.email;
    if (typeof fromDb === "string" && fromDb.trim()) return fromDb.trim();
    return (
      auth?.user?.primaryEmailAddress ||
      auth?.user?.emailAddresses?.[0] ||
      "user@example.com"
    );
  }, [profileFromDb?.email, auth?.user?.primaryEmailAddress, auth?.user?.emailAddresses]);

  const avatarSrc = useMemo(() => {
    return (
      user?.profileImageUrl ||
      user?.imageUrl ||
      (typeof profileFromDb?.avatar === "string" && profileFromDb.avatar.trim()
        ? profileFromDb.avatar.trim()
        : "") ||
      auth?.user?.imageUrl ||
      ""
    );
  }, [
    user?.profileImageUrl,
    user?.imageUrl,
    profileFromDb?.avatar,
    auth?.user?.imageUrl,
  ]);

  useEffect(() => {
    if (!auth?.user?.id) {
      setProfileLoading(false);
      return;
    }

    const load = async () => {
      setProfileLoading(true);
      try {
        const res = await getUserProfile(api, {
          params: { userId: auth.user.id },
        });
        const payload = res.data?.data ?? res.data;
        setProfileFromDb(payload && typeof payload === "object" ? payload : null);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load account profile:", error);
        setProfileFromDb(null);
      } finally {
        setProfileLoading(false);
      }
    };

    load();
  }, [api, auth?.user?.id]);

  useEffect(() => {
    if (avatarSrc) setAvatarLoading(true);
  }, [avatarSrc]);

  return (
    <div className="bg-ivory min-h-full p-6 text-primary">
      <div className="flex items-center gap-4 mb-[84px]">
        <button
          type="button"
          className="text-primary text-xl leading-none w-12 h-12 flex items-center justify-center"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none cursor-pointer " />
        </button>
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Account</h2>
      </div>

      {/* User card */}
      <div className="bg-white flex items-center justify-between shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-[14px] mb-[16px] rounded-[8px]">
        <div className="flex items-center gap-4">
          {avatarSrc ? (
            <div className="relative w-[50px] h-[50px]">
              {avatarLoading && (
                <div className="absolute inset-0 rounded-full bg-[#f6f1ec] flex items-center justify-center animate-pulse">
                  <User className="text-[#c4b8aa]" />
                </div>
              )}
              <img
                src={avatarSrc}
                alt={displayName || "avatar"}
                className="w-[50px] h-[50px] border-[#e5e7eb] rounded-full object-cover"
                onLoad={() => setAvatarLoading(false)}
                onError={() => setAvatarLoading(false)}
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#f6f1ec] flex items-center justify-center text-primary">
              <User />
            </div>
          )}

          <div>
            <div className="text-sm text-primary">
              {profileLoading && auth?.user?.id ? "…" : displayName}
            </div>
            <a className="text-sm text-primary underline block">
              {profileLoading && auth?.user?.id ? "…" : displayEmail}
            </a>
            <div className="text-xs text-secondary">Account Level: Standard</div>
          </div>
        </div>

        <button
          type="button"
          className="rounded-full bg-secondary flex items-center justify-center w-12 h-12"
          aria-label="Open profile settings"
          onClick={() => navigate("/setting/account/profile")}
        >
          <Plus className="text-white text-[12px]" width="24px" height="24px"/>
        </button>
      </div>

      <div className="space-y-4">
        <section>
          <div className="overflow-hidden">
            {accountItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onclick}
                className="w-full flex items-center justify-between gap-4 p-[14px] rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-[20px] text-left bg-white"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-[24px] h-[24px] text-primary">
                    {item.icon}
                  </div>
                  <span className="text-sm text-primary">{item.label}</span>
                </div>
                <ChevronRight className="text-secondary" width="10px" height="16px"/>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Account;
