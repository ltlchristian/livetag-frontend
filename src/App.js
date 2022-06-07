import "./App.css";

import { Route, Routes } from "react-router-dom";
import { useAuth } from "./AuthProvider";

import Home from "./pages/Home";
import Footer from "./components/Footer";
import SignupPage from "./pages/Auth/Signup";
import LoginPage from "./pages/Auth/Login";
import NavBar from "./components/Navbar";
import Participants from "./pages/Participants";
import Participant from "./pages/Participant";
import Inscription from "./pages/Inscription";
import Roles from "./pages/Roles";
import EditRole from "./pages/RoleEdit";
import CreateRole from "./pages/RoleAdd";
import Activities from "./pages/Activities";
import Events from "./pages/Events";
import Event from "./pages/Event";
import ActivityEdit from "./pages/ActivityEdit";
import QrCode from "./pages/QrCode";
import Profil from "./pages/Auth/Profil";
import StripeJS from "./StripeJS";

function App() {
  const { connected } = useAuth();

  return (
    <body>
      <main className="site-content">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/stripe" element={<StripeJS />} />

          {connected && (
            <Route path="participants" element={<Participants />} />
          )}
          {connected && (
            <Route
              path="participants/:idParticipant"
              element={<Participant />}
            />
          )}

          {connected && <Route path="events" element={<Events />} />}
          {connected && <Route path="events/:idEvent" element={<Event />} />}

          {connected && <Route path="roles" element={<Roles />} />}
          {connected && <Route path="roles/:idRole" element={<EditRole />} />}
          {connected && <Route path="roles/create" element={<CreateRole />} />}

          {connected && <Route path="activities" element={<Activities />} />}
          {connected && (
            <Route path="activities/:idActivity" element={<ActivityEdit />} />
          )}
          {connected && <Route path="qrcode/:idQrcode" element={<QrCode />} />}
          <Route path="login" element={<LoginPage />} />
          {connected && <Route path="/profil" element={<Profil />} />}
          <Route path="signup" element={<SignupPage />} />
          <Route path="inscriptions/:idLink" element={<Inscription />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <Footer />
      </footer>
    </body>
  );
}

export default App;
