import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import {
  AUTH_ROUTES,
  RECORD_ROUTES,
  ROUTES,
  SETTING_ROUTES,
  TREND_ROUTES,
} from "./appRoutes";

const SSOCallback = lazy(() => import("@/pages/auth/SSOCallback"));

const MainRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
          Loading…
        </div>
      }
    >
      <Routes>
        <Route path="/sso-callback" element={<SSOCallback />} />
        {ROUTES?.map((route, index) => {
          return (
            <Route key={index} path={route.path} element={route.element} />
          );
        })}

        {AUTH_ROUTES?.map((route, index) => {
          return (
            <Route key={index} path={route.path} element={route.element} />
          );
        })}

        {SETTING_ROUTES?.map((route, index) => {
          return (
            <Route key={index} path={route.path} element={route.element} />
          );
        })}

        {TREND_ROUTES?.map((route, index) => {
          return (
            <Route key={index} path={route.path} element={route.element} />
          );
        })}

        {RECORD_ROUTES?.map((route, index) => {
          return (
            <Route key={index} path={route.path} element={route.element} />
          );
        })}
      </Routes>
    </Suspense>
  );
};

export default MainRoutes;
