import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";
import bukloadLogo from "../assets/png/bukload.png";

export default function HomePage() {
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const handleMyPageClick = () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      // 토큰 없으면 로그인 페이지로
      navigate("/login");
      return;
    }

    // 토큰 있으면 마이페이지로
    navigate("/mypage");
  };

  return (
    <div style={styles.container}>
      <img src={bukloadLogo} alt="BukLoad 로고" style={styles.logo} />
      <p style={styles.subtitle}>나만의 경기 북부 여행 BukLoad</p>

      <div style={styles.cardContainer}>

        <button
          onClick={() => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
              navigate("/login");
            } else {
              navigate("/planner");
            }
          }}
          style={{ ...styles.card, backgroundColor: "#F07818", color: "#fff", border: "none", cursor: "pointer" }}
          type="button"
        >
          <p style={styles.cardTitle}>코스 생성하기</p>
          <p style={styles.cardDesc}>AI로 나만의 여행 코스 만들기</p>
        </button>

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
          type="button"
        >
          <p style={{ ...styles.cardTitle, color: "#8A6B52" }}>인기 코스 보기</p>
          <p style={{ ...styles.cardDesc, color: "#A78B6F" }}>
            다른 사람들의 검증된 코스 탐색
          </p>
        </button>

        {/* 마이페이지: 토큰 여부에 따라 login / mypage로 이동 */}
        <button
          onClick={handleMyPageClick}
          style={{
            ...styles.card,
            backgroundColor: "#FFF7ED",
            border: "none",
            cursor: "pointer",
          }}
          type="button"
        >
          <p style={{ ...styles.cardTitle, color: "#8A6B52" }}>마이페이지</p>
          <p style={{ ...styles.cardDesc, color: "#A78B6F" }}>
            내가 저장한 코스 관리
          </p>
        </button>
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
