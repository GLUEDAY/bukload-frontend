import { Link } from "react-router-dom";
import { useAlert } from "../context/AlertContext";
import bukloadLogo from "../assets/png/bukload.png";

export default function HomePage() {
  const { showAlert } = useAlert();

  return (
    <div style={styles.container}>
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

        <button
          onClick={() =>
            showAlert("인기 코스는 준비 중이에요! 다음 업데이트에서 만나요 :)")
          }
          style={{
            ...styles.card,
            backgroundColor: "#FFF2E6",
            border: "none",
            cursor: "pointer",
          }}
        >
          <p style={{ ...styles.cardTitle, color: "#8A6B52" }}>인기 코스 보기</p>
          <p style={{ ...styles.cardDesc, color: "#A78B6F" }}>
            다른 사람들의 검증된 코스 탐색
          </p>
        </button>

        <Link
          to="/mypage"
          style={{ ...styles.card, backgroundColor: "#FFF7ED" }}
        >
          <p style={{ ...styles.cardTitle, color: "#8A6B52" }}>마이페이지</p>
          <p style={{ ...styles.cardDesc, color: "#A78B6F" }}>
            내가 저장한 코스 관리
          </p>
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
    paddingTop: "60px",
    fontFamily: "'Pretendard', sans-serif",
  },
  logo: { width: "90px", margin: "0 auto" },
  subtitle: { color: "#8A6B52", fontSize: "15px", marginTop: "10px" },
  cardContainer: {
    marginTop: "45px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    alignItems: "center",
  },
  card: {
    width: "80%",
    borderRadius: "16px",
    padding: "22px 18px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    textDecoration: "none",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  cardTitle: { fontSize: "20px", fontWeight: "700" },
  cardDesc: { fontSize: "14px", marginTop: "6px" },
};
