import { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// 전역 로딩/알럿
import { LoadingProvider } from "./context/LoadingContext";
import { AlertProvider } from "./context/AlertContext";
import LoadingOverlay from "./ui/LoadingOverlay";

// 공통 UI
import BottomNav from "./ui/BottomNav";

// 기본 페이지
import HomePage from "./pages/HomePage";
import PlannerPage from "./pages/PlannerPage";
import MyPage from "./pages/MyPage";

// 신규 페이지
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import MyReviewsPage from "./pages/MyReviewsPage";

function Layout() {
  const location = useLocation();
  const hideNav = location.pathname === "/"; // 홈에서는 네비 숨김

  return (
    <>
      <Routes>
        {/* 메인 라우트 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/mypage" element={<MyPage />} />

        {/* 인증 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 마이페이지 하위 */}
        <Route path="/settings" element={<AccountSettingsPage />} />
        <Route path="/my-reviews" element={<MyReviewsPage />} />

        {/* 기타 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideNav && <BottomNav />}{/* 홈이 아닐 때만 표시 */}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <LoadingProvider>
        <AlertProvider>
          <Suspense fallback={<LoadingOverlay />}>
            <Layout />
          </Suspense>
        </AlertProvider>
      </LoadingProvider>
    </Router>
  );
}
