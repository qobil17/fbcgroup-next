import { useState } from "react";
import { Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import withLayoutAuth from "../../libs/components/layout/LayoutAuth";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import { useAuthContext } from "../../lib/AuthContext";

// GraphQL endpoint — adjust to match backend port
const GQL_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3007/graphql";

// ── GraphQL Mutations ──────────────────────────────────────────────────────────

const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      _id
      memberNick
      memberPhone
      memberImage
      memberType
      memberStatus
      accessToken
    }
  }
`;

const SIGNUP_MUTATION = `
  mutation Signup($input: MemberInput!) {
    signup(input: $input) {
      _id
      memberNick
      memberPhone
      memberImage
      memberType
      memberStatus
      accessToken
    }
  }
`;

async function gqlRequest(query: string, variables: Record<string, unknown>) {
  const res = await fetch(GQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

// ── Types ──────────────────────────────────────────────────────────────────────

interface LoginForm {
  memberNick: string;
  memberPassword: string;
}

interface SignupForm {
  memberNick: string;
  memberPhone: string;
  memberPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  memberNick?: string;
  memberPhone?: string;
  memberPassword?: string;
  confirmPassword?: string;
}

const INITIAL_LOGIN: LoginForm = { memberNick: "", memberPassword: "" };
const INITIAL_SIGNUP: SignupForm = {
  memberNick: "",
  memberPhone: "",
  memberPassword: "",
  confirmPassword: "",
};

// ── Component ─────────────────────────────────────────────────────────────────

const AuthPage = () => {
  const device = useDeviceDetect();
  const router = useRouter();
  const t = useTranslations("auth");
  const { setAuthMember } = useAuthContext();
  const [tab, setTab] = useState<"login" | "signup">("login");

  const [loginForm, setLoginForm] = useState<LoginForm>(INITIAL_LOGIN);
  const [signupForm, setSignupForm] = useState<SignupForm>(INITIAL_SIGNUP);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Validation ─────────────────────────────────────────────────────────────

  const validateLogin = (): FormErrors => {
    const e: FormErrors = {};
    if (!loginForm.memberNick || loginForm.memberNick.length < 3 || loginForm.memberNick.length > 15)
      e.memberNick = t("errors.nick");
    if (!loginForm.memberPassword || loginForm.memberPassword.length < 5 || loginForm.memberPassword.length > 12)
      e.memberPassword = t("errors.password");
    return e;
  };

  const validateSignup = (): FormErrors => {
    const e: FormErrors = {};
    if (!signupForm.memberNick || signupForm.memberNick.length < 3 || signupForm.memberNick.length > 15)
      e.memberNick = t("errors.nick");
    if (!signupForm.memberPhone || signupForm.memberPhone.length < 7)
      e.memberPhone = t("errors.phone");
    if (!signupForm.memberPassword || signupForm.memberPassword.length < 5 || signupForm.memberPassword.length > 12)
      e.memberPassword = t("errors.password");
    if (signupForm.confirmPassword !== signupForm.memberPassword)
      e.confirmPassword = t("errors.confirm");
    return e;
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (serverError) setServerError("");
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (serverError) setServerError("");
  };

  const handleTabSwitch = (next: "login" | "signup") => {
    setTab(next);
    setErrors({});
    setServerError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateLogin();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setServerError("");
    try {
      const data = await gqlRequest(LOGIN_MUTATION, {
        input: {
          memberNick: loginForm.memberNick,
          memberPassword: loginForm.memberPassword,
        },
      });
      const member = data?.login;
      const token = member?.accessToken;
      if (token) {
        setAuthMember(
          {
            _id: member._id,
            memberNick: member.memberNick ?? "",
            memberType: member.memberType ?? "USER",
            memberImage: member.memberImage ?? "",
          },
          token
        );
        window.localStorage.setItem("login", Date.now().toString());
        if (member.memberType === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } catch (err: any) {
      setServerError(err.message ?? t("errors.server"));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateSignup();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setServerError("");
    try {
      const data = await gqlRequest(SIGNUP_MUTATION, {
        input: {
          memberNick: signupForm.memberNick,
          memberPhone: signupForm.memberPhone,
          memberPassword: signupForm.memberPassword,
        },
      });
      const member = data?.signup;
      const token = member?.accessToken;
      if (token) {
        setAuthMember(
          {
            _id: member._id,
            memberNick: member.memberNick ?? "",
            memberType: member.memberType ?? "USER",
            memberImage: member.memberImage ?? "",
          },
          token
        );
        window.localStorage.setItem("login", Date.now().toString());
        router.push("/");
      }
    } catch (err: any) {
      setServerError(err.message ?? t("errors.server"));
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Stack className="auth-page">

      {/* ── Full-width blue banner ── */}
      <section className="auth-hero">
        <div className="auth-hero__content">
          <span className="auth-hero__tag">MIJOZLAR UCHUN</span>
          <h1 className="auth-hero__title">FBC GROUP</h1>
          <p className="auth-hero__slogan">Xizmatlarimizdan foydalanish uchun tizimga kiring</p>
        </div>
      </section>

      {/* ── Form — separate block below banner ── */}
      <div className="auth-form-wrap">
        <div className="auth-card">
            {/* ── Tabs ── */}
            <div className="auth-tabs">
              <button
                className={`auth-tabs__btn${tab === "login" ? " active" : ""}`}
                onClick={() => handleTabSwitch("login")}
              >
                {t("loginTab")}
              </button>
              <button
                className={`auth-tabs__btn${tab === "signup" ? " active" : ""}`}
                onClick={() => handleTabSwitch("signup")}
              >
                {t("signupTab")}
              </button>
            </div>

            {/* ── Server error ── */}
            {serverError && (
              <div className="auth-server-error">{serverError}</div>
            )}

            {/* ── Login form ── */}
            {tab === "login" && (
              <form onSubmit={handleLogin} noValidate>
                <div className="form-group">
                  <label htmlFor="login-nick">{t("nickLabel")}</label>
                  <input
                    id="login-nick"
                    name="memberNick"
                    type="text"
                    className={`form-control${errors.memberNick ? " error" : ""}`}
                    placeholder={t("nickPlaceholder")}
                    value={loginForm.memberNick}
                    onChange={handleLoginChange}
                    minLength={3}
                    maxLength={15}
                    autoComplete="username"
                  />
                  {errors.memberNick && (
                    <span className="form-error">{errors.memberNick}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="login-password">{t("passwordLabel")}</label>
                  <input
                    id="login-password"
                    name="memberPassword"
                    type="password"
                    className={`form-control${errors.memberPassword ? " error" : ""}`}
                    placeholder={t("passwordPlaceholder")}
                    value={loginForm.memberPassword}
                    onChange={handleLoginChange}
                    minLength={5}
                    maxLength={12}
                    autoComplete="current-password"
                  />
                  {errors.memberPassword && (
                    <span className="form-error">{errors.memberPassword}</span>
                  )}
                </div>

                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? t("loading") : t("loginBtn")}
                </button>
              </form>
            )}

            {/* ── Signup form ── */}
            {tab === "signup" && (
              <form onSubmit={handleSignup} noValidate>
                <div className="form-group">
                  <label htmlFor="signup-nick">{t("nickLabel")}</label>
                  <input
                    id="signup-nick"
                    name="memberNick"
                    type="text"
                    className={`form-control${errors.memberNick ? " error" : ""}`}
                    placeholder={t("nickPlaceholderSignup")}
                    value={signupForm.memberNick}
                    onChange={handleSignupChange}
                    minLength={3}
                    maxLength={15}
                    autoComplete="username"
                  />
                  {errors.memberNick && (
                    <span className="form-error">{errors.memberNick}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="signup-phone">{t("phoneLabel")}</label>
                  <input
                    id="signup-phone"
                    name="memberPhone"
                    type="tel"
                    className={`form-control${errors.memberPhone ? " error" : ""}`}
                    placeholder="+998 90 123 45 67"
                    value={signupForm.memberPhone}
                    onChange={handleSignupChange}
                    autoComplete="tel"
                  />
                  {errors.memberPhone && (
                    <span className="form-error">{errors.memberPhone}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="signup-password">{t("passwordLabel")}</label>
                  <input
                    id="signup-password"
                    name="memberPassword"
                    type="password"
                    className={`form-control${errors.memberPassword ? " error" : ""}`}
                    placeholder={t("passwordPlaceholderSignup")}
                    value={signupForm.memberPassword}
                    onChange={handleSignupChange}
                    minLength={5}
                    maxLength={12}
                    autoComplete="new-password"
                  />
                  {errors.memberPassword && (
                    <span className="form-error">{errors.memberPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="signup-confirm">{t("confirmLabel")}</label>
                  <input
                    id="signup-confirm"
                    name="confirmPassword"
                    type="password"
                    className={`form-control${errors.confirmPassword ? " error" : ""}`}
                    placeholder={t("confirmPlaceholder")}
                    value={signupForm.confirmPassword}
                    onChange={handleSignupChange}
                    minLength={5}
                    maxLength={12}
                    autoComplete="new-password"
                  />
                  {errors.confirmPassword && (
                    <span className="form-error">{errors.confirmPassword}</span>
                  )}
                </div>

                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? t("loading") : t("signupBtn")}
                </button>
              </form>
            )}
          </div>

        </div>
    </Stack>
  );
};

export default withLayoutAuth(AuthPage);
