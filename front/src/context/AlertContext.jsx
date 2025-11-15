import { createContext, useContext, useMemo, useState } from "react";
import FeatureAlert from "../ui/FeatureAlert";

const Ctx = createContext(null);

export function AlertProvider({ children }) {
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);

  const showAlert = (message = "준비 중인 기능입니다", duration = 1600) => {
    setMsg(message);
    setOpen(true);
    window.clearTimeout(window.__feature_alert_timer);
    window.__feature_alert_timer = window.setTimeout(() => setOpen(false), duration);
  };

  const value = useMemo(() => ({ showAlert }), []);

  return (
    <Ctx.Provider value={value}>
      {children}
      {open && <FeatureAlert message={msg} />}
    </Ctx.Provider>
  );
}

export const useAlert = () => useContext(Ctx);
