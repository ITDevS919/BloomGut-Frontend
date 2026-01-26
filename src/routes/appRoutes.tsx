import PrivateLayout from "@/layouts/private-layout";
import VerifyEmail from "@/pages/auth/SetUsername";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Dashboard from "@/pages/home/Dashboard";
import Home from "@/pages/home/Home";
import OnBoardScreen from "@/pages/home/OnBoardScreen";
import Settings from "@/pages/settings/Settings";
import StoolPage from "@/pages/home/stool";
import SetupUsername from "@/pages/auth/SetUsername";
import ForgotPass from "@/pages/auth/ForgotPass";
import Account from "@/pages/settings/Account/Account";
import AccountSecurity from "@/pages/settings/Account/AccountSecurity";
import Profile from "@/pages/settings/Account/Profile";
import Password from "@/pages/settings/Account/Password";
import Notification from "@/pages/settings/Notification/Notification";
import AboutUs from "@/pages/settings/AboutUs/AboutUs";
import CompanyIntroduction from "@/pages/settings/AboutUs/CompanyIntroduction";
import PrivacyPolicy from "@/pages/settings/Privacy/PrivacyPolicy";
import TermsOfUse from "@/pages/settings/Privacy/TermsOfUse";
import MobileSetting from "@/pages/settings/AppSetting/MobileSetting";
import MailboxSetting from "@/pages/settings/AppSetting/MailboxSetting";
import Binding from "@/pages/settings/AppSetting/Binding";
import AppSetting from "@/pages/settings/AppSetting/AppSetting";
import FontSize from "@/pages/settings/AppSetting/FontSize";
import LanguageSetting from "@/pages/settings/AppSetting/LanguageSetting";
import CheckUpdate from "@/pages/settings/AppSetting/CheckUpdate";
import ContactUs from "@/pages/settings/AboutUs/ContactUs";
import HelpSupport from "@/pages/settings/HelpSupport/HelpSupport";
import Plan from "@/pages/settings/Plan/Plan";
import SubScription from "@/pages/settings/Plan/SubScription";
import FoodRecord from "@/pages/home/record/FoodRecord";
import DietRecord from "@/pages/home/record/DietRecord";
import Record from "@/pages/home/record";
import Trend from "@/pages/home/trend";
import UrineRecord from "@/pages/home/record/UrineRecord";
import WaterRecord from "@/pages/home/record/WaterRecord";
import CustomVolume from "@/pages/home/record/CustomVolume";
import Reminders from "@/pages/home/record/Reminders";

export const ROUTES = [
  {
    path: "/",
    element: <OnBoardScreen />,
    isRouteAccessible: true,
  },
  {
    path: "/home",
    element: <Home />,
    isRouteAccessible: true,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateLayout>
        <Dashboard />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },
  {
    path: "/setting",
    element: (
      <PrivateLayout>
        <Settings />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },
  {
    path: "/stool",
    element: (
      <PrivateLayout>
        <StoolPage />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },
];

export const AUTH_ROUTES = [
  {
    path: "/auth/login",
    element: <Login />,
    isRouteAccessible: true,
  },
  {
    path: "/auth/register",
    element: <Register />,
    isRouteAccessible: true,
  },
  {
    path: "/auth/setup-username",
    element: <SetupUsername />,
    isRouteAccessible: true,
  },
  {
    path: "/auth/forgot-password",
    element: <ForgotPass />,
    isRouteAccessible: true,
  },
];

export const SETTING_ROUTES = [
  //App Settings
  {
    path: "/setting/app-setting",
    element: (
      <PrivateLayout>
        <AppSetting />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },
  {
    path: "/setting/app-setting/font-size",
    element: (
      <PrivateLayout>
        <FontSize />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },
  {
    path: "/setting/app-setting/language",
    element: (
      <PrivateLayout>
        <LanguageSetting />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },
  {
    path: "/setting/app-setting/check-update",
    element: (
      <PrivateLayout>
        <CheckUpdate />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },

  //Account
  {
    path: "/setting/account",
    element: (
      <PrivateLayout>
        <Account />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },
  {
    path: "/setting/account/profile",
    element: (
      <PrivateLayout>
        <Profile />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },
  {
    path: "/setting/account/security",
    element: (
      <PrivateLayout>
        <AccountSecurity />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },
  {
    path: "/setting/account/password",
    element: (
      <PrivateLayout>
        <Password />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },
  {
    path: "/setting/account/mobile",
    element: (
      <PrivateLayout>
        <MobileSetting />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },
  {
    path: "/setting/account/mailbox",
    element: (
      <PrivateLayout>
        <MailboxSetting />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },
  {
    path: "/setting/account/binding",
    element: (
      <PrivateLayout>
        <Binding />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },

  //Notifications
  {
    path: "/setting/notification",
    element: (
      <PrivateLayout>
        <Notification />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },

  //About Us
  {
    path: "/setting/about-us",
    element: (
      <PrivateLayout>
        <AboutUs />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },
  {
    path: "/setting/about-us/company-introduction",
    element: (
      <PrivateLayout>
        <CompanyIntroduction />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },
  {
    path: "/setting/about-us/contact-us",
    element: (
      <PrivateLayout>
        <ContactUs />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },

  //Privacy Policy
  {
    path: "/setting/privacy-policy",
    element: (
      <PrivateLayout>
        <PrivacyPolicy />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },
  {
    path: "/setting/privacy-policy/terms-of-use",
    element: (
      <PrivateLayout>
        <TermsOfUse />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },

  //Help & Support
  {
    path: "/setting/help-support",
    element: (
      <PrivateLayout>
        <HelpSupport />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },

  //Upgrade Plan
  {
    path: "/setting/upgrade-plan",
    element: (
      <PrivateLayout>
        <Plan />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },
  {
    path: "/setting/upgrade-plan/subscription",
    element: (
      <PrivateLayout>
        <SubScription />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },
];

export const TREND_ROUTES = [
  {
    path: "/trend-analysis",
    element: (
      <PrivateLayout>
        <Trend />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },
];

export const RECORD_ROUTES = [
  {
    path: "/diet-record",
    element: (
      <PrivateLayout>
        <Record />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },
  {
    path: "/custom-volume",
    element: (
      <PrivateLayout>
        <CustomVolume />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },
  {
    path: "/reminders",
    element: (
      <PrivateLayout>
        <Reminders />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },
  {
    path: "/urine-record",
    element: (
      <PrivateLayout>
        <UrineRecord />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },
  {
    path: "/water-record",
    element: (
      <PrivateLayout>
        <WaterRecord />
      </PrivateLayout>
    ),
    isRouteAccessible: true,
  },
];