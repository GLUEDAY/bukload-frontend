import { createContext, useContext, useMemo, useRef, useState } from "react";
import LoadingOverlay from "../ui/LoadingOverlay";

const Ctx = createContext(null);

export function LoadingProvider({ children }) {
  const [count, setCount] = useState(0);
  const inc = () => setCount((c) => c + 1);
  const dec = () => setCount((c) => Math.max(0, c - 1));

  const withLoading = async (fn, msg) => {
    inc();
    try { return await fn(); } finally { dec(); }
  };

  const value = useMemo(
    () => ({ showLoading: inc, hideLoading: dec, withLoading }),
    []
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {count > 0 && <LoadingOverlay />}
    </Ctx.Provider>
  );
}

export const useLoading = () => useContext(Ctx);
