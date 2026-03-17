import {
  ChevronLeft,
  ChevronRight,
  User,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import { MdFolderShared } from "react-icons/md";
import { FaLink, FaLock } from "react-icons/fa6";

const Account = () => {
  const navigate = useNavigate();
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
          {auth?.user?.imageUrl ? (
            <div className="relative w-[50px] h-[50px]">
              {avatarLoading && (
                <div className="absolute inset-0 rounded-full bg-[#f6f1ec] flex items-center justify-center animate-pulse">
                  <User className="text-[#c4b8aa]" />
                </div>
              )}
              <img
                src={auth.user.imageUrl}
                alt={auth.user.username || "avatar"}
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
              {auth?.user?.username || auth?.user?.firstName || "Username"}
            </div>
            <a className="text-sm text-primary underline block">
              {auth?.user?.primaryEmailAddress ||
                auth?.user?.emailAddresses?.[0] ||
                "user@example.com"}
            </a>
            <div className="text-xs text-secondary">Account Level: Standard</div>
          </div>
        </div>

        <button
          type="button"
          className="rounded-full bg-secondary flex items-center justify-center w-12 h-12"
          aria-label="add"
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
