import {
  ChevronLeft,
  ChevronRight,
  User,
  Link,
  Lock,
  Shield,
  Plus,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Account = () => {
    const navigate = useNavigate();
  const accountItems = [
    {
      icon: <User />,
      label: "Personal Info",
      onclick: () => navigate("/setting/account/profile"),
    },
    {
      icon: <Shield />,
      label: "Account Security",
      onclick: () => navigate("/setting/account/security"),
    },
    {
      icon: <Lock />,
      label: "Password",
      onclick: () => navigate("/setting/account/password"),
    },
    {
      icon: <Link />,
      label: "Service Binding",
      onclick: () => navigate("/setting/account/binding"),
    },
  ];

  const auth = useSelector((state) => state.auth);
  return (
    <div className="bg-ivory min-h-full p-6 text-secondary">
      <div className="flex items-center gap-4 mb-30">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-xl leading-none" />
        </button>
        <h2 className="text-xl font-semibold">Account</h2>
      </div>

      {/* User card */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {auth?.user?.imageUrl ? (
            <img
              src={auth.user.imageUrl}
              alt={auth.user.username || "avatar"}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#f6f1ec] flex items-center justify-center text-primary">
              <User />
            </div>
          )}

          <div>
            <div className="text-sm font-medium text-primary">
              {auth?.user?.username || auth?.user?.firstName || "Username"}
            </div>
            <a className="text-xs text-primary underline block">
              {auth?.user?.primaryEmailAddress ||
                auth?.user?.emailAddresses?.[0] ||
                "user@example.com"}
            </a>
            <div className="text-xs text-gray-500">Account Level: Standard</div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => console.log("add")}
          className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
          aria-label="add"
        >
          <Plus className="text-primary" />
        </button>
      </div>

      <div className="space-y-4">
        <section>
          <div className="bg-transparent rounded-md overflow-hidden">
            {accountItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onclick}
                className="w-full flex items-center justify-between gap-4 px-4 py-3 bg-white rounded-xl mb-3 shadow-sm hover:shadow-md text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg">
                    <div className="w-5 h-5">{item.icon}</div>
                  </div>
                  <span className="text-base text-primary">{item.label}</span>
                </div>
                <ChevronRight className="text-gray-400" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Account;
