import { useEffect, useRef, useState } from "react";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useQuery, useMutation, gql } from "@apollo/client";
import withLayoutBasic from "../../../libs/components/layout/LayoutBasic";
import { useAuthContext } from "../../../lib/AuthContext";
import { uploadImage, getImageUrl, ALLOWED_FORMATS, MAX_FILE_SIZE_MB, ALLOWED_MIME } from "../../../lib/uploadImage";
import { getToken } from "../../../lib/gql";
import useDeviceDetect from "../../../libs/hooks/useDeviceDetect";

const GET_MEMBER = gql`
  query GetMember($memberId: String!) {
    getMember(memberId: $memberId) {
      _id
      memberNick
      memberPhone
      memberImage
      memberAdress
      memberDesc
    }
  }
`;

const UPDATE_MEMBER = gql`
  mutation UpdateMember($input: MemberUpdate!) {
    updateMember(input: $input) {
      _id
      memberNick
      memberPhone
      memberImage
      memberAdress
      memberDesc
      accessToken
    }
  }
`;

interface EditForm {
  memberNick: string;
  memberPhone: string;
  memberAdress: string;
  memberDesc: string;
  memberImage: string;
  newPassword: string;
  confirmPassword: string;
}

const INITIAL: EditForm = {
  memberNick: "",
  memberPhone: "",
  memberAdress: "",
  memberDesc: "",
  memberImage: "",
  newPassword: "",
  confirmPassword: "",
};

const MemberEditPage = () => {
  const device = useDeviceDetect();
  const t = useTranslations("member.edit");
  const router = useRouter();
  const { authMember, authReady, setAuthMember } = useAuthContext();
  const [form, setForm] = useState<EditForm>(INITIAL);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [pwError, setPwError] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  const memberId = authMember?._id ?? "";

  const { loading: fetchLoading } = useQuery(GET_MEMBER, {
    variables: { memberId },
    skip: !memberId,
    onCompleted: (data) => {
      const m = data?.getMember;
      if (m) {
        setForm((prev) => ({
          ...prev,
          memberNick: m.memberNick ?? "",
          memberPhone: m.memberPhone ?? "",
          memberAdress: m.memberAdress ?? "",
          memberDesc: m.memberDesc ?? "",
          memberImage: m.memberImage ?? "",
        }));
      }
    },
  });

  const [updateMember, { loading: saving }] = useMutation(UPDATE_MEMBER, {
    onCompleted: (data) => {
      const m = data?.updateMember;
      if (m && authMember) {
        setAuthMember({
          ...authMember,
          memberNick: m.memberNick ?? authMember.memberNick,
          memberImage: m.memberImage !== undefined ? m.memberImage : authMember.memberImage,
        });
        // Update token if server returned a new one
        if (m.accessToken) {
          localStorage.setItem("accessToken", m.accessToken);
        }
      }
      setForm((prev) => ({ ...prev, newPassword: "", confirmPassword: "" }));
      setSaved(true);
    },
  });

  useEffect(() => {
    if (authReady && !authMember) {
      router.replace("/auth");
    }
  }, [authReady, authMember]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (saved) setSaved(false);
    if (name === "newPassword" || name === "confirmPassword") setPwError("");
  };

  // ── Avatar delete ──────────────────────────────────────────
  const handleDeleteAvatar = async () => {
    if (!window.confirm(`Rasmni o'chirmoqchimisiz?`)) return;
    setForm((prev) => ({ ...prev, memberImage: "" }));
    if (saved) setSaved(false);
    try {
      await updateMember({ variables: { input: { _id: memberId, memberImage: "" } } });
    } catch {
      // onError handled by mutation
    }
  };

  // ── Avatar upload ──────────────────────────────────────────
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME.includes(file.type)) {
      setUploadError(`Faqat ${ALLOWED_FORMATS} formatlar qabul qilinadi`);
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setUploadError(`Fayl hajmi ${MAX_FILE_SIZE_MB}MB dan oshmasligi kerak`);
      return;
    }

    setUploading(true);
    setUploadError("");
    try {
      const token = getToken();
      const url = await uploadImage(file, "members", token);
      setForm((prev) => ({ ...prev, memberImage: url }));
      if (saved) setSaved(false);
    } catch (err: any) {
      setUploadError(`Rasm yuklanmadi: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) return;

    // Validate password if provided
    if (form.newPassword || form.confirmPassword) {
      if (form.newPassword.length < 5 || form.newPassword.length > 12) {
        setPwError("Yangi parol 5–12 belgidan iborat bo'lishi kerak");
        return;
      }
      if (form.newPassword !== form.confirmPassword) {
        setPwError("Parollar mos kelmadi");
        return;
      }
    }

    const input: Record<string, any> = { _id: memberId };
    // Only send fields that exist in MemberUpdate DTO; skip empty strings for length-validated fields
    if (form.memberNick && form.memberNick.length >= 3) input.memberNick = form.memberNick;
    if (form.memberPhone && form.memberPhone.trim()) input.memberPhone = form.memberPhone.trim();
    if (form.memberAdress !== undefined) input.memberAdress = form.memberAdress;
    if (form.memberDesc !== undefined) input.memberDesc = form.memberDesc;
    input.memberImage = form.memberImage;
    if (form.newPassword && form.newPassword.length >= 5) input.memberPassword = form.newPassword;

    await updateMember({ variables: { input } });
  };

  const saveBtnLabel = saving ? t("saving") : saved ? t("saved") : t("saveBtn");
  const avatarSrc = form.memberImage
    ? getImageUrl(form.memberImage)
    : "/img/profile/defaultUser.svg";

  if (fetchLoading) {
    return (
      <Stack className="member-page">
        <div className="member-card">
          <p style={{ textAlign: "center", padding: "32px 0" }}>Yuklanmoqda...</p>
        </div>
      </Stack>
    );
  }

  return (
    <Stack className="member-page">
      <div className="member-card">
        <h2 className="member-card__title">{t("title")}</h2>

        {/* Avatar upload */}
        <div className="edit-avatar-row">
          <div className="edit-avatar-img-wrap">
            <img
              src={avatarSrc}
              alt="avatar"
              className="edit-avatar-row__img"
              style={{ cursor: "zoom-in" }}
              onClick={() => setLightboxOpen(true)}
            />
            {form.memberImage && (
              <button
                type="button"
                className="edit-avatar-delete-btn"
                onClick={handleDeleteAvatar}
                title={`Rasmni o'chirish`}
              >
                ✕
              </button>
            )}
          </div>
          <div className="edit-avatar-row__upload">
            <label className="edit-avatar-upload-btn">
              {uploading ? "Yuklanmoqda..." : t("avatarLabel")}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                style={{ display: "none" }}
                onChange={handleAvatarUpload}
                disabled={uploading}
              />
            </label>
            <span className="edit-avatar-hint">
              {ALLOWED_FORMATS} · maks {MAX_FILE_SIZE_MB}MB
            </span>
            {uploadError && <span className="form-error">{uploadError}</span>}
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="memberNick">{t("nickLabel")}</label>
            <input
              id="memberNick"
              name="memberNick"
              type="text"
              className="form-control"
              placeholder={t("nickPlaceholder")}
              value={form.memberNick}
              onChange={handleChange}
              minLength={3}
              maxLength={12}
            />
          </div>

          <div className="form-group">
            <label htmlFor="memberPhone">{t("phoneLabel")}</label>
            <input
              id="memberPhone"
              name="memberPhone"
              type="tel"
              className="form-control"
              placeholder="+998 90 123 45 67"
              value={form.memberPhone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="memberAdress">{t("addressLabel")}</label>
            <input
              id="memberAdress"
              name="memberAdress"
              type="text"
              className="form-control"
              placeholder={t("addressPlaceholder")}
              value={form.memberAdress}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="memberDesc">{t("descLabel")}</label>
            <textarea
              id="memberDesc"
              name="memberDesc"
              className="form-control"
              placeholder={t("descPlaceholder")}
              value={form.memberDesc}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {/* Password change */}
          <div className="form-group">
            <label htmlFor="newPassword">Yangi parol (ixtiyoriy, 5–12 belgi)</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              className="form-control"
              placeholder="Yangi parol"
              value={form.newPassword}
              onChange={handleChange}
              minLength={5}
              maxLength={12}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Parolni tasdiqlash</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={`form-control${pwError ? " error" : ""}`}
              placeholder="Parolni qayta kiriting"
              value={form.confirmPassword}
              onChange={handleChange}
              minLength={5}
              maxLength={12}
              autoComplete="new-password"
            />
            {pwError && <span className="form-error">{pwError}</span>}
          </div>

          <button type="submit" className="save-btn" disabled={saving || uploading}>
            {saveBtnLabel}
          </button>
        </form>
      </div>
      {lightboxOpen && (
        <div className="lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="lightbox__close" onClick={() => setLightboxOpen(false)}>✕</button>
          <img
            className="lightbox__img"
            src={avatarSrc}
            alt="avatar"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </Stack>
  );
};

export default withLayoutBasic(MemberEditPage);
