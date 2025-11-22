
import { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
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
import AiCourseListPage from "./pages/CourseListPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import ResultPage from "./pages/ResultPage";

/* ===============================
   내부 간단 플레이스홀더 (404 방지)
   =============================== */
function SavedCoursesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF6ED] to-[#FDF7F1] p-6">
      <h1 className="text-xl font-semibold text-[#8A6B52]">저장된 코스</h1>
      <p className="mt-3 text-sm text-[#6B5B4A]">전체 저장 코스 목록 (연결 예정)</p>
    </div>
  );
}


function Layout() {
  const location = useLocation();
  // 홈에서도 표시 -> 로그인/회원가입만 숨김
  const HIDE_NAV = ["/login", "/signup"];
  const hideNav = HIDE_NAV.includes(location.pathname);

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
        <Route path="/account" element={<AccountSettingsPage />} /> {/* 호환용 */}
        <Route path="/my-reviews" element={<MyReviewsPage />} />



        {/* 코스 관련 */}
        <Route path="/ai-courses" element={<AiCourseListPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/saved-courses" element={<SavedCoursesPage />} />
        <Route path="/course/:id" element={<CourseDetailPage />} />

        {/* 기타 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideNav && <BottomNav />}
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
