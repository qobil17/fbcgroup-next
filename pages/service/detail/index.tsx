import { Alert, Box, Button, CircularProgress, Stack, TextField } from "@mui/material";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import moment from "moment";
import withLayoutBasic from "../../../libs/components/layout/LayoutBasic";
import { CREATE_ORDER, GET_SERVICE, MY_ORDERS } from "../../../libs/apollo/queries";
import { errorMessage } from "../../../libs/apollo/client";
import { userVar } from "../../../libs/auth";
import { imageUrl } from "../../../libs/config";
import { Service, label } from "../../../libs/types";

const ServiceDetail = () => {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const user = useReactiveVar(userVar);

  const { data, loading, error } = useQuery(GET_SERVICE, {
    variables: { serviceId: id },
    skip: !id,
    ssr: false,
  });
  const service: Service | undefined = data?.getService;

  const [activeImg, setActiveImg] = useState(0);
  const [phone, setPhone] = useState("");
  const [square, setSquare] = useState("");
  const [formError, setFormError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (user?.memberPhone && !phone) setPhone(String(user.memberPhone));
  }, [user]);

  const [createOrder, { loading: ordering }] = useMutation(CREATE_ORDER, {
    refetchQueries: [{ query: MY_ORDERS }],
  });

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;
    setFormError("");
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(router.asPath)}`);
      return;
    }
    const cleanPhone = phone.trim();
    if (cleanPhone.length < 7 || cleanPhone.length > 20) {
      setFormError("Telefon raqamini to'g'ri kiriting");
      return;
    }
    try {
      await createOrder({
        variables: {
          input: {
            serviceCollection: service.serviceCollection,
            serviceDetail: service.serviceDetail ?? (service.serviceCollection === "ALIF" ? "LED" : "HPL"),
            serviceType: service.serviceType,
            serviceArea: service.serviceArea,
            phone: cleanPhone,
            ...(Number(square) >= 1 ? { estimatedSquare: Math.round(Number(square)) } : {}),
          },
        },
      });
      setDone(true);
    } catch (err) {
      setFormError(errorMessage(err));
    }
  };

  if (!id || loading) {
    return (
      <Stack className="detail-page">
        <Stack className="container detail-center">
          <CircularProgress />
        </Stack>
      </Stack>
    );
  }

  if (error || !service) {
    return (
      <Stack className="detail-page">
        <Stack className="container detail-center">
          <p>Xizmat topilmadi.</p>
          <Link href="/service">← Xizmatlarga qaytish</Link>
        </Stack>
      </Stack>
    );
  }

  const images = service.serviceImages?.length ? service.serviceImages : [""];

  return (
    <Stack className="detail-page">
      <Stack className="container">
        <div className="detail-grid">
          <Box className="detail-gallery">
            <img className="main-img" src={imageUrl(images[activeImg])} alt={service.serviceTitle} />
            {images.length > 1 && (
              <div className="thumbs">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={imageUrl(img)}
                    alt=""
                    className={i === activeImg ? "active" : ""}
                    onClick={() => setActiveImg(i)}
                  />
                ))}
              </div>
            )}
          </Box>

          <Box className="detail-info">
            <span className="tag">{label(service.serviceCollection)}</span>
            <h1>{service.serviceTitle}</h1>
            <div className="meta">
              <div>
                <span>Turi</span>
                <b>{label(service.serviceType)}</b>
              </div>
              <div>
                <span>Material</span>
                <b>{label(service.serviceDetail) || "—"}</b>
              </div>
              <div>
                <span>Hudud</span>
                <b>{label(service.serviceArea)}</b>
              </div>
              <div>
                <span>Narx</span>
                <b>{service.servicePrice ? `${service.servicePrice.toLocaleString("uz-UZ")} so'm` : "Kelishilgan"}</b>
              </div>
              <div>
                <span>Ko'rishlar</span>
                <b>{service.serviceViews}</b>
              </div>
              <div>
                <span>Qo'shilgan</span>
                <b>{moment(service.createdAt).format("DD.MM.YYYY")}</b>
              </div>
            </div>
            {service.serviceDesc && <p className="desc">{service.serviceDesc}</p>}

            <Box component="form" className="order-box" onSubmit={submitOrder}>
              <h3>Buyurtma berish</h3>
              {done ? (
                <Alert severity="success">
                  Buyurtmangiz qabul qilindi! Mutaxassisimiz tez orada siz bilan bog'lanadi.{" "}
                  <Link href="/myOrder">Buyurtmalarim</Link>
                </Alert>
              ) : (
                <>
                  <TextField
                    label="Telefon raqam"
                    placeholder="+998 90 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    fullWidth
                    size="small"
                    required
                  />
                  <TextField
                    label="Taxminiy maydon (m²)"
                    type="number"
                    value={square}
                    onChange={(e) => setSquare(e.target.value)}
                    fullWidth
                    size="small"
                    inputProps={{ min: 1 }}
                  />
                  {formError && <Alert severity="error">{formError}</Alert>}
                  <Button type="submit" variant="contained" size="large" disabled={ordering} fullWidth>
                    {ordering ? "Yuborilmoqda..." : user ? "Buyurtma berish" : "Buyurtma uchun tizimga kiring"}
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </div>
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(ServiceDetail);
