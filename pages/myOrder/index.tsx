import { Alert, Box, Button, Chip, CircularProgress, Stack } from "@mui/material";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import moment from "moment";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import { CANCEL_ORDER, MY_ORDERS } from "../../libs/apollo/queries";
import { errorMessage } from "../../libs/apollo/client";
import { getToken, userVar } from "../../libs/auth";
import { Order, label } from "../../libs/types";

const STATUS_COLOR: Record<string, "default" | "warning" | "info" | "success" | "error"> = {
  PAUSE: "warning",
  PROCESS: "info",
  FINISH: "success",
  CANCELLED: "error",
};

const MyOrder = () => {
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const [ready, setReady] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    setReady(true);
    if (!getToken()) router.replace(`/login?next=${encodeURIComponent("/myOrder")}`);
  }, []);

  const { data, loading, error } = useQuery(MY_ORDERS, { skip: !user, ssr: false, fetchPolicy: "network-only" });
  const [cancelOrder, { loading: cancelling }] = useMutation(CANCEL_ORDER, {
    refetchQueries: [{ query: MY_ORDERS }],
  });
  const orders: Order[] = data?.myOrder?.list ?? [];

  const cancel = async (orderId: string) => {
    if (!window.confirm("Buyurtmani bekor qilmoqchimisiz?")) return;
    setActionError("");
    try {
      await cancelOrder({ variables: { input: { orderId, orderStatus: "CANCELLED" } } });
    } catch (err) {
      setActionError(errorMessage(err));
    }
  };

  return (
    <Stack className="orders-page">
      <Stack className="container">
        <h1>Buyurtmalarim</h1>
        {!ready || !user || (loading && !data) ? (
          <Box className="collection-empty">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{errorMessage(error)}</Alert>
        ) : orders.length === 0 ? (
          <Box className="collection-empty">
            <p>Sizda hali buyurtmalar yo'q.</p>
            <Button variant="contained" onClick={() => router.push("/service")}>
              Xizmatlarni ko'rish
            </Button>
          </Box>
        ) : (
          <div className="orders-list">
            {actionError && <Alert severity="error">{actionError}</Alert>}
            {orders.map((o) => (
              <div className="order-row" key={o._id}>
                <div className="order-main">
                  <b>
                    {label(o.serviceCollection)} · {label(o.serviceDetail)}
                  </b>
                  <span>
                    {label(o.serviceType)} · {label(o.serviceArea)} · {o.phone}
                  </span>
                </div>
                <div className="order-side">
                  <span className="date">{moment(o.createdAt).format("DD.MM.YYYY HH:mm")}</span>
                  <Chip size="small" color={STATUS_COLOR[o.orderStatus]} label={label(o.orderStatus)} />
                  {o.orderStatus === "PAUSE" && (
                    <Button size="small" color="error" disabled={cancelling} onClick={() => cancel(o._id)}>
                      Bekor qilish
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(MyOrder);
