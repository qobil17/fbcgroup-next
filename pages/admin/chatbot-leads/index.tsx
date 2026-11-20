import { useEffect, useState } from "react";
import AdminLayout from "../../../libs/components/admin/AdminLayout";
import { getToken } from "../../../lib/gql";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/graphql", "") ?? "http://localhost:3007";

interface ChatbotLead {
  _id: string;
  phone: string;
  source: string;
  isRead: boolean;
  createdAt: string;
}

const fmt = (iso: string) => {
  const d = new Date(iso);
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return `${date} ${time}`;
};

const ChatbotLeadsPage = () => {
  const [leads, setLeads] = useState<ChatbotLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [marking, setMarking] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/chatbot-leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: ChatbotLead[] = await res.json();
      setLeads(data);
    } catch (err: any) {
      setError(err.message ?? "Ma'lumot yuklanmadi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleMarkRead = async (id: string) => {
    setMarking(id);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/chatbot-leads/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setLeads((prev) =>
        prev.map((l) => (l._id === id ? { ...l, isRead: true } : l))
      );
    } catch (err: any) {
      alert(`Xatolik: ${err.message}`);
    } finally {
      setMarking(null);
    }
  };

  const unreadCount = leads.filter((l) => !l.isRead).length;

  return (
    <AdminLayout>
      <h1 className="admin-page-title">📱 Chatbot Leads</h1>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span className="admin-table-header__title">
            Jami: {leads.length} ta lead
            {unreadCount > 0 && (
              <span className="chatbot-leads-badge">{unreadCount} yangi</span>
            )}
          </span>
          <button className="admin-btn" onClick={fetchLeads} disabled={loading}>
            Yangilash
          </button>
        </div>

        {error && (
          <div className="admin-error-msg" style={{ margin: "16px 24px" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="admin-loading">Yuklanmoqda...</div>
        ) : leads.length === 0 ? (
          <div className="admin-empty">Hali lead yo'q</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Telefon raqam</th>
                <th>Manba</th>
                <th>Sana va vaqt</th>
                <th>Status</th>
                <th>Amal</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => (
                <tr
                  key={lead._id}
                  className={!lead.isRead ? "chatbot-leads-row--unread" : ""}
                >
                  <td>{i + 1}</td>
                  <td className={!lead.isRead ? "chatbot-leads-phone--unread" : ""}>
                    {lead.phone}
                  </td>
                  <td>
                    <span className="admin-badge admin-badge--PROCESS">
                      {lead.source}
                    </span>
                  </td>
                  <td>{fmt(lead.createdAt)}</td>
                  <td>
                    {lead.isRead ? (
                      <span className="admin-badge admin-badge--ACTIVE">O'qildi</span>
                    ) : (
                      <span className="admin-badge admin-badge--PAUSE">Yangi</span>
                    )}
                  </td>
                  <td>
                    {!lead.isRead && (
                      <button
                        className="admin-btn admin-btn--sm"
                        disabled={marking === lead._id}
                        onClick={() => handleMarkRead(lead._id)}
                      >
                        {marking === lead._id ? "..." : "O'qildi deb belgilash"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default ChatbotLeadsPage;
