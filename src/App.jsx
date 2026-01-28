import { BrowserRouter } from "react-router-dom";
import "./App.css";
import MainRoutes from "./routes/routes";
import { Toaster } from "sonner";
import CustomThemeProvider from "./context/CustomThemeProvider";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "./store/slices/authSlice";

function App() {
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      console.log("token", token);
    };

    fetchToken();
  }, [getToken]);

  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      const payload = {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddresses: user.emailAddresses,
        primaryEmailAddress:
          user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress,
        imageUrl: user.profileImageUrl || user.imageUrl,
      };

      dispatch(loginSuccess(payload));
    } else {
      dispatch(logout());
    }
  }, [user, isLoaded, dispatch]);
  
  return (
    <>
      <BrowserRouter>
        <CustomThemeProvider>
          <Toaster 
            position="bottom-center"
            offset="80px"
            toastOptions={{
              style: {
                marginTop: '80px',
              },
            }}
          />
          <MainRoutes />
        </CustomThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
