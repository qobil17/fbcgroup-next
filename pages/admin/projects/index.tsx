import { useEffect, useRef, useState } from "react";
import AdminLayout from "../../../libs/components/admin/AdminLayout";
import { gqlRequest, getToken } from "../../../lib/gql";
import {
  getImageUrl,
  uploadImages,
  ACCEPT_ATTR,
  ALLOWED_FORMATS,
  MAX_FILE_SIZE_MB,
} from "../../../lib/uploadImage";
import {
  ADMIN_CREATE_PROJECT,
  ADMIN_GET_PROJECTS,
  ADMIN_REMOVE_PROJECT,
  ADMIN_UPDATE_PROJECT,
  Project,
} from "../../../lib/projects";

// Qilingan ishlar (loyiha hisobotlari) — admin boshqaruvi

const PAGE_LIMIT = 10;
const MAX_IMAGES = 30;

interface ProjectForm {
  _id?: string;
  projectTitle: string;
  projectDesc: string;
  projectCollection: "" | "HPLINE" | "ALIF";
  projectLocation: string;
  projectDate: string; // yyyy-mm-dd
  projectImages: string[];
  projectStatus: "ACTIVE" | "HIDDEN";
}

const EMPTY: ProjectForm = {
  projectTitle: "",
  projectDesc: "",
  projectCollection: "",
  projectLocation: "",
  projectDate: new Date().toISOString().slice(0, 10),
  projectImages: [],
  projectStatus: "ACTIVE",
};

const ymd = (iso?: string | null) => (iso ? new Date(iso).toISOString().slice(0, 10) : "");

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ProjectForm>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  const fetchProjects = async (p: number) => {
    setLoading(true);
    setError("");
    try {
      const data = await gqlRequest(ADMIN_GET_PROJECTS, { input: { page: p, limit: PAGE_LIMIT } }, getToken());
      setProjects(data.getAllProjectsByAdmin.list ?? []);
      setTotal(data.getAllProjectsByAdmin.metaCounter?.[0]?.total ?? 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(page);
  }, [page]);

  // ── Rasmlar: bir nechtasini birdan tanlash mumkin ──
  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (fileRef.current) fileRef.current.value = "";
    if (!files.length) return;
    const room = MAX_IMAGES - form.projectImages.length;
    if (files.length > room) {
      setModalError(`Yana ${room} ta rasm qo'shish mumkin (jami ${MAX_IMAGES} tagacha)`);
      return;
    }
    setModalError("");
    setProgress({ done: 0, total: files.length });
    try {
      const urls = await uploadImages(files, "projects", getToken(), (done, t) => setProgress({ done, total: t }));
      setForm((f) => ({ ...f, projectImages: [...f.projectImages, ...urls] }));
    } catch (err: any) {
      setModalError(`Rasm yuklanmadi — ${err.message}`);
    } finally {
      setProgress(null);
    }
  };

  const removeImage = (i: number) =>
    setForm((f) => ({ ...f, projectImages: f.projectImages.filter((_, idx) => idx !== i) }));

  const makeCover = (i: number) =>
    setForm((f) => {
      const imgs = [...f.projectImages];
      const [img] = imgs.splice(i, 1);
      return { ...f, projectImages: [img, ...imgs] };
    });

  const openCreate = () => {
    setForm({ ...EMPTY, projectDate: new Date().toISOString().slice(0, 10) });
    setModalError("");
    setModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setForm({
      _id: p._id,
      projectTitle: p.projectTitle,
      projectDesc: p.projectDesc,
      projectCollection: (p.projectCollection ?? "") as ProjectForm["projectCollection"],
      projectLocation: p.projectLocation ?? "",
      projectDate: ymd(p.projectDate),
      projectImages: p.projectImages ?? [],
      projectStatus: p.projectStatus,
    });
    setModalError("");
    setModalOpen(true);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.projectTitle.trim().length < 3) return setModalError("Sarlavha kamida 3 belgi bo'lsin");
    if (form.projectDesc.trim().length < 10) return setModalError("Hisobot matni kamida 10 belgi bo'lsin");
    if (form.projectImages.length === 0) return setModalError("Kamida 1 ta rasm yuklang");

    const input: Record<string, unknown> = {
      projectTitle: form.projectTitle.trim(),
      projectDesc: form.projectDesc.trim(),
      projectLocation: form.projectLocation.trim() || undefined,
      projectDate: form.projectDate ? new Date(form.projectDate).toISOString() : undefined,
      projectImages: form.projectImages,
      projectStatus: form.projectStatus,
      ...(form.projectCollection ? { projectCollection: form.projectCollection } : {}),
    };

    setSubmitting(true);
    setModalError("");
    try {
      if (form._id) await gqlRequest(ADMIN_UPDATE_PROJECT, { input: { _id: form._id, ...input } }, getToken());
      else await gqlRequest(ADMIN_CREATE_PROJECT, { input }, getToken());
      setModalOpen(false);
      fetchProjects(form._id ? page : 1);
      if (!form._id) setPage(1);
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (p: Project) => {
    if (!window.confirm(`"${p.projectTitle}" loyihasini butunlay o'chirasizmi?`)) return;
    try {
      await gqlRequest(ADMIN_REMOVE_PROJECT, { projectId: p._id }, getToken());
      fetchProjects(page);
    } catch (err: any) {
      alert(`O'chirib bo'lmadi: ${err.message}`);
    }
  };

  const toggleStatus = async (p: Project) => {
    try {
      await gqlRequest(
        ADMIN_UPDATE_PROJECT,
        { input: { _id: p._id, projectStatus: p.projectStatus === "ACTIVE" ? "HIDDEN" : "ACTIVE" } },
        getToken()
      );
      fetchProjects(page);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const uploading = progress !== null;

  return (
    <AdminLayout>
      <h1 className="admin-page-title">Qilingan ishlar</h1>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span className="admin-table-header__title">Barcha loyihalar ({total})</span>
          <button className="admin-add-btn" onClick={openCreate}>
            + Yangi loyiha
          </button>
        </div>

        {error && <div className="admin-error-msg" style={{ margin: "16px 24px" }}>{error}</div>}

        {loading ? (
          <div className="admin-loading">Yuklanmoqda...</div>
        ) : projects.length === 0 ? (
          <div className="admin-empty">Hali loyiha qo'shilmagan. "+ Yangi loyiha" tugmasini bosing.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Rasm</th>
                <th>Sarlavha</th>
                <th>Yo'nalish</th>
                <th>Manzil</th>
                <th>Sana</th>
                <th>Rasmlar</th>
                <th>Ko'rishlar</th>
                <th>Holat</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img className="admin-thumb" src={getImageUrl(p.projectImages[0])} alt="" />
                  </td>
                  <td style={{ maxWidth: 280 }}>{p.projectTitle}</td>
                  <td>{p.projectCollection ?? "—"}</td>
                  <td>{p.projectLocation || "—"}</td>
                  <td>{ymd(p.projectDate ?? p.createdAt)}</td>
                  <td>{p.projectImages.length}</td>
                  <td>{p.projectViews}</td>
                  <td>
                    <button className={`admin-badge admin-badge--${p.projectStatus}`} onClick={() => toggleStatus(p)} title="Bosib almashtirish">
                      {p.projectStatus === "ACTIVE" ? "Saytda" : "Yashirin"}
                    </button>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <a className="admin-btn admin-btn--edit" href={`/projects/${p._id}`} target="_blank" rel="noreferrer">
                        Ko'rish
                      </a>
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

        {totalPages > 1 && (
          <div className="admin-pagination">
            <button className="admin-page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`admin-page-btn${page === p ? " active" : ""}`} onClick={() => setPage(p)}>
                {p}
              </button>
            ))}
            <button className="admin-page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="admin-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget && !uploading) setModalOpen(false); }}>
          <div className="admin-modal admin-modal--wide">
            <h2 className="admin-modal__title">{form._id ? "Loyihani tahrirlash" : "Yangi loyiha (qilingan ish hisoboti)"}</h2>

            {modalError && <div className="admin-error-msg">{modalError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label>Sarlavha *</label>
                <input name="projectTitle" className="admin-form-control" placeholder="Masalan: Toshkent, Chilonzor — ofis binosi fasadi" value={form.projectTitle} onChange={onChange} maxLength={200} />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Yo'nalish</label>
                  <select name="projectCollection" className="admin-form-control" value={form.projectCollection} onChange={onChange}>
                    <option value="">— Tanlanmagan —</option>
                    <option value="HPLINE">HPLINE (fasad)</option>
                    <option value="ALIF">ALIF LIGHT (yoritish)</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Sana</label>
                  <input type="date" name="projectDate" className="admin-form-control" value={form.projectDate} onChange={onChange} />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Manzil</label>
                  <input name="projectLocation" className="admin-form-control" placeholder="Shahar, tuman" value={form.projectLocation} onChange={onChange} maxLength={200} />
                </div>
                <div className="admin-form-group">
                  <label>Holat</label>
                  <select name="projectStatus" className="admin-form-control" value={form.projectStatus} onChange={onChange}>
                    <option value="ACTIVE">Saytda ko'rinadi</option>
                    <option value="HIDDEN">Yashirin (qoralama)</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label>
                  Rasmlar * — birinchisi muqova bo'ladi ({form.projectImages.length}/{MAX_IMAGES} · {ALLOWED_FORMATS} · har biri {MAX_FILE_SIZE_MB} MB gacha)
                </label>
                <div className="admin-image-upload">
                  {form.projectImages.map((url, i) => (
                    <div key={url} className={`admin-image-preview${i === 0 ? " admin-image-preview--cover" : ""}`}>
                      <img src={getImageUrl(url)} alt={`rasm-${i + 1}`} />
                      {i === 0 ? (
                        <span className="admin-image-cover">Muqova</span>
                      ) : (
                        <button type="button" className="admin-image-make-cover" onClick={() => makeCover(i)}>
                          Muqova qilish
                        </button>
                      )}
                      <button type="button" className="admin-image-remove" onClick={() => removeImage(i)} disabled={uploading}>
                        ×
                      </button>
                    </div>
                  ))}
                  {form.projectImages.length < MAX_IMAGES && (
                    <label className="admin-image-add">
                      {uploading ? `Yuklanmoqda ${progress!.done}/${progress!.total}...` : "+ Rasmlar qo'shish"}
                      <input ref={fileRef} type="file" accept={ACCEPT_ATTR} multiple style={{ display: "none" }} onChange={handleFiles} disabled={uploading} />
                    </label>
                  )}
                </div>
                <small className="admin-hint">
                  Bir nechta rasmni birdan tanlashingiz mumkin. Server rasmlarni sifatini saqlagan holda siqadi, telefon rasmlari ham to'g'ri yo'nalishda chiqadi.
                </small>
              </div>

              <div className="admin-form-group">
                <label>Hisobot matni * — nima qilindi, materiallar, hajm, muddat</label>
                <textarea
                  name="projectDesc"
                  className="admin-form-control admin-form-control--textarea admin-form-control--tall"
                  placeholder={"Masalan:\n\n3 qavatli ofis binosining tashqi fasadi HPL panellar bilan qoplandi. Umumiy maydon — 1 200 m².\n\nIsh muddati: 4 hafta. Panel rangi: antrasit va yog'och teksturasi."}
                  value={form.projectDesc}
                  onChange={onChange}
                  maxLength={20000}
                />
                <small className="admin-hint">Xatboshilarni bo'sh qator bilan ajrating — saytda alohida paragraf bo'lib chiqadi.</small>
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

export default AdminProjects;
