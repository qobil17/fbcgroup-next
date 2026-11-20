import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { decodeJWT } from "../../../lib/gql";

const GQL_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3007/graphql";

const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      _id
      memberNick
      memberType
      memberStatus
      accessToken
    }
  }
`;

async function gqlLogin(memberNick: string, memberPassword: string) {
  const res = await fetch(GQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: LOGIN_MUTATION,
      variables: { input: { memberNick, memberPassword } },
    }),
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data?.login;
}

interface FormState {
  memberNick: string;
  memberPassword: string;
}

interface FormErrors {
  memberNick?: string;
  memberPassword?: string;
}

const AdminLogin = () => {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ memberNick: "", memberPassword: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in as admin, skip directly to dashboard
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const memberType = localStorage.getItem("memberType");
    const payload = decodeJWT(token);
    const isAdmin =
      memberType === "ADMIN" ||
      (payload && payload.memberType === "ADMIN");
    if (isAdmin) router.replace("/admin");
  }, []);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.memberNick || form.memberNick.length < 3 || form.memberNick.length > 15)
      e.memberNick = "Login 3–15 belgidan iborat bo'lishi kerak";
    if (!form.memberPassword || form.memberPassword.length < 5 || form.memberPassword.length > 12)
      e.memberPassword = "Parol 5–12 belgidan iborat bo'lishi kerak";
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setServerError("");
    try {
      const member = await gqlLogin(form.memberNick, form.memberPassword);
      if (!member?.accessToken) throw new Error("Token olinmadi");

      if (member.memberType !== "ADMIN") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("memberType");
        setServerError("Sizda admin huquqi yo'q");
        return;
      }

      localStorage.setItem("accessToken", member.accessToken);
      localStorage.setItem("memberType", member.memberType);
      window.localStorage.setItem("login", Date.now().toString());
      router.push("/admin");
    } catch (err: any) {
      setServerError(err.message ?? "Xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {/* Logo */}
        <div className="admin-login-card__logo">
          <h1>FBC <span>ADMIN</span></h1>
          <p>Boshqaruv paneliga kirish</p>
        </div>

        {/* Server error */}
        {serverError && (
          <div className="admin-login-card__server-error">{serverError}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Nick */}
          <div className="admin-login-card__group">
            <label htmlFor="admin-nick">Login (nick)</label>
            <input
              id="admin-nick"
              name="memberNick"
              type="text"
              className={`admin-login-card__input${errors.memberNick ? " error" : ""}`}
              placeholder="Admin nomi"
              value={form.memberNick}
              onChange={handleChange}
              minLength={3}
              maxLength={15}
              autoComplete="username"
              autoFocus
            />
            {errors.memberNick && (
              <span className="admin-login-card__field-error">{errors.memberNick}</span>
            )}
          </div>

          {/* Password */}
          <div className="admin-login-card__group">
            <label htmlFor="admin-password">Parol</label>
            <input
              id="admin-password"
              name="memberPassword"
              type="password"
              className={`admin-login-card__input${errors.memberPassword ? " error" : ""}`}
              placeholder="••••••••"
              value={form.memberPassword}
              onChange={handleChange}
              minLength={5}
              maxLength={12}
              autoComplete="current-password"
            />
            {errors.memberPassword && (
              <span className="admin-login-card__field-error">{errors.memberPassword}</span>
            )}
          </div>

          <button
            type="submit"
            className="admin-login-card__btn"
            disabled={loading}
          >
            {loading ? "Tekshirilmoqda..." : "Kirish"}
          </button>
        </form>

        {process.env.NODE_ENV === "development" && (
          <div className="admin-login-card__dev-hint">
            Dev: <strong>admin</strong> / <strong>admin1234</strong>
          </div>
        )}

        <a href="/" className="admin-login-card__back">
          ← Asosiy sahifaga qaytish
        </a>
      </div>
    </div>
  );
};

export default AdminLogin;
