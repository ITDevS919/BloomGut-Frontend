import { Route, Routes } from "react-router-dom";
import { AUTH_ROUTES, RECORD_ROUTES, ROUTES, SETTING_ROUTES, TREND_ROUTES } from "./appRoutes";
import SSOCallback from "@/pages/auth/SSOCallback";

const MainRoutes = () => {
  return (
    // <div>
    <Routes>
      <Route path="/sso-callback" element={<SSOCallback />} />
      {ROUTES?.map((route, index) => {
        return <Route key={index} path={route.path} element={route.element} />;
      })}

      {AUTH_ROUTES?.map((route, index) => {
        return <Route key={index} path={route.path} element={route.element} />;
      })}

      {SETTING_ROUTES?.map((route, index) => {
        return <Route key={index} path={route.path} element={route.element} />;
      })}

      {TREND_ROUTES?.map((route, index) => {
        return <Route key={index} path={route.path} element={route.element} />;
      })}
      
      {RECORD_ROUTES?.map((route, index) => {
        return <Route key={index} path={route.path} element={route.element} />;
      })}
    </Routes>

    // </div>
  );
};

export default MainRoutes;
