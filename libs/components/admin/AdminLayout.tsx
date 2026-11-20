import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { decodeJWT } from "../../../lib/gql";

interface Props {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: "⊞" },
  { label: "Xizmatlar", href: "/admin/services", icon: "◈" },
  { label: "Buyurtmalar", href: "/admin/orders", icon: "◉" },
  { label: "Foydalanuvchilar", href: "/admin/members", icon: "◎" },
  { label: "Chatbot Leads", href: "/admin/chatbot-leads", icon: "📱" },
];

const AdminLayout = ({ children }: Props) => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    const memberType = localStorage.getItem("memberType");
    const payload = decodeJWT(token);
    const isAdmin =
      memberType === "ADMIN" ||
      (payload && payload.memberType === "ADMIN");
    if (!isAdmin) {
      router.replace("/");
      return;
    }
    setChecking(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("memberType");
    localStorage.removeItem("memberNick");
    localStorage.removeItem("memberImage");
    window.localStorage.setItem("logout", Date.now().toString());
    router.push("/admin/login");
  };

  if (checking) return null;

  return (
    <div className="admin-wrap">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          FBC <span>ADMIN</span>
        </div>

        <nav className="admin-sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-sidebar__link${router.pathname === item.href ? " active" : ""}`}
            >
              <span className="admin-sidebar__link-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <button className="admin-sidebar__logout" onClick={handleLogout}>
            <span className="admin-sidebar__link-icon">⎋</span>
            Chiqish
          </button>
        </div>
      </aside>

      <main className="admin-content">{children}</main>
    </div>
  );
};

export default AdminLayout;
