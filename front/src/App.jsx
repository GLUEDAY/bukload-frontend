import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlannerPage from './pages/PlannerPage';
import MyPage from './pages/MyPage';
import BottomNav from './ui/BottomNav';

function Layout() {
  const location = useLocation();
  const hideNav = location.pathname === '/'; // 홈에서는 네비 숨기기

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
      {!hideNav && <BottomNav />} {/* 홈이 아닐 때만 표시 */}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
