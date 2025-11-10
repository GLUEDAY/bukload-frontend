import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlannerPage from "./pages/PlannerPage";
import ResultPage from "./pages/ResultPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import ReceiptPage from "./pages/ReceiptPage";
import ReviewPage from "./pages/ReviewPage";
import { SavedCoursePage } from "./pages/SavedCoursePage"; 
import CourseListPage from "./pages/CourseListPage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlannerPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/course" element={<CourseDetailPage />} />
        <Route path="/receipt-proof" element={<ReceiptPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path= "/saved-courses" element={<SavedCoursePage />} />
        <Route path="/ai-courses" element={<CourseListPage />} />

      </Routes>
    </BrowserRouter>
  );
}
