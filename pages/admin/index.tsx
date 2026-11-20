import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../libs/components/admin/AdminLayout";
import { gqlRequest, getToken, decodeJWT } from "../../lib/gql";

const SERVICES_COUNT = `
  query {
    getAllServicesByAdmin(input: { page: 1, limit: 1, search: {} }) {
      metaCounter { total }
    }
  }
`;

const ORDERS_COUNT = `
  query {
    getAllOrdersByAdmin(input: { page: 1, limit: 1, search: {} }) {
      metaCounter { total }
    }
  }
`;

const MEMBERS_COUNT = `
  query {
    getAllMembersByAdmin(input: { page: 1, limit: 1, search: {} }) {
      metaCounter { total }
    }
  }
`;

interface Stats {
  services: number;
  orders: number;
  members: number;
}

const AdminDashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ services: 0, orders: 0, members: 0 });
  const [loading, setLoading] = useState(true);

  // Route guard — runs independently of AdminLayout's guard
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
      localStorage.removeItem("accessToken");
      localStorage.removeItem("memberType");
      router.replace("/");
    }
  }, []);

  useEffect(() => {
    const token = getToken();

    const fetchStat = async (query: string, path: string): Promise<number> => {
      try {
        const data = await gqlRequest(query, {}, token);
        const mc = data[path]?.metaCounter;
        return Array.isArray(mc) ? (mc[0]?.total ?? 0) : (mc?.total ?? 0);
      } catch {
        return 0;
      }
    };

    Promise.all([
      fetchStat(SERVICES_COUNT, "getAllServicesByAdmin"),
      fetchStat(ORDERS_COUNT, "getAllOrdersByAdmin"),
      fetchStat(MEMBERS_COUNT, "getAllMembersByAdmin"),
    ]).then(([services, orders, members]) => {
      setStats({ services, orders, members });
      setLoading(false);
    });
  }, []);

  const cards = [
    { label: "Jami Xizmatlar", value: stats.services, icon: "◈", color: "blue" },
    { label: "Jami Buyurtmalar", value: stats.orders, icon: "◉", color: "green" },
    { label: "Jami Foydalanuvchilar", value: stats.members, icon: "◎", color: "purple" },
  ];

  return (
    <AdminLayout>
      <h1 className="admin-page-title">Dashboard</h1>

      {loading ? (
        <div className="admin-loading">Yuklanmoqda...</div>
      ) : (
        <div className="admin-stats">
          {cards.map((card) => (
            <div key={card.label} className="admin-stat-card">
              <div className={`admin-stat-card__icon admin-stat-card__icon--${card.color}`}>
                {card.icon}
              </div>
              <div>
                <div className="admin-stat-card__value">{card.value}</div>
                <div className="admin-stat-card__label">{card.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
