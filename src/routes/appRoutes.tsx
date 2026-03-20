import { lazy } from "react";
import PrivateLayout from "@/layouts/private-layout";

const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const VerifyEmail = lazy(() => import("@/pages/auth/VerifyEmail"));
const Dashboard = lazy(() => import("@/pages/home/Dashboard"));
const Home = lazy(() => import("@/pages/home/Home"));
const OnBoardScreen = lazy(() => import("@/pages/home/OnBoardScreen"));
const Settings = lazy(() => import("@/pages/settings/Settings"));
const StoolPage = lazy(() => import("@/pages/home/stool"));
const SetupUsername = lazy(() => import("@/pages/auth/SetUsername"));
const ForgotPass = lazy(() => import("@/pages/auth/ForgotPass"));
const Account = lazy(() => import("@/pages/settings/Account/Account"));
const AccountSecurity = lazy(
  () => import("@/pages/settings/Account/AccountSecurity"),
);
const Profile = lazy(() => import("@/pages/settings/Account/Profile"));
const Password = lazy(() => import("@/pages/settings/Account/Password"));
const Notification = lazy(
  () => import("@/pages/settings/Notification/Notification"),
);
const AboutUs = lazy(() => import("@/pages/settings/AboutUs/AboutUs"));
const CompanyIntroduction = lazy(
  () => import("@/pages/settings/AboutUs/CompanyIntroduction"),
);
const PrivacyPolicy = lazy(
  () => import("@/pages/settings/Privacy/PrivacyPolicy"),
);
const TermsOfUse = lazy(
  () => import("@/pages/settings/Privacy/TermsOfUse"),
);
const MobileSetting = lazy(
  () => import("@/pages/settings/AppSetting/MobileSetting"),
);
const MailboxSetting = lazy(
  () => import("@/pages/settings/AppSetting/MailboxSetting"),
);
const Binding = lazy(() => import("@/pages/settings/AppSetting/Binding"));
const AppSetting = lazy(
  () => import("@/pages/settings/AppSetting/AppSetting"),
);
const FontSize = lazy(() => import("@/pages/settings/AppSetting/FontSize"));
const LanguageSetting = lazy(
  () => import("@/pages/settings/AppSetting/LanguageSetting"),
);
const CheckUpdate = lazy(
  () => import("@/pages/settings/AppSetting/CheckUpdate"),
);
const ContactUs = lazy(
  () => import("@/pages/settings/AboutUs/ContactUs"),
);
const HelpSupport = lazy(
  () => import("@/pages/settings/HelpSupport/HelpSupport"),
);
const Plan = lazy(() => import("@/pages/settings/Plan/PlanTwoTier"));
const SubScription = lazy(
  () => import("@/pages/settings/Plan/SubScription"),
);
const FoodRecord = lazy(() => import("@/pages/home/record/FoodRecord"));
const DietRecord = lazy(() => import("@/pages/home/record/DietRecord"));
const Record = lazy(() => import("@/pages/home/record"));
const Trend = lazy(() => import("@/pages/home/trend"));
const UrineRecord = lazy(
  () => import("@/pages/home/record/UrineRecord"),
);
const WaterRecord = lazy(
  () => import("@/pages/home/record/WaterRecord"),
);
const CustomVolume = lazy(
  () => import("@/pages/home/record/CustomVolume"),
);
const Reminders = lazy(() => import("@/pages/home/record/Reminders"));

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
    path: "/auth/verify-email",
    element: <VerifyEmail />,
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