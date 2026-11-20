import { useEffect, useRef, useState } from "react";
import AdminLayout from "../../../libs/components/admin/AdminLayout";
import { gqlRequest, getToken } from "../../../lib/gql";
import { getImageUrl, uploadImages, ACCEPT_ATTR, ALLOWED_FORMATS, MAX_FILE_SIZE_MB } from "../../../lib/uploadImage";
import {
  ADMIN_CREATE_PARTNER,
  ADMIN_GET_PARTNERS,
  ADMIN_REMOVE_PARTNER,
  ADMIN_UPDATE_PARTNER,
  Partner,
} from "../../../lib/projects";

// Hamkorlar — admin boshqaruvi

interface PartnerForm {
  _id?: string;
  partnerName: string;
  partnerLogo: string;
  partnerLink: string;
  partnerDesc: string;
  partnerOrder: string;
  partnerStatus: "ACTIVE" | "HIDDEN";
}

const EMPTY: PartnerForm = {
  partnerName: "",
  partnerLogo: "",
  partnerLink: "",
  partnerDesc: "",
  partnerOrder: "0",
  partnerStatus: "ACTIVE",
};

const AdminPartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<PartnerForm>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modalError, setModalError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchPartners = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await gqlRequest(ADMIN_GET_PARTNERS, {}, getToken());
      setPartners(data.getAllPartnersByAdmin ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (fileRef.current) fileRef.current.value = "";
    if (!file) return;
    setUploading(true);
    setModalError("");
    try {
      const [url] = await uploadImages([file], "partners", getToken());
      setForm((f) => ({ ...f, partnerLogo: url }));
    } catch (err: any) {
      setModalError(`Logo yuklanmadi — ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const openCreate = () => {
    const nextOrder = partners.length ? Math.max(...partners.map((p) => p.partnerOrder)) + 1 : 0;
    setForm({ ...EMPTY, partnerOrder: String(nextOrder) });
    setModalError("");
    setModalOpen(true);
  };

  const openEdit = (p: Partner) => {
    setForm({
      _id: p._id,
      partnerName: p.partnerName,
      partnerLogo: p.partnerLogo,
      partnerLink: p.partnerLink ?? "",
      partnerDesc: p.partnerDesc ?? "",
      partnerOrder: String(p.partnerOrder ?? 0),
      partnerStatus: p.partnerStatus,
    });
    setModalError("");
    setModalOpen(true);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.partnerName.trim().length < 2) return setModalError("Nomi kamida 2 belgi bo'lsin");
    if (!form.partnerLogo) return setModalError("Logotip yuklang");
    let link = form.partnerLink.trim();
    if (link && !/^https?:\/\//i.test(link)) link = `https://${link}`;

    const input: Record<string, unknown> = {
      partnerName: form.partnerName.trim(),
      partnerLogo: form.partnerLogo,
      partnerLink: link || undefined,
      partnerDesc: form.partnerDesc.trim() || undefined,
      partnerOrder: Number(form.partnerOrder) || 0,
      partnerStatus: form.partnerStatus,
    };

    setSubmitting(true);
    setModalError("");
    try {
      if (form._id) await gqlRequest(ADMIN_UPDATE_PARTNER, { input: { _id: form._id, ...input } }, getToken());
      else await gqlRequest(ADMIN_CREATE_PARTNER, { input }, getToken());
      setModalOpen(false);
      fetchPartners();
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (p: Partner) => {
    if (!window.confirm(`"${p.partnerName}" hamkorini o'chirasizmi?`)) return;
    try {
      await gqlRequest(ADMIN_REMOVE_PARTNER, { partnerId: p._id }, getToken());
      fetchPartners();
    } catch (err: any) {
      alert(`O'chirib bo'lmadi: ${err.message}`);
    }
  };

  return (
    <AdminLayout>
      <h1 className="admin-page-title">Hamkorlar</h1>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span className="admin-table-header__title">Barcha hamkorlar ({partners.length})</span>
          <button className="admin-add-btn" onClick={openCreate}>
            + Yangi hamkor
          </button>
        </div>

        {error && <div className="admin-error-msg" style={{ margin: "16px 24px" }}>{error}</div>}

        {loading ? (
          <div className="admin-loading">Yuklanmoqda...</div>
        ) : partners.length === 0 ? (
          <div className="admin-empty">Hali hamkor qo'shilmagan. Saytda "Hamkorlarimiz" bo'limi birinchi hamkor qo'shilgach paydo bo'ladi.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tartib</th>
                <th>Logo</th>
                <th>Nomi</th>
                <th>Sayt</th>
                <th>Holat</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((p) => (
                <tr key={p._id}>
                  <td>{p.partnerOrder}</td>
                  <td>
                    <img className="admin-thumb admin-thumb--logo" src={getImageUrl(p.partnerLogo)} alt={p.partnerName} />
                  </td>
                  <td>{p.partnerName}</td>
                  <td>
                    {p.partnerLink ? (
                      <a href={p.partnerLink} target="_blank" rel="noreferrer">
                        {p.partnerLink.replace(/^https?:\/\//, "")}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <span className={`admin-badge admin-badge--${p.partnerStatus}`}>{p.partnerStatus === "ACTIVE" ? "Saytda" : "Yashirin"}</span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-btn admin-btn--edit" onClick={() => openEdit(p)}>
                        Tahrirlash
                      </button>
                      <button className="admin-btn admin-btn--delete" onClick={() => handleDelete(p)}>
                        O'chirish
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget && !uploading) setModalOpen(false); }}>
          <div className="admin-modal">
            <h2 className="admin-modal__title">{form._id ? "Hamkorni tahrirlash" : "Yangi hamkor"}</h2>
            {modalError && <div className="admin-error-msg">{modalError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label>Logotip * ({ALLOWED_FORMATS} · {MAX_FILE_SIZE_MB} MB gacha · shaffof fonli PNG eng yaxshi)</label>
                <div className="admin-image-upload">
                  {form.partnerLogo && (
                    <div className="admin-image-preview admin-image-preview--logo">
                      <img src={getImageUrl(form.partnerLogo)} alt="logo" />
                      <button type="button" className="admin-image-remove" onClick={() => setForm((f) => ({ ...f, partnerLogo: "" }))}>
                        ×
                      </button>
                    </div>
                  )}
                  <label className="admin-image-add">
                    {uploading ? "Yuklanmoqda..." : form.partnerLogo ? "Almashtirish" : "+ Logo yuklash"}
                    <input ref={fileRef} type="file" accept={ACCEPT_ATTR} style={{ display: "none" }} onChange={handleLogo} disabled={uploading} />
                  </label>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Kompaniya nomi *</label>
                <input name="partnerName" className="admin-form-control" value={form.partnerName} onChange={onChange} maxLength={120} />
              </div>

              <div className="admin-form-group">
                <label>Sayt manzili (ixtiyoriy)</label>
                <input name="partnerLink" className="admin-form-control" placeholder="https://example.uz" value={form.partnerLink} onChange={onChange} />
              </div>

              <div className="admin-form-group">
                <label>Qisqa izoh (ixtiyoriy, logoga sichqoncha olib borilganda ko'rinadi)</label>
                <input name="partnerDesc" className="admin-form-control" value={form.partnerDesc} onChange={onChange} maxLength={300} />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Tartib raqami (kichigi oldinda)</label>
                  <input type="number" name="partnerOrder" className="admin-form-control" value={form.partnerOrder} onChange={onChange} />
                </div>
                <div className="admin-form-group">
                  <label>Holat</label>
                  <select name="partnerStatus" className="admin-form-control" value={form.partnerStatus} onChange={onChange}>
                    <option value="ACTIVE">Saytda ko'rinadi</option>
                    <option value="HIDDEN">Yashirin</option>
                  </select>
                </div>
              </div>

              <div className="admin-modal__actions">
                <button type="button" className="admin-modal__cancel" onClick={() => setModalOpen(false)} disabled={uploading}>
                  Bekor qilish
                </button>
                <button type="submit" className="admin-modal__submit" disabled={submitting || uploading}>
                  {submitting ? "Saqlanmoqda..." : form._id ? "Saqlash" : "Qo'shish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPartners;
