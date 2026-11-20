import { useEffect, useRef, useState } from "react";
import AdminLayout from "../../../libs/components/admin/AdminLayout";
import { gqlRequest, getToken } from "../../../lib/gql";
import { uploadImage, getImageUrl, ALLOWED_FORMATS, MAX_FILE_SIZE_MB, ALLOWED_MIME } from "../../../lib/uploadImage";

// ── Types ─────────────────────────────────────────────────────
interface Service {
  _id: string;
  serviceCollection: string;
  serviceTitle: string;
  serviceType: string;
  serviceStatus: string;
  serviceDetail: string;
  serviceArea: string;
  servicePrice: number;
  serviceDesc?: string;
  serviceTitleRu?: string | null;
  serviceTitleEn?: string | null;
  serviceDescRu?: string | null;
  serviceDescEn?: string | null;
  serviceImages: string[];
  serviceViews: number;
  createdAt: string;
}

interface ServiceForm {
  _id?: string;
  serviceCollection: string;
  serviceType: string;
  serviceTitle: string;
  serviceDetail: string;
  serviceArea: string;
  serviceDesc: string;
  serviceTitleRu: string;
  serviceTitleEn: string;
  serviceDescRu: string;
  serviceDescEn: string;
  serviceImages: string[]; // array of uploaded URLs
  serviceStatus: string;
}

const INITIAL_FORM: ServiceForm = {
  serviceCollection: "HPLINE",
  serviceType: "INSTALLATION",
  serviceTitle: "",
  serviceDetail: "HPL",
  serviceArea: "EXTERIOR",
  serviceDesc: "",
  serviceTitleRu: "",
  serviceTitleEn: "",
  serviceDescRu: "",
  serviceDescEn: "",
  serviceImages: [],
  serviceStatus: "ACTIVE",
};

const DETAIL_MAP: Record<string, string[]> = {
  HPLINE: ["HPL", "ALIKAFON", "GRANITE", "SERANIT"],
  ALIF: ["LED", "DECORATIVE", "EMERGENCY_LIGHT"],
};

// ── GQL strings ───────────────────────────────────────────────
const GET_SERVICES = `
  query GetAllServices($input: AllServicesInquiry!) {
    getAllServicesByAdmin(input: $input) {
      list {
        _id
        serviceCollection
        serviceTitle
        serviceType
        serviceStatus
        serviceDetail
        serviceArea
        servicePrice
        serviceDesc
        serviceTitleRu
        serviceTitleEn
        serviceDescRu
        serviceDescEn
        serviceImages
        serviceViews
        createdAt
      }
      metaCounter { total }
    }
  }
`;

const CREATE_SERVICE = `
  mutation CreateService($input: ServiceInput!) {
    createService(input: $input) {
      _id
      serviceTitle
    }
  }
`;

const UPDATE_SERVICE = `
  mutation UpdateService($input: ServiceUpdate!) {
    updateService(input: $input) {
      _id
      serviceTitle
      serviceStatus
    }
  }
`;

const REMOVE_SERVICE = `
  mutation RemoveService($serviceId: String!) {
    removeServiceByAdmin(serviceId: $serviceId) {
      _id
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
// Nom (3+ belgi) va tavsif (5+ belgi) uch tilda majburiy
const LANG_FIELDS: { lang: "uz" | "ru" | "en"; title: keyof ServiceForm; desc: keyof ServiceForm; name: string }[] = [
  { lang: "uz", title: "serviceTitle", desc: "serviceDesc", name: "o'zbekcha" },
  { lang: "ru", title: "serviceTitleRu", desc: "serviceDescRu", name: "ruscha" },
  { lang: "en", title: "serviceTitleEn", desc: "serviceDescEn", name: "inglizcha" },
];

function missingTranslations(form: ServiceForm) {
  const out: { lang: "uz" | "ru" | "en"; label: string }[] = [];
  for (const f of LANG_FIELDS) {
    if (String(form[f.title] ?? "").trim().length < 3) out.push({ lang: f.lang, label: `nomi (${f.name})` });
    if (String(form[f.desc] ?? "").trim().length < 5) out.push({ lang: f.lang, label: `tavsif (${f.name})` });
  }
  return out;
}

const langFilled = (form: ServiceForm, lang: "uz" | "ru" | "en") => !missingTranslations(form).some((m) => m.lang === lang);

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ServiceForm>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [lang, setLang] = useState<"uz" | "ru" | "en">("uz");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  const fetchServices = async (p: number) => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const data = await gqlRequest(
        GET_SERVICES,
        { input: { page: p, limit: PAGE_LIMIT, search: {} } },
        token
      );
      setServices(data.getAllServicesByAdmin.list ?? []);
      const mc = data.getAllServicesByAdmin.metaCounter;
      setTotal(Array.isArray(mc) ? (mc[0]?.total ?? 0) : (mc?.total ?? 0));
    } catch (err: any) {
      if (err.message?.includes("No data")) {
        setServices([]);
        setTotal(0);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(page); }, [page]);

  // ── Image upload ───────────────────────────────────────────
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME.includes(file.type)) {
      setModalError(`Faqat ${ALLOWED_FORMATS} formatlar qabul qilinadi`);
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setModalError(`Fayl hajmi ${MAX_FILE_SIZE_MB}MB dan oshmasligi kerak`);
      return;
    }
    if (form.serviceImages.length >= 15) {
      setModalError("Maksimal 15 ta rasm yuklash mumkin");
      return;
    }

    setUploading(true);
    setModalError("");
    try {
      const token = getToken();
      const url = await uploadImage(file, "services", token);
      setForm((f) => ({ ...f, serviceImages: [...f.serviceImages, url] }));
    } catch (err: any) {
      setModalError(`Rasm yuklanmadi: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setForm((f) => ({
      ...f,
      serviceImages: f.serviceImages.filter((_, i) => i !== index),
    }));
  };

  // ── Modal handlers ─────────────────────────────────────────
  const openCreate = () => {
    setLang("uz");
    setForm(INITIAL_FORM);
    setModalError("");
    setModalOpen(true);
  };

  const openEdit = (s: Service) => {
    setLang("uz");
    setForm({
      _id: s._id,
      serviceCollection: s.serviceCollection,
      serviceType: s.serviceType,
      serviceTitle: s.serviceTitle,
      serviceDetail: s.serviceDetail,
      serviceArea: s.serviceArea,
      serviceDesc: s.serviceDesc ?? "",
      serviceTitleRu: s.serviceTitleRu ?? "",
      serviceTitleEn: s.serviceTitleEn ?? "",
      serviceDescRu: s.serviceDescRu ?? "",
      serviceDescEn: s.serviceDescEn ?? "",
      serviceImages: s.serviceImages ?? [],
      serviceStatus: s.serviceStatus,
    });
    setModalError("");
    setModalOpen(true);
  };

  const handleCollectionChange = (col: string) => {
    const firstDetail = DETAIL_MAP[col]?.[0] ?? "";
    setForm((f) => ({ ...f, serviceCollection: col, serviceDetail: firstDetail }));
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "serviceCollection") {
      handleCollectionChange(value);
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = missingTranslations(form);
    if (missing.length) {
      setLang(missing[0].lang);
      setModalError(`To'ldiring: ${missing.map((m) => m.label).join(", ")}`);
      return;
    }
    if (form.serviceImages.length === 0) { setModalError("Kamida 1 ta rasm yuklang"); return; }

    setSubmitting(true);
    setModalError("");
    const token = getToken();

    try {
      if (form._id) {
        await gqlRequest(UPDATE_SERVICE, {
          input: {
            _id: form._id,
            serviceCollection: form.serviceCollection,
            serviceType: form.serviceType,
            serviceTitle: form.serviceTitle,
            serviceDetail: form.serviceDetail,
            serviceArea: form.serviceArea,
            serviceDesc: form.serviceDesc.trim(),
            serviceTitleRu: form.serviceTitleRu.trim(),
            serviceTitleEn: form.serviceTitleEn.trim(),
            serviceDescRu: form.serviceDescRu.trim(),
            serviceDescEn: form.serviceDescEn.trim(),
            serviceImages: form.serviceImages,
            serviceStatus: form.serviceStatus,
          },
        }, token);
      } else {
        await gqlRequest(CREATE_SERVICE, {
          input: {
            serviceCollection: form.serviceCollection,
            serviceType: form.serviceType,
            serviceTitle: form.serviceTitle,
            serviceDetail: form.serviceDetail,
            serviceArea: form.serviceArea,
            serviceDesc: form.serviceDesc.trim(),
            serviceTitleRu: form.serviceTitleRu.trim(),
            serviceTitleEn: form.serviceTitleEn.trim(),
            serviceDescRu: form.serviceDescRu.trim(),
            serviceDescEn: form.serviceDescEn.trim(),
            serviceImages: form.serviceImages,
          },
        }, token);
      }
      setModalOpen(false);
      fetchServices(page);
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Two-step delete: set status DELETE → then hard delete
  const handleDelete = async (s: Service) => {
    if (!window.confirm(`"${s.serviceTitle}" xizmatini o'chirishni tasdiqlaysizmi?`)) return;
    const token = getToken();
    try {
      // Step 1: mark as DELETE so removeServiceByAdmin can find it
      if (s.serviceStatus !== "DELETE") {
        await gqlRequest(UPDATE_SERVICE, {
          input: { _id: s._id, serviceStatus: "DELETE" },
        }, token);
      }
      // Step 2: hard delete
      await gqlRequest(REMOVE_SERVICE, { serviceId: s._id }, token);
      fetchServices(page);
    } catch (err: any) {
      alert(`O'chirib bo'lmadi: ${err.message}`);
    }
  };

  const detailOptions = DETAIL_MAP[form.serviceCollection] ?? [];

  // ── Render ─────────────────────────────────────────────────
  return (
    <AdminLayout>
      <h1 className="admin-page-title">Xizmatlar</h1>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span className="admin-table-header__title">Barcha xizmatlar ({total})</span>
          <button className="admin-add-btn" onClick={openCreate}>+ Yangi xizmat</button>
        </div>

        {error && <div className="admin-error-msg" style={{ margin: "16px 24px" }}>{error}</div>}

        {loading ? (
          <div className="admin-loading">Yuklanmoqda...</div>
        ) : services.length === 0 ? (
          <div className="admin-empty">Xizmatlar topilmadi</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nomi</th>
                <th>Kolleksiya</th>
                <th>Detal</th>
                <th>Turi</th>
                <th>Narx</th>
                <th>Status</th>
                <th>Ko'rishlar</th>
                <th>Sana</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s, i) => (
                <tr key={s._id}>
                  <td>{(page - 1) * PAGE_LIMIT + i + 1}</td>
                  <td>{s.serviceTitle}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${s.serviceCollection === "HPLINE" ? "PROCESS" : "ACTIVE"}`}>
                      {s.serviceCollection}
                    </span>
                  </td>
                  <td>{s.serviceDetail}</td>
                  <td>{s.serviceType}</td>
                  <td>{s.servicePrice?.toLocaleString()} so'm</td>
                  <td>
                    <span className={`admin-badge admin-badge--${s.serviceStatus}`}>{s.serviceStatus}</span>
                  </td>
                  <td>{s.serviceViews}</td>
                  <td>{fmt(s.createdAt)}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-btn admin-btn--edit" onClick={() => openEdit(s)}>
                        Tahrirlash
                      </button>
                      <button className="admin-btn admin-btn--delete" onClick={() => handleDelete(s)}>
                        O'chirish
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="admin-pagination">
            <button className="admin-page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`admin-page-btn${page === p ? " active" : ""}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="admin-page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="admin-modal">
            <h2 className="admin-modal__title">
              {form._id ? "Xizmatni tahrirlash" : "Yangi xizmat qo'shish"}
            </h2>

            {modalError && <div className="admin-error-msg">{modalError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Kolleksiya</label>
                  <select name="serviceCollection" className="admin-form-control" value={form.serviceCollection} onChange={handleFormChange}>
                    <option value="HPLINE">HPLINE</option>
                    <option value="ALIF">ALIF</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Detal</label>
                  <select name="serviceDetail" className="admin-form-control" value={form.serviceDetail} onChange={handleFormChange}>
                    {detailOptions.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Nom va tavsif — uch tilda. RU/EN bo'sh qolsa saytda o'zbekchasi ko'rinadi */}
              <div className="admin-lang-tabs">
                {(["uz", "ru", "en"] as const).map((l) => {
                  const filled = langFilled(form, l);
                  return (
                    <button
                      type="button"
                      key={l}
                      className={`admin-lang-tab${lang === l ? " active" : ""}${filled ? " filled" : " missing"}`}
                      onClick={() => setLang(l)}
                      title={filled ? "To'ldirilgan" : "Nom va tavsifni to'ldiring"}
                    >
                      {l.toUpperCase()} {filled ? "✓" : "*"}
                    </button>
                  );
                })}
                <span className="admin-lang-note">Nom va tavsif uchala tilda majburiy</span>
              </div>
              {lang === "uz" ? (
                <>
                  <div className="admin-form-group">
                    <label>Nomi (o'zbekcha) * (3–200 belgi)</label>
                    <input name="serviceTitle" type="text" className="admin-form-control" placeholder="Xizmat nomi" value={form.serviceTitle} onChange={handleFormChange} maxLength={200} />
                  </div>
                  <div className="admin-form-group">
                    <label>Tavsif (o'zbekcha) * (kamida 5 belgi)</label>
                    <textarea name="serviceDesc" className="admin-form-control admin-form-control--textarea" placeholder="Xizmat haqida qo'shimcha ma'lumot..." value={form.serviceDesc} onChange={handleFormChange} />
                  </div>
                </>
              ) : (
                <>
                  <div className="admin-form-group">
                    <label>{lang === "ru" ? "Nomi (ruscha)" : "Nomi (inglizcha)"} * (3–200 belgi)</label>
                    <input
                      name={lang === "ru" ? "serviceTitleRu" : "serviceTitleEn"}
                      type="text"
                      className="admin-form-control"
                      placeholder={lang === "ru" ? "Название услуги" : "Service name"}
                      value={lang === "ru" ? form.serviceTitleRu : form.serviceTitleEn}
                      onChange={handleFormChange}
                      maxLength={200}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>{lang === "ru" ? "Tavsif (ruscha)" : "Tavsif (inglizcha)"} * (kamida 5 belgi)</label>
                    <textarea
                      name={lang === "ru" ? "serviceDescRu" : "serviceDescEn"}
                      className="admin-form-control admin-form-control--textarea"
                      placeholder={lang === "ru" ? "Описание услуги..." : "Service description..."}
                      value={lang === "ru" ? form.serviceDescRu : form.serviceDescEn}
                      onChange={handleFormChange}
                    />
                  </div>
                </>
              )}

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Xizmat turi</label>
                  <select name="serviceType" className="admin-form-control" value={form.serviceType} onChange={handleFormChange}>
                    <option value="DELIVERY">DELIVERY</option>
                    <option value="INSTALLATION">INSTALLATION</option>
                    <option value="FULL_PROJECT">FULL_PROJECT</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Hudud</label>
                  <select name="serviceArea" className="admin-form-control" value={form.serviceArea} onChange={handleFormChange}>
                    <option value="EXTERIOR">EXTERIOR</option>
                    <option value="INTERIOR">INTERIOR</option>
                  </select>
                </div>
              </div>

              {form._id && (
                <div className="admin-form-group">
                  <label>Status</label>
                  <select name="serviceStatus" className="admin-form-control" value={form.serviceStatus} onChange={handleFormChange}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
              )}

              {/* Image upload */}
              <div className="admin-form-group">
                <label>
                  Rasmlar * (kamida 1, maks 15 · {ALLOWED_FORMATS} · maks {MAX_FILE_SIZE_MB}MB)
                </label>
                <div className="admin-image-upload">
                  {form.serviceImages.map((url, i) => (
                    <div key={i} className="admin-image-preview">
                      <img src={getImageUrl(url)} alt={`img-${i}`} />
                      <button type="button" className="admin-image-remove" onClick={() => removeImage(i)}>×</button>
                    </div>
                  ))}
                  {form.serviceImages.length < 15 && (
                    <label className="admin-image-add">
                      {uploading ? "Yuklanmoqda..." : "+ Rasm qo'shish"}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>
              </div>


              <div className="admin-modal__actions">
                <button type="button" className="admin-modal__cancel" onClick={() => setModalOpen(false)}>Bekor qilish</button>
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

export default AdminServices;
