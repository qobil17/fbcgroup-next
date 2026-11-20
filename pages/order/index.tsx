import { useState, useEffect } from "react";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useMutation, gql } from "@apollo/client";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import { useAuthContext } from "../../lib/AuthContext";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";

const CREATE_ORDER = gql`
  mutation CreateOrder($input: OrderInput!) {
    createOrder(input: $input) {
      _id
      orderStatus
      serviceCollection
      serviceDetail
    }
  }
`;

const SERVICE_COLLECTIONS = [
  { value: "HPLINE", labelKey: "hpline" },
  { value: "ALIF", labelKey: "alif" },
] as const;

const SERVICE_DETAILS_HPLINE = [
  { value: "HPL", labelKey: "hpl" },
  { value: "ALIKAFON", labelKey: "alikafon" },
  { value: "GRANITE", labelKey: "granite" },
  { value: "SERANIT", labelKey: "seranit" },
] as const;

const SERVICE_DETAILS_ALIF = [
  { value: "LED", labelKey: "led" },
  { value: "DECORATIVE", labelKey: "decorative" },
  { value: "EMERGENCY_LIGHT", labelKey: "emergency" },
] as const;

const SERVICE_TYPES = [
  { value: "DELIVERY", labelKey: "delivery" },
  { value: "INSTALLATION", labelKey: "installation" },
  { value: "FULL_PROJECT", labelKey: "fullProject" },
] as const;

const SERVICE_AREAS = [
  { value: "EXTERIOR", labelKey: "exterior" },
  { value: "INTERIOR", labelKey: "interior" },
] as const;

interface FormState {
  serviceCollection: string;
  serviceDetail: string;
  serviceType: string;
  serviceArea: string;
  phone: string;
  estimatedSquare: string;
  estimatedPoints: string;
}

interface FormErrors {
  serviceCollection?: string;
  serviceDetail?: string;
  serviceType?: string;
  serviceArea?: string;
  phone?: string;
}

const INITIAL_FORM: FormState = {
  serviceCollection: "",
  serviceDetail: "",
  serviceType: "",
  serviceArea: "",
  phone: "",
  estimatedSquare: "",
  estimatedPoints: "",
};

const OrderPage = () => {
  const device = useDeviceDetect();
  const t = useTranslations("order");
  const router = useRouter();
  const { authMember, authReady } = useAuthContext();

  useEffect(() => {
    if (authReady && !authMember) {
      router.replace("/auth");
    }
  }, [authReady, authMember]);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const [createOrder, { loading }] = useMutation(CREATE_ORDER, {
    onCompleted: () => setSubmitted(true),
    onError: (err) => setServerError(err.message),
  });

  const serviceDetailOptions =
    form.serviceCollection === "HPLINE"
      ? SERVICE_DETAILS_HPLINE
      : form.serviceCollection === "ALIF"
        ? SERVICE_DETAILS_ALIF
        : [];

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.serviceCollection) errs.serviceCollection = t("errors.serviceCollection");
    if (!form.serviceDetail) errs.serviceDetail = t("errors.serviceDetail");
    if (!form.serviceType) errs.serviceType = t("errors.serviceType");
    if (!form.serviceArea) errs.serviceArea = t("errors.serviceArea");
    if (!form.phone || form.phone.length < 7 || form.phone.length > 20)
      errs.phone = t("errors.phone");
    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "serviceCollection") {
      setForm((prev) => ({ ...prev, serviceCollection: value, serviceDetail: "" }));
      setErrors((prev) => ({ ...prev, serviceCollection: undefined, serviceDetail: undefined }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authMember) {
      router.push("/auth");
      return;
    }

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setServerError("");
    const input: Record<string, any> = {
      serviceCollection: form.serviceCollection,
      serviceDetail: form.serviceDetail,
      serviceType: form.serviceType,
      serviceArea: form.serviceArea,
      phone: form.phone,
    };
    if (form.estimatedSquare) input.estimatedSquare = Number(form.estimatedSquare);
    if (form.estimatedPoints) input.estimatedPoints = Number(form.estimatedPoints);

    await createOrder({ variables: { input } });
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitted(false);
    setServerError("");
  };

  return (
    <Stack className="order-page">

      <div className="order-form-wrap">
        <div className="order-card">
          {submitted ? (
            <div className="order-success">
              <div className="order-success__icon">{t("success.icon")}</div>
              <h2 className="order-success__title">{t("success.title")}</h2>
              <p className="order-success__text">{t("success.text")}</p>
              <button className="submit-btn" onClick={handleReset}>
                {t("success.newOrder")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <h2 className="order-card__title">{t("formTitle")}</h2>

              {serverError && (
                <div className="form-server-error">{serverError}</div>
              )}

              {/* serviceCollection */}
              <div className="form-group">
                <label htmlFor="serviceCollection">{t("fields.serviceCollection")} *</label>
                <select
                  id="serviceCollection"
                  name="serviceCollection"
                  className={`form-control${errors.serviceCollection ? " error" : ""}`}
                  value={form.serviceCollection}
                  onChange={handleChange}
                >
                  <option value="">{t("options.select")}</option>
                  {SERVICE_COLLECTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {t(`options.${opt.labelKey}`)}
                    </option>
                  ))}
                </select>
                {errors.serviceCollection && (
                  <span className="form-error">{errors.serviceCollection}</span>
                )}
              </div>

              {/* serviceDetail */}
              <div className="form-group">
                <label htmlFor="serviceDetail">{t("fields.serviceDetail")} *</label>
                <select
                  id="serviceDetail"
                  name="serviceDetail"
                  className={`form-control${errors.serviceDetail ? " error" : ""}`}
                  value={form.serviceDetail}
                  onChange={handleChange}
                  disabled={!form.serviceCollection}
                >
                  <option value="">
                    {form.serviceCollection ? t("options.select") : t("options.selectFirst")}
                  </option>
                  {serviceDetailOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {t(`options.${opt.labelKey}`)}
                    </option>
                  ))}
                </select>
                {errors.serviceDetail && (
                  <span className="form-error">{errors.serviceDetail}</span>
                )}
              </div>

              {/* serviceType + serviceArea row */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="serviceType">{t("fields.serviceType")} *</label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    className={`form-control${errors.serviceType ? " error" : ""}`}
                    value={form.serviceType}
                    onChange={handleChange}
                  >
                    <option value="">{t("options.select")}</option>
                    {SERVICE_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(`options.${opt.labelKey}`)}
                      </option>
                    ))}
                  </select>
                  {errors.serviceType && (
                    <span className="form-error">{errors.serviceType}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="serviceArea">{t("fields.serviceArea")} *</label>
                  <select
                    id="serviceArea"
                    name="serviceArea"
                    className={`form-control${errors.serviceArea ? " error" : ""}`}
                    value={form.serviceArea}
                    onChange={handleChange}
                  >
                    <option value="">{t("options.select")}</option>
                    {SERVICE_AREAS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(`options.${opt.labelKey}`)}
                      </option>
                    ))}
                  </select>
                  {errors.serviceArea && (
                    <span className="form-error">{errors.serviceArea}</span>
                  )}
                </div>
              </div>

              {/* phone + estimatedSquare/Points row */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">{t("fields.phone")} *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className={`form-control${errors.phone ? " error" : ""}`}
                    placeholder={t("placeholders.phone")}
                    value={form.phone}
                    onChange={handleChange}
                    minLength={7}
                    maxLength={20}
                  />
                  {errors.phone && (
                    <span className="form-error">{errors.phone}</span>
                  )}
                </div>

                {form.serviceCollection === "ALIF" ? (
                  <div className="form-group">
                    <label htmlFor="estimatedPoints">{t("fields.estimatedPoints")}</label>
                    <input
                      id="estimatedPoints"
                      name="estimatedPoints"
                      type="number"
                      className="form-control"
                      placeholder={t("placeholders.optional")}
                      value={form.estimatedPoints}
                      onChange={handleChange}
                      min={1}
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label htmlFor="estimatedSquare">{t("fields.estimatedSquare")}</label>
                    <input
                      id="estimatedSquare"
                      name="estimatedSquare"
                      type="number"
                      className="form-control"
                      placeholder={t("placeholders.optional")}
                      value={form.estimatedSquare}
                      onChange={handleChange}
                      min={1}
                    />
                  </div>
                )}
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Yuborilmoqda..." : t("submit")}
              </button>
            </form>
          )}
        </div>
      </div>
    </Stack>
  );
};

export default withLayoutBasic(OrderPage, { subtitleKey: "order.bannerSub" });
