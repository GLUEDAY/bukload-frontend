import { useEffect, useMemo, useState } from "react";
import Header from "../ui/Header";
import { useLoading } from "../context/LoadingContext";
import { useAlert } from "../context/AlertContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

/**
 * API 가정 (명세서 기준 명칭이 다르면 path만 바꿔주면 됨)
 * - GET  /account/me                      : 내 정보 조회
 * - PUT  /account/me                      : 내 정보 수정 { name, birthDate, email }
 * - POST /account/change-password         : 비번변경 { newPassword, newPasswordConfirm }
 * - (선택) GET VITE_SIGNUP_ID_CHECK_PATH  : 아이디 중복확인 (수정 불가라면 알럿만)
 */

export default function AccountSettingsPage() {
  const { withLoading } = useLoading();
  const { showAlert } = useAlert();

  const [me, setMe] = useState({
    loginId: "",
    name: "",
    birthDate: "",
    email: "",
  });

  const [editing, setEditing] = useState({
    name: "",
    birthDate: "",
    email: "",
  });

  const [saving, setSaving] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 비번 변경 모달
  const [pwOpen, setPwOpen] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");

  const pwValid = useMemo(
    () => /[A-Za-z]/.test(newPw) && /[0-9]/.test(newPw) && newPw.length >= 8,
    [newPw]
  );
  const pwMatch = useMemo(() => newPw && newPw === newPw2, [newPw, newPw2]);

  const edited =
    editing.name !== me.name ||
    editing.birthDate !== me.birthDate ||
    editing.email !== me.email;

  // --- 초기 로드: 내 정보 가져오기 ---
  useEffect(() => {
    withLoading(async () => {
      const res = await fetch(`${API_BASE}/account/me`, {
        headers: authHeaders(),
      });
      if (!res.ok) {
        setErrorMsg("계정 정보를 불러오지 못했어요.");
        return;
      }
      const data = await res.json();
      setMe({
        loginId: data.loginId ?? "",
        name: data.name ?? "",
        birthDate: (data.birthDate ?? "").slice(0, 10), // yyyy-MM-dd
        email: data.email ?? "",
      });
      setEditing({
        name: data.name ?? "",
        birthDate: (data.birthDate ?? "").slice(0, 10),
        email: data.email ?? "",
      });
    });
  }, []);

  // --- 저장 ---
  const onSave = async (e) => {
    e.preventDefault();
    if (!edited || saving) return;
    setSaving(true);
    setErrorMsg("");

    await withLoading(async () => {
      const res = await fetch(`${API_BASE}/account/me`, {
        method: "PUT",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editing.name,
          birthDate: editing.birthDate,
          email: editing.email,
        }),
      });

      if (!res.ok) {
        const err = await safeJson(res);
        setErrorMsg(err?.message || "저장에 실패했어요.");
        setSaving(false);
        return;
      }

      setMe((s) => ({ ...s, ...editing }));
      setSaving(false);
      setSuccessOpen(true);
    });
  };

  // --- 아이디 중복확인 (아이디 수정 불가면 안내만) ---
  const onCheckId = async () => {
    if (!me.loginId) return;
    const path = import.meta.env.VITE_SIGNUP_ID_CHECK_PATH; // 예: /auth/check-loginId?loginId=
    if (!path) return showAlert("아이디 변경은 제공하지 않아요");
    await withLoading(async () => {
      const res = await fetch(`${API_BASE}${path}${encodeURIComponent(me.loginId)}`);
      if (res.ok) showAlert("사용 가능한 아이디입니다");
      else showAlert("이미 사용 중인 아이디예요");
    });
  };

  // --- 비번 변경 ---
  const openPw = () => {
    setNewPw(""); setNewPw2(""); setPwOpen(true);
  };
  const submitPw = async () => {
    if (!pwValid) return showAlert("영문/숫자 포함 8자 이상으로 입력해 주세요");
    if (!pwMatch) return showAlert("비밀번호가 일치하지 않아요");

    await withLoading(async () => {
      const res = await fetch(`${API_BASE}/account/change-password`, {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: newPw, newPasswordConfirm: newPw2 }),
      });
      if (!res.ok) {
        const err = await safeJson(res);
        showAlert(err?.message || "비밀번호 변경에 실패했어요");
        return;
      }
      setPwOpen(false);
      showAlert("비밀번호가 변경되었습니다");
    });
  };

  return (
    <div className="min-h-screen bg-[#B7DED1]/30">
      <Header title="계정 설정" />
      <main className="mx-auto max-w-[420px] px-4 pb-16">
        <section className="mt-6 rounded-2xl border border-[#E6D9CC] bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-xl font-semibold text-[#8A6B52]">계정 설정</h1>

          <form onSubmit={onSave} className="space-y-4">
            {/* ID (읽기전용) */}
            <div>
              <label className="mb-1 block text-sm font-medium text-[#8A6B52]">ID</label>
              <div className="flex gap-2">
                <input
                  value={me.loginId}
                  readOnly
                  className="flex-1 rounded-xl border border-[#E6D9CC] bg-[#F9F7F3] px-3 py-2 text-[#6B7280]"
                />
                <button
                  type="button"
                  onClick={onCheckId}
                  className="shrink-0 rounded-xl border border-[#E6D9CC] px-3 text-sm text-[#8A6B52] hover:bg-[#F6F1EA]"
                >
                  중복확인
                </button>
              </div>
            </div>

            {/* PW 변경 버튼 */}
            <div>
              <label className="mb-1 block text-sm font-medium text-[#8A6B52]">PW</label>
              <div className="flex gap-2">
                <input
                  value={"•".repeat(10)}
                  readOnly
                  className="flex-1 rounded-xl border border-[#E6D9CC] bg-[#F9F7F3] px-3 py-2 text-[#6B7280]"
                />
                <button
                  type="button"
                  onClick={openPw}
                  className="shrink-0 rounded-xl border border-[#E6D9CC] px-3 text-sm text-[#8A6B52] hover:bg-[#F6F1EA]"
                >
                  변경하기
                </button>
              </div>
            </div>

            {/* 이름 */}
            <Field
              label="이름"
              value={editing.name}
              onChange={(v) => setEditing((s) => ({ ...s, name: v }))}
            />

            {/* 생년월일 */}
            <div>
              <label className="mb-1 block text-sm font-medium text-[#8A6B52]">생년월일</label>
              <input
                type="date"
                value={editing.birthDate}
                onChange={(e) =>
                  setEditing((s) => ({ ...s, birthDate: e.target.value }))
                }
                className="w-full rounded-xl border border-[#E6D9CC] px-3 py-2 outline-none focus:ring-2 focus:ring-[#F07818]/30"
              />
            </div>

            {/* 이메일 */}
            <Field
              label="이메일"
              placeholder="example@email.com"
              value={editing.email}
              onChange={(v) => setEditing((s) => ({ ...s, email: v }))}
            />

            {!!errorMsg && <p className="text-sm text-[#C62828]">{errorMsg}</p>}

            <button
              type="submit"
              disabled={!edited || saving}
              className={`mt-2 w-full rounded-2xl px-4 py-3 font-semibold text-white shadow transition
                ${!edited || saving ? "bg-[#2F6D62]/30" : "bg-[#2F6D62] hover:brightness-110"}`}
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </form>
        </section>
      </main>

      {/* 비밀번호 변경 모달 */}
      {pwOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="w-[90%] max-w-md rounded-2xl border border-[#E6D9CC] bg-white p-5 shadow-lg">
            <p className="mb-3 text-sm font-semibold text-[#8A6B52]">비밀번호 입력</p>
            <p className="mb-3 text-xs text-[#8A6B52]/70">영문/숫자를 포함한 8자 이상</p>

            <InputRow
              type="password"
              placeholder="비밀번호 입력"
              value={newPw}
              onChange={setNewPw}
            />
            <InputRow
              type="password"
              placeholder="비밀번호 확인"
              value={newPw2}
              onChange={setNewPw2}
            />
            {!pwValid && newPw && (
              <p className="mt-1 text-xs text-[#C62828]">조건을 만족하지 않아요.</p>
            )}
            {!pwMatch && newPw2 && (
              <p className="mt-1 text-xs text-[#C62828]">비밀번호가 일치하지 않아요.</p>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setPwOpen(false)}
                className="rounded-xl border border-[#E6D9CC] px-4 py-2 text-[#8A6B52] hover:bg-[#F6F1EA]"
              >
                취소
              </button>
              <button
                onClick={submitPw}
                className="rounded-xl bg-[#F07818] px-4 py-2 font-semibold text-white hover:brightness-110"
              >
                변경
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 저장 성공 모달 */}
      {successOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="w-[90%] max-w-md rounded-2xl border border-[#E6D9CC] bg-white p-6 shadow-lg">
            <p className="mb-4 text-[#2F6D62]">변경되었습니다</p>
            <div className="flex justify-end">
              <button
                onClick={() => setSuccessOpen(false)}
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

/* ---------- 작은 UI ---------- */
function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-[#8A6B52]">{label}</label>
      <div className="relative">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-[#E6D9CC] px-3 py-2 outline-none focus:ring-2 focus:ring-[#F07818]/30"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-[#E6D9CC] px-2 text-xs text-[#8A6B52] hover:bg-[#F6F1EA]"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

function InputRow({ value, onChange, placeholder, type = "text" }) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-[#E6D9CC] px-3 py-2 outline-none focus:ring-2 focus:ring-[#F07818]/30"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-[#E6D9CC] px-2 text-xs text-[#8A6B52] hover:bg-[#F6F1EA]"
        >
          ✕
        </button>
      )}
    </div>
  );
}

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function safeJson(res) {
  try { return await res.json(); } catch { return null; }
}
