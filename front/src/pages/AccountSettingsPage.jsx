// src/pages/AccountSettingsPage.jsx
import { useEffect, useMemo, useState } from "react";
import Header from "../ui/Header";
import { useLoading } from "../context/LoadingContext";
import { useAlert } from "../context/AlertContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

/**
 * 새 API 명세 기준
 * - GET   /users/me                       : 내 정보 조회
 * - PATCH /users/me                       : 내 정보 부분 수정
 *      { nickname?, preferredTheme?, homeLocation? }
 * - 비밀번호 변경 / ID 변경 / 중복확인: 명세에 없음 → UI는 안내만
 */

export default function AccountSettingsPage() {
  const { withLoading } = useLoading();
  const { showAlert } = useAlert();

  const [me, setMe] = useState({
    loginId: "",
    name: "",
    birthDate: "",
    email: "",
    nickname: "",
    preferredTheme: "",
    homeLocation: "",
  });

  // 🔧 명세상 PATCH 로 수정 가능한 필드만 따로 관리
  const [editing, setEditing] = useState({
    nickname: "",
    preferredTheme: "",
    homeLocation: "",
  });

  const [saving, setSaving] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 비밀번호 변경 모달 (지금은 “준비 중” 안내용)
  const [pwOpen, setPwOpen] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");

  const pwValid = useMemo(
    () => /[A-Za-z]/.test(newPw) && /[0-9]/.test(newPw) && newPw.length >= 8,
    [newPw]
  );
  const pwMatch = useMemo(() => newPw && newPw === newPw2, [newPw, newPw2]);

  const edited =
    editing.nickname !== me.nickname ||
    editing.preferredTheme !== me.preferredTheme ||
    editing.homeLocation !== me.homeLocation;

  // 👉 초기 로드: 내 정보 조회
  useEffect(() => {
    withLoading(async () => {
      const res = await fetch(`${API_BASE}/users/me`, {
        headers: authHeaders(),
      });
      if (!res.ok) {
        setErrorMsg("계정 정보를 불러오지 못했어요.");
        return;
      }
      const data = await res.json();
      const birth = (data.birthDate ?? "").slice(0, 10); // yyyy-MM-dd

      setMe({
        loginId: data.loginId ?? "",
        name: data.name ?? "",
        birthDate: birth,
        email: data.email ?? "",
        nickname: data.nickname ?? "",
        preferredTheme: data.preferredTheme ?? "",
        homeLocation: data.homeLocation ?? "",
      });

      setEditing({
        nickname: data.nickname ?? "",
        preferredTheme: data.preferredTheme ?? "",
        homeLocation: data.homeLocation ?? "",
      });
    });
  }, [withLoading]);

  // 👉 저장 (PATCH /users/me)
  const onSave = async (e) => {
    e.preventDefault();
    if (!edited || saving) return;
    setSaving(true);
    setErrorMsg("");

    await withLoading(async () => {
      const res = await fetch(`${API_BASE}/users/me`, {
        method: "PATCH",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: editing.nickname,
          preferredTheme: editing.preferredTheme,
          homeLocation: editing.homeLocation,
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

  // ID 변경/중복확인: 명세에 없음 → 안내만
  const onCheckId = () =>
    showAlert("운영 중 ID 변경/중복확인은 제공하지 않아요. 회원가입에서만 확인합니다.");

  // PW 변경: 아직 명세/백엔드 없음 → 안내만
  const openPw = () => {
    setNewPw("");
    setNewPw2("");
    setPwOpen(true);
  };

  const submitPw = () => {
    if (!pwValid) {
      showAlert("영문/숫자 포함 8자 이상으로 입력해 주세요.");
      return;
    }
    if (!pwMatch) {
      showAlert("비밀번호가 일치하지 않아요.");
      return;
    }

    showAlert("비밀번호 변경 API는 새 명세에 아직 정의되지 않았어요.\n백엔드 준비 후 연결될 예정입니다.");
    setPwOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#B7DED1]/30">
      <Header title="계정 설정" />
      <main className="mx-auto max-w-[420px] px-4 pb-16">
        <section className="mt-6 rounded-2xl border border-[#E6D9CC] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-[#8A6B52]">계정 설정</h1>
          </div>

          <form onSubmit={onSave} className="space-y-4">
            {/* ID (읽기전용 + 중복확인 비활성) */}
            <div>
              <label className="mb-1 block text-sm font-medium text-[#8A6B52]">
                ID
              </label>
              <div className="flex gap-2">
                <input
                  value={me.loginId}
                  readOnly
                  className="flex-1 rounded-xl border border-[#E6D9CC] bg-[#F9F7F3] px-3 py-2 text-[#6B7280]"
                />
                <button
                  type="button"
                  onClick={onCheckId}
                  disabled
                  title="회원가입에서만 제공"
                  className="shrink-0 cursor-not-allowed rounded-xl border border-[#E6D9CC] bg-[#F6F1EA] px-3 text-sm text-[#8A6B52]/60"
                >
                  중복확인
                </button>
              </div>
            </div>

            {/* PW 변경 버튼 (API 준비 중) */}
            <div>
              <label className="mb-1 block text-sm font-medium text-[#8A6B52]">
                PW
              </label>
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

            {/* 이름 (읽기 전용) */}
            <Field
              label="이름"
              value={me.name}
              readOnly
              placeholder=""
            />

            {/* 생년월일 (읽기 전용) */}
            <div>
              <label className="mb-1 block text-sm font-medium text-[#8A6B52]">
                생년월일
              </label>
              <input
                type="date"
                value={me.birthDate}
                readOnly
                className="w-full rounded-xl border border-[#E6D9CC] bg-[#F9F7F3] px-3 py-2 text-[#6B7280]"
              />
            </div>

            {/* 이메일 (읽기 전용) */}
            <Field
              label="이메일"
              value={me.email}
              readOnly
              placeholder="example@email.com"
            />

            {/* 👇 여기부터가 실제로 PATCH 되는 필드들 */}

            <Field
              label="닉네임"
              value={editing.nickname}
              placeholder="프로필에 표시될 이름"
              onChange={(v) => setEditing((s) => ({ ...s, nickname: v }))}
            />

            <Field
              label="테마 선호"
              value={editing.preferredTheme}
              placeholder="예: LIGHT / DARK / SYSTEM"
              onChange={(v) => setEditing((s) => ({ ...s, preferredTheme: v }))}
            />

            <Field
              label="기본 지역"
              value={editing.homeLocation}
              placeholder="예: 경기 양주시"
              onChange={(v) => setEditing((s) => ({ ...s, homeLocation: v }))}
            />

            {!!errorMsg && (
              <p className="text-sm text-[#C62828]">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={!edited || saving}
              className={`mt-2 w-full rounded-2xl px-4 py-3 font-semibold text-white shadow transition
                ${
                  !edited || saving
                    ? "bg-[#2F6D62]/30"
                    : "bg-[#2F6D62] hover:brightness-110"
                }`}
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </form>
        </section>
      </main>

      {/* 비밀번호 변경 모달 (현재는 안내용만) */}
      {pwOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="w-[90%] max-w-md rounded-2xl border border-[#E6D9CC] bg-white p-5 shadow-lg">
            <p className="mb-3 text-sm font-semibold text-[#8A6B52]">
              비밀번호 입력
            </p>
            <p className="mb-3 text-xs text-[#8A6B52]/70">
              영문/숫자를 포함한 8자 이상
            </p>

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
              <p className="mt-1 text-xs text-[#C62828]">
                조건을 만족하지 않아요.
              </p>
            )}
            {!pwMatch && newPw2 && (
              <p className="mt-1 text-xs text-[#C62828]">
                비밀번호가 일치하지 않아요.
              </p>
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
                className="rounded-xl bg-[#2F6D62] px-4 py-2 font-semibold text-white hover:brightness-110"
              >
                변경
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 공통 성공 모달 (정보 저장 / 추후 비번 변경에도 사용 가능) */}
      {successOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="w-[90%] max-w-md rounded-2xl border border-[#E6D9CC] bg-white p-6 shadow-lg">
            <p className="mb-4 text-center text-lg font-semibold text-[#2F6D62]">
              변경되었습니다
            </p>
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

/* ---------- 작은 UI 컴포넌트들 ---------- */
function Field({ label, value, onChange, placeholder, readOnly = false }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-[#8A6B52]">
        {label}
      </label>
      <div className="relative">
        <input
          value={value}
          onChange={readOnly ? undefined : (e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full rounded-xl border border-[#E6D9CC] px-3 py-2 outline-none
            ${
              readOnly
                ? "bg-[#F9F7F3] text-[#6B7280]"
                : "focus:ring-2 focus:ring-[#F07818]/30"
            }`}
        />
        {!readOnly && value && onChange && (
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
  try {
    return await res.json();
  } catch {
    return null;
  }
}
