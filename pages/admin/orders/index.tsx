import { useEffect, useState } from "react";
import AdminLayout from "../../../libs/components/admin/AdminLayout";
import { gqlRequest, getToken } from "../../../lib/gql";

// ── Types ─────────────────────────────────────────────────────
interface OrderMember {
  memberNick: string;
  memberPhone: string;
}

interface Order {
  _id: string;
  member: OrderMember;
  phone: string;
  orderStatus: string;
  serviceCollection: string;
  serviceDetail: string;
  serviceType: string;
  serviceArea: string;
  createdAt: string;
}

// ── GQL strings ───────────────────────────────────────────────
const GET_ORDERS = `
  query GetAllOrders($input: OrdersInquiry!) {
    getAllOrdersByAdmin(input: $input) {
      list {
        _id
        member {
          memberNick
          memberPhone
        }
        phone
        orderStatus
        serviceCollection
        serviceDetail
        serviceType
        serviceArea
        createdAt
      }
      metaCounter { total }
    }
  }
`;

const UPDATE_ORDER_STATUS = `
  mutation UpdateOrderByAdmin($input: OrderUpdate!) {
    updateOrderByAdmin(input: $input) {
      _id
      orderStatus
    }
  }
`;

// ── Helpers ───────────────────────────────────────────────────
const PAGE_LIMIT = 10;
const ORDER_STATUSES = ["PAUSE", "PROCESS", "FINISH", "CANCELLED"];

const STATUS_LABELS: Record<string, string> = {
  PAUSE: "Kutilmoqda",
  PROCESS: "Jarayonda",
  FINISH: "Yakunlandi",
  CANCELLED: "Bekor qilindi",
};

const fmt = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// ── Component ─────────────────────────────────────────────────
const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  const fetchOrders = async (p: number, status: string) => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const search: Record<string, unknown> = {};
      if (status) search.orderStatus = status;

      const data = await gqlRequest(
        GET_ORDERS,
        { input: { page: p, limit: PAGE_LIMIT, search } },
        token
      );
      setOrders(data.getAllOrdersByAdmin.list ?? []);
      const mc = data.getAllOrdersByAdmin.metaCounter;
      setTotal(Array.isArray(mc) ? (mc[0]?.total ?? 0) : (mc?.total ?? 0));
    } catch (err: any) {
      if (err.message === "No data is found!") {
        setOrders([]);
        setTotal(0);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(page, filterStatus); }, [page, filterStatus]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
    setPage(1);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      const token = getToken();
      await gqlRequest(
        UPDATE_ORDER_STATUS,
        { input: { orderId: orderId, orderStatus: newStatus } },
        token
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err: any) {
      alert(`Status yangilanmadi: ${err.message}`);
    } finally {
      setUpdating(null);
    }
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <AdminLayout>
      <h1 className="admin-page-title">Buyurtmalar</h1>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span className="admin-table-header__title">
            Barcha buyurtmalar ({total})
          </span>
          <select
            className="admin-select"
            value={filterStatus}
            onChange={handleFilterChange}
          >
            <option value="">Barcha statuslar</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>

        {error && <div className="admin-error-msg" style={{ margin: "16px 24px" }}>{error}</div>}

        {loading ? (
          <div className="admin-loading">Yuklanmoqda...</div>
        ) : orders.length === 0 ? (
          <div className="admin-empty">Buyurtmalar topilmadi</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Mijoz</th>
                <th>Telefon</th>
                <th>Xizmat</th>
                <th>Detal</th>
                <th>Turi</th>
                <th>Hudud</th>
                <th>Status</th>
                <th>Sana</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={order._id}>
                  <td>{(page - 1) * PAGE_LIMIT + i + 1}</td>
                  <td>{order.member?.memberNick ?? "—"}</td>
                  <td>{order.member?.memberPhone ?? order.phone}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${order.serviceCollection === "HPLINE" ? "PROCESS" : "ACTIVE"}`}>
                      {order.serviceCollection}
                    </span>
                  </td>
                  <td>{order.serviceDetail}</td>
                  <td>{order.serviceType}</td>
                  <td>{order.serviceArea}</td>
                  <td>
                    <select
                      className="admin-select"
                      value={order.orderStatus}
                      disabled={updating === order._id}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td>{fmt(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="admin-pagination">
            <button
              className="admin-page-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`admin-page-btn${page === p ? " active" : ""}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="admin-page-btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
