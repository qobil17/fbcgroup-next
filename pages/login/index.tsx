import { Alert, Box, Button, Stack, Tab, Tabs, TextField } from "@mui/material";
import { useMutation, useReactiveVar } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import { LOGIN, SIGNUP } from "../../libs/apollo/queries";
import { errorMessage, getApolloClient } from "../../libs/apollo/client";
import { setToken, userVar } from "../../libs/auth";

const Login = () => {
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [nick, setNick] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const [login, { loading: l1 }] = useMutation(LOGIN);
  const [signup, { loading: l2 }] = useMutation(SIGNUP);

  const next = typeof router.query.next === "string" && router.query.next.startsWith("/") ? router.query.next : "/";

  useEffect(() => {
    if (user) router.replace(next);
  }, [user]);

  const validate = () => {
    if (nick.trim().length < 3 || nick.trim().length > 15) return "Login 3–15 belgidan iborat bo'lsin";
    if (password.length < 5 || password.length > 12) return "Parol 5–12 belgidan iborat bo'lsin";
    if (tab === "signup" && phone.trim().length < 7) return "Telefon raqamini kiriting";
    return "";
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);
    setError("");
    try {
      const { data } =
        tab === "login"
          ? await login({ variables: { input: { memberNick: nick.trim(), memberPassword: password } } })
          : await signup({
              variables: {
                input: { memberNick: nick.trim(), memberPassword: password, memberPhone: phone.trim() },
              },
            });
      const token = (data?.login ?? data?.signup)?.accessToken;
      if (!token) throw new Error("Token olinmadi");
      await getApolloClient().resetStore().catch(() => {});
      setToken(token);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <Stack className="auth-page">
      <Stack className="container">
        <Box component="form" className="auth-card" onSubmit={submit}>
          <Tabs value={tab} onChange={(_, v) => (setTab(v), setError(""))} variant="fullWidth" sx={{ mb: 2 }}>
            <Tab value="login" label="Kirish" />
            <Tab value="signup" label="Ro'yxatdan o'tish" />
          </Tabs>
          <TextField label="Login" value={nick} onChange={(e) => setNick(e.target.value)} fullWidth autoComplete="username" />
          {tab === "signup" && (
            <TextField
              label="Telefon raqam"
              placeholder="+998 90 123 45 67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              autoComplete="tel"
            />
          )}
          <TextField
            label="Parol"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            autoComplete={tab === "login" ? "current-password" : "new-password"}
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" size="large" disabled={l1 || l2}>
            {l1 || l2 ? "Kuting..." : tab === "login" ? "Kirish" : "Ro'yxatdan o'tish"}
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(Login);
