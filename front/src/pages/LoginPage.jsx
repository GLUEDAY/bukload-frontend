import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../ui/Header";
import { useLoading } from "../context/LoadingContext";
import { useAlert } from "../context/AlertContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export default function LoginPage() {
  const nav = useNavigate();
  const { withLoading } = useLoading();
  const { showAlert } = useAlert();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [rememberId, setRememberId] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("remember_loginId");
    if (saved) {
      setLoginId(saved);
      setRememberId(true);
    }
  }, []);

  const canSubmit = loginId.trim().length > 0 && password.length >= 1;
  const clear = (setter) => () => setter("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError("");

    await withLoading(async () => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId, password }),
      });

      if (!res.ok) {
        const data = await safeJson(res);
        setError(data?.message || "로그인에 실패했어요. 정보를 다시 확인해 주세요.");
        setSubmitting(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      if (rememberId) localStorage.setItem("remember_loginId", loginId);
      else localStorage.removeItem("remember_loginId");

      setOk(true);
    });
  };

  const closeOk = () => {
    setOk(false);
    nav("/");
  };

  return (
    <div className="min-h-screen bg-[#B7DED1]/30">
      <Header title="로그인" />

      <main className="mx-auto max-w-[420px] px-4 pb-16">
        <section className="mt-6 rounded-2xl border border-[#E6D9CC] bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-xl font-semibold text-[#8A6B52]">로그인 정보 입력</h1>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* ID */}
            <div>
              <label className="mb-1 block text-sm font-medium text-[#8A6B52]">ID</label>
              <div className="relative">
                <input
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="아이디 입력"
                  className="w-full rounded-xl border border-[#E6D9CC] px-3 py-2 outline-none focus:ring-2 focus:ring-[#F07818]/30"
                />
                {loginId && <ClearBtn onClick={clear(setLoginId)} />}
              </div>
            </div>

            {/* PW */}
            <div>
              <label className="mb-1 block text-sm font-medium text-[#8A6B52]">PW</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  className="w-full rounded-xl border border-[#E6D9CC] px-3 py-2 outline-none focus:ring-2 focus:ring-[#F07818]/30"
                />
                {password && <ClearBtn onClick={clear(setPassword)} />}
              </div>
              <label className="mt-2 flex items-center gap-2 text-sm text-[#8A6B52]">
                <input type="checkbox" checked={showPw} onChange={(e) => setShowPw(e.target.checked)} />
                비밀번호 표시
              </label>
            </div>

            {/* 기억하기 */}
            <label className="flex items-center gap-2 text-sm text-[#8A6B52]">
              <input
                type="checkbox"
                checked={rememberId}
                onChange={(e) => setRememberId(e.target.checked)}
              />
              아이디 저장
            </label>

            {!!error && <p className="text-sm text-[#C62828]">{error}</p>}

            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className={`mt-2 w-full rounded-2xl px-4 py-3 font-semibold text-white shadow transition
                ${!canSubmit || submitting ? "bg[#2F6D62]/40" : "bg-[#2F6D62] hover:brightness-110"}`}
            >
              {submitting ? "로그인 중..." : "로그인"}
            </button>

            <div className="flex justify-center gap-3 pt-2 text-sm text-[#8A6B52]">
              <Link className="hover:underline" to="/signup">회원가입</Link>
              <span>|</span>
              {/* 아직 미제공이면 알럿으로 처리 */}
              <button
                type="button"
                className="hover:underline"
                onClick={() => showAlert("아이디/비밀번호 찾기는 준비 중입니다")}
              >
                아이디/비밀번호 찾기
              </button>
            </div>
          </form>
        </section>
      </main>

      {/* 성공 모달 */}
      {ok && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[90%] max-w-md rounded-2xl border border-[#E6D9CC] bg-white p-6 shadow-lg">
            <p className="mb-4 text-lg font-semibold text-[#2F6D62]">로그인 성공!</p>
            <div className="flex justify-end">
              <button
                onClick={closeOk}
                className="rounded-xl bg-[#2F6D62] px-4 py-2 text-white hover:brightness-110"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ClearBtn({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-[#E6D9CC] px-2 text-xs text-[#8A6B52] hover:bg-[#F6F1EA]"
      aria-label="clear"
    >
      ✕
    </button>
  );
}

async function safeJson(res) {
  try { return await res.json(); } catch { return null; }
}
