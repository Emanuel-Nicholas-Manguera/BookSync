import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { Toaster } from "./components/ui/toaster.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const app = (
  <BrowserRouter>
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
  </BrowserRouter>
);

createRoot(document.getElementById("root")).render(
  googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider>
  ) : app
);
