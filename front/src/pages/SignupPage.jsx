import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../ui/Header";
import { useLoading } from "../context/LoadingContext";
import { useAlert } from "../context/AlertContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const initial = {
  loginId: "",
  password: "",
  passwordConfirm: "",
  name: "",
  birthDate: "", // yyyy-MM-dd
  email: "",
};

export default function SignupPage() {
  const nav = useNavigate();
  const { withLoading } = useLoading();
  const { showAlert } = useAlert();

  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const idValid = useMemo(
    () => /^[a-z0-9_][a-z0-9._-]{3,18}$/.test(form.loginId),
    [form.loginId]
  );
  const pwValid = useMemo(
    () =>
      /[A-Za-z]/.test(form.password) &&
      /[0-9]/.test(form.password) &&
      form.password.length >= 8,
    [form.password]
  );
  const pwMatch = useMemo(
    () => form.password && form.password === form.passwordConfirm,
    [form.password, form.passwordConfirm]
  );
  const nameValid = useMemo(() => form.name.trim().length >= 1, [form.name]);
  const birthValid = useMemo(
    () => /^\d{4}-\d{2}-\d{2}$/.test(form.birthDate),
    [form.birthDate]
  );
  const emailValid = useMemo(
    () =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
      form.email.length <= 120,
    [form.email]
  );

  const allValid =
    idValid && pwValid && pwMatch && nameValid && birthValid && emailValid;

  const onChange = (key) => (e) =>
    setForm((s) => ({ ...s, [key]: e.target.value }));
  const clearField = (key) => () =>
    setForm((s) => ({ ...s, [key]: "" }));

  // 🔹 아이디 중복확인 버튼
  //    → 별도 API 없이, /auth/signup 에서 자동으로 처리된다는 안내만 보여줌
  const checkIdAvailability = () => {
    if (!idValid) {
      showAlert("아이디 형식을 먼저 확인해 주세요.");
      return;
    }
    showAlert(
      "회원가입을 진행하면 /auth/signup 에서 자동으로 아이디 중복을 확인해요.\n이미 사용 중인 아이디면 오류 메시지가 표시됩니다 :)"
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!allValid || submitting) return;
    setSubmitting(true);
    setApiError("");

    await withLoading(async () => {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loginId: form.loginId,
          password: form.password,
          passwordConfirm: form.passwordConfirm,
          name: form.name,
          birthDate: form.birthDate,
          email: form.email,
        }),
      });

      if (!res.ok) {
        const err = await safeJson(res);

        // 🔹 여기서 중복 아이디 에러를 좀 더 친절하게 보여주고 싶으면
        //    백엔드 에러 메시지/코드에 맞춰 조건 분기 추가하면 됨.
        setApiError(
          err?.message ||
            "회원가입에 실패했어요. 입력값을 확인해 주세요."
        );
        setSubmitting(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      setShowSuccess(true);
    });
  };

  const onConfirmSuccess = () => {
    setShowSuccess(false);
    nav("/");
  };

  return (
    <div className="min-h-screen bg-[#B7DED1]/30">
      <Header title="회원가입" />
      <main className="mx-auto max-w-[420px] px-4 pb-16">
        <section className="mt-6 rounded-2xl border border-[#E6D9CC] bg-white p-5 shadow-sm">
          <h1 className="mb-5 text-xl font-semibold text-[#8A6B52]">
            회원가입
          </h1>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* ID */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium text-[#8A6B52]">
                  ID 입력
                </label>
                <span className="text-[11px] text-[#2F6D62]">
                  아이디 중복 확인
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  value={form.loginId}
                  onChange={onChange("loginId")}
                  placeholder="아이디 입력"
                  className="flex-1 rounded-xl border border-[#E6D9CC] px-3 py-2 outline-none focus:ring-2 focus:ring-[#F07818]/30"
                />
                <button
                  type="button"
                  onClick={checkIdAvailability}
                  className="shrink-0 rounded-xl border border-[#E6D9CC] px-3 text-sm text-[#8A6B52] hover:bg-[#F6F1EA]"
                >
                  중복확인
                </button>
                <ClearBtn onClick={clearField("loginId")} />
              </div>
              <p className="mt-1 text-xs text-[#8A6B52]/70">
                영문 소문자·숫자(._-) 4~19자
              </p>
            </div>

            {/* PW */}
            <Field
              label="비밀번호 입력"
              hint="영문/숫자 포함 8자 이상"
              value={form.password}
              onChange={onChange("password")}
              type="password"
              onClear={clearField("password")}
            />
            {/* PW 확인 */}
            <Field
              label="비밀번호 확인"
              value={form.passwordConfirm}
              onChange={onChange("passwordConfirm")}
              type="password"
              placeholder="비밀번호 재입력"
              onClear={clearField("passwordConfirm")}
            />
            {!pwMatch && form.passwordConfirm && (
              <p className="text-xs text-[#C62828]">
                비밀번호가 일치하지 않아요.
              </p>
            )}

            {/* 이름 */}
            <Field
              label="이름"
              value={form.name}
              onChange={onChange("name")}
              onClear={clearField("name")}
            />

            {/* 생년월일 */}
            <div>
              <label className="mb-1 block text-sm font-medium text-[#8A6B52]">
                생년월일
              </label>
              <input
                type="date"
                value={form.birthDate}
                onChange={onChange("birthDate")}
                className="w-full rounded-xl border border-[#E6D9CC] px-3 py-2 outline-none focus:ring-2 focus:ring-[#F07818]/30"
              />
              {!birthValid && form.birthDate && (
                <p className="mt-1 text-xs text-[#C62828]">
                  yyyy-MM-dd 형식
                </p>
              )}
            </div>

            {/* 이메일 */}
            <Field
              label="이메일 주소"
              value={form.email}
              onChange={onChange("email")}
              placeholder="example@email.com"
              onClear={clearField("email")}
            />
            {!emailValid && form.email && (
              <p className="text-xs text-[#C62828]">
                이메일 형식을 확인해 주세요.
              </p>
            )}

            {!!apiError && (
              <p className="text-sm text-[#C62828]">{apiError}</p>
            )}

            {!allValid && (
              <p className="text-xs text-[#C62828]">
                ※ 입력하지 않은 항목이 있거나 형식이 올바르지 않습니다.
              </p>
            )}

            <button
              type="submit"
              disabled={!allValid || submitting}
              className={`mt-2 w-full rounded-2xl px-4 py-3 font-semibold text-white transition shadow
                ${
                  !allValid || submitting
                    ? "bg-[#8A6B52]/40"
                    : "bg-[#F07818] hover:brightness-110"
                }`}
            >
              {submitting ? "가입 중..." : "가입하기"}
            </button>
          </form>
        </section>
      </main>

      {/* 성공 모달 */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[90%] max-w-md rounded-2xl border border-[#E6D9CC] bg-white p-6 shadow-lg">
            <p className="mb-2 text-lg font-semibold text-[#2F6D62]">
              회원가입 성공!
            </p>
            <p className="mb-5 text-sm text-[#6B7280]">
              이제 추천 코스를 저장하고, 포인트를 적립해 보세요.
            </p>
            <div className="flex justify-end">
              <button
                onClick={onConfirmSuccess}
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

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  onClear,
  hint,
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-[#8A6B52]">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl border border-[#E6D9CC] px-3 py-2 outline-none focus:ring-2 focus:ring-[#F07818]/30"
        />
        {value && <ClearBtn onClick={onClear} />}
      </div>
      {hint && (
        <p className="mt-1 text-xs text-[#8A6B52]/70">
          {hint}
        </p>
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
  try {
    return await res.json();
  } catch {
    return null;
  }
}
