import { Link } from "react-router-dom";
import bukloadLogo from "../assets/png/bukload.png"; // ✅ 경로 수정!

export default function HomePage() {
  return (
    <div style={styles.container}>
      {/* ✅ 이미지 경로 교체 */}
      <img src={bukloadLogo} alt="BukLoad 로고" style={styles.logo} />
      <p style={styles.subtitle}>나만의 경기 북부 여행 BukLoad</p>

      <div style={styles.cardContainer}>
        <Link
          to="/planner"
          style={{ ...styles.card, backgroundColor: "#F07818", color: "#fff" }}
        >
          <p style={styles.cardTitle}>코스 생성하기</p>
          <p style={styles.cardDesc}>AI로 나만의 여행 코스 만들기</p>
        </Link>

        <div style={{ ...styles.card, backgroundColor: "#FFF2E6" }}>
          <p style={{ ...styles.cardTitle, color: "#8A6B52" }}>인기 코스 보기</p>
          <p style={{ ...styles.cardDesc, color: "#A78B6F" }}>다른 사람들의 검증된 코스 탐색</p>
        </div>

        <Link to="/mypage" style={{ ...styles.card, backgroundColor: "#FFF7ED" }}>
          <p style={{ ...styles.cardTitle, color: "#8A6B52" }}>마이페이지</p>
          <p style={{ ...styles.cardDesc, color: "#A78B6F" }}>내가 저장한 코스 관리</p>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "linear-gradient(to bottom, #FFF9F5, #FFF)",
    minHeight: "100vh",
    textAlign: "center",
    paddingTop: "50px",
    fontFamily: "'Pretendard', sans-serif",
  },
  logo: {
    width: "80px",
    margin: "0 auto",
  },
  subtitle: {
    color: "#8A6B52",
    fontSize: "14px",
    marginTop: "8px",
  },
  cardContainer: {
    marginTop: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center",
  },
  card: {
    width: "80%",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    textDecoration: "none",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
  },
  cardDesc: {
    fontSize: "14px",
    marginTop: "4px",
  },
};
