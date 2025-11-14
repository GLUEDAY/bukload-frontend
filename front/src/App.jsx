// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlannerPage from "./pages/PlannerPage";
import ResultPage from "./pages/ResultPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import ReceiptPage from "./pages/ReceiptPage";
import ReviewPage from "./pages/ReviewPage";
import SavedCoursePage from "./pages/SavedCoursePage";
import CourseListPage from "./pages/CourseListPage";
import AddPlacePage from "./pages/AddPlacePage";

function NotFound() {
  return <div style={{ padding: 16 }}>페이지를 찾을 수 없어요 😢</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 홈: 플래너 (검색/추가) */}
        <Route path="/" element={<PlannerPage />} />

        {/* AI 추천 결과 */}
        <Route path="/result" element={<ResultPage />} />

        {/* 코스 목록 / 저장된 코스들 */}
        <Route path="/ai-courses" element={<CourseListPage />} />
        <Route path="/saved-courses" element={<SavedCoursePage />} />

        {/* 코스 상세: id 파라미터 사용 */}
        <Route path="/course/:id" element={<CourseDetailPage />} />
        
        {/* 후기 등록: 어떤 코스의 어떤 장소인지 파라미터 권장 */}
        <Route path="/review/:courseId/:placeId" element={<ReviewPage />} />

        {/* 영수증 인증: 필요하면 쿼리나 상태로 courseId/placeId 전달 */}
        <Route path="/receipt-proof" element={<ReceiptPage />} />

        {/* ✅ 장소 추가 페이지 라우트 */}
        <Route path="/course/add-place" element={<AddPlacePage />} />


        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
