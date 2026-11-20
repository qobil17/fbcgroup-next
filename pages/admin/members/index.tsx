import { useEffect, useState } from "react";
import AdminLayout from "../../../libs/components/admin/AdminLayout";
import { gqlRequest, getToken } from "../../../lib/gql";

// ── Types ─────────────────────────────────────────────────────
interface Member {
  _id: string;
  memberNick: string;
  memberPhone: string;
  memberType: string;
  memberStatus: string;
  createdAt: string;
}

// ── GQL strings ───────────────────────────────────────────────
const GET_MEMBERS = `
  query GetAllMembers($input: MembersInquiry!) {
    getAllMembersByAdmin(input: $input) {
      list {
        _id
        memberNick
        memberPhone
        memberType
        memberStatus
        createdAt
      }
      metaCounter { total }
    }
  }
`;

const UPDATE_MEMBER = `
  mutation UpdateMemberByAdmin($input: MemberUpdate!) {
    updateMemberByAdmin(input: $input) {
      _id
      memberStatus
    }
  }
`;

// ── Helpers ───────────────────────────────────────────────────
const PAGE_LIMIT = 10;

const fmt = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// ── Component ─────────────────────────────────────────────────
const AdminMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  const fetchMembers = async (p: number, status: string, type: string) => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const search: Record<string, unknown> = {};
      if (status) search.memberStatus = status;
      if (type) search.memberType = type;

      const data = await gqlRequest(
        GET_MEMBERS,
        { input: { page: p, limit: PAGE_LIMIT, search } },
        token
      );
      setMembers(data.getAllMembersByAdmin.list ?? []);
      const mc = data.getAllMembersByAdmin.metaCounter;
      setTotal(Array.isArray(mc) ? (mc[0]?.total ?? 0) : (mc?.total ?? 0));
    } catch (err: any) {
      if (err.message === "No data is found!") {
        setMembers([]);
        setTotal(0);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(page, filterStatus, filterType); }, [page, filterStatus, filterType]);

  const handleFilterStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
    setPage(1);
  };

  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
    setPage(1);
  };

  const handleToggleBlock = async (member: Member) => {
    const newStatus = member.memberStatus === "ACTIVE" ? "BLOCK" : "ACTIVE";
    const label = newStatus === "BLOCK" ? "bloklash" : "blokdan chiqarish";
    if (!window.confirm(`@${member.memberNick} foydalanuvchisini ${label}ni tasdiqlaysizmi?`)) return;

    setUpdating(member._id);
    try {
      const token = getToken();
      await gqlRequest(
        UPDATE_MEMBER,
        { input: { _id: member._id, memberStatus: newStatus } },
        token
      );
      setMembers((prev) =>
        prev.map((m) => (m._id === member._id ? { ...m, memberStatus: newStatus } : m))
      );
    } catch (err: any) {
      alert(`Yangilanmadi: ${err.message}`);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (member: Member) => {
    if (!window.confirm(`@${member.memberNick} foydalanuvchisini o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.`)) return;
    setUpdating(member._id);
    try {
      const token = getToken();
      await gqlRequest(
        UPDATE_MEMBER,
        { input: { _id: member._id, memberStatus: "DELETE" } },
        token
      );
      setMembers((prev) => prev.filter((m) => m._id !== member._id));
      setTotal((t) => t - 1);
    } catch (err: any) {
      alert(`O'chirib bo'lmadi: ${err.message}`);
    } finally {
      setUpdating(null);
    }
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <AdminLayout>
      <h1 className="admin-page-title">Foydalanuvchilar</h1>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span className="admin-table-header__title">
            Barcha foydalanuvchilar ({total})
          </span>
          <div className="admin-actions">
            <select
              className="admin-select"
              value={filterType}
              onChange={handleFilterTypeChange}
            >
              <option value="">Barcha rollar</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <select
              className="admin-select"
              value={filterStatus}
              onChange={handleFilterStatusChange}
            >
              <option value="">Barcha statuslar</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="BLOCK">BLOCK</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
        </div>

        {error && <div className="admin-error-msg" style={{ margin: "16px 24px" }}>{error}</div>}

        {loading ? (
          <div className="admin-loading">Yuklanmoqda...</div>
        ) : members.length === 0 ? (
          <div className="admin-empty">Foydalanuvchilar topilmadi</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nick</th>
                <th>Telefon</th>
                <th>Rol</th>
                <th>Status</th>
                <th>Ro'yxatdan o'tgan</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={m._id}>
                  <td>{(page - 1) * PAGE_LIMIT + i + 1}</td>
                  <td>{m.memberNick}</td>
                  <td>{m.memberPhone}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${m.memberType}`}>
                      {m.memberType}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge admin-badge--${m.memberStatus}`}>
                      {m.memberStatus}
                    </span>
                  </td>
                  <td>{fmt(m.createdAt)}</td>
                  <td>
                    {m.memberType !== "ADMIN" && (
                      <div className="admin-actions">
                        <button
                          className={`admin-btn admin-btn--${m.memberStatus === "ACTIVE" ? "block" : "unblock"}`}
                          disabled={updating === m._id}
                          onClick={() => handleToggleBlock(m)}
                        >
                          {updating === m._id
                            ? "..."
                            : m.memberStatus === "ACTIVE"
                            ? "Bloklash"
                            : "Blokdan chiqarish"}
                        </button>
                        <button
                          className="admin-btn admin-btn--delete"
                          disabled={updating === m._id}
                          onClick={() => handleDelete(m)}
                        >
                          O'chirish
                        </button>
                      </div>
                    )}
                  </td>
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

export default AdminMembers;
