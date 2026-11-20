import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useQuery, useMutation, gql } from "@apollo/client";
import withLayoutBasic from "../../../libs/components/layout/LayoutBasic";
import { useAuthContext } from "../../../lib/AuthContext";
import useDeviceDetect from "../../../libs/hooks/useDeviceDetect";

const MY_ORDERS = gql`
  query MyOrders {
    myOrder {
      list {
        _id
        serviceCollection
        serviceDetail
        serviceType
        serviceArea
        phone
        orderStatus
        createdAt
      }
      metaCounter {
        total
      }
    }
  }
`;

const CANCEL_ORDER = gql`
  mutation CancelOrder($input: OrderUpdate!) {
    updateOrder(input: $input) {
      _id
      orderStatus
    }
  }
`;

interface Order {
  _id: string;
  serviceCollection: string;
  serviceDetail: string;
  serviceType: string;
  serviceArea: string;
  phone: string;
  orderStatus: string;
  createdAt: string;
}

const PAGE_SIZE = 5;

const SERVICE_COLLECTION_LABELS: Record<string, string> = {
  HPLINE: "HPLINE",
  ALIF: "ALIF Light",
};

const MemberOrdersPage = () => {
  const device = useDeviceDetect();
  const t = useTranslations("member.orders");
  const router = useRouter();
  const { authMember, authReady } = useAuthContext();
  const [page, setPage] = useState(1);

  const statusLabels: Record<string, string> = {
    PAUSE: t("status.PAUSE"),
    PROCESS: t("status.PROCESS"),
    FINISH: t("status.FINISH"),
    CANCELLED: t("status.CANCELLED"),
  };

  const serviceTypeLabels: Record<string, string> = {
    DELIVERY: t("serviceType.DELIVERY"),
    INSTALLATION: t("serviceType.INSTALLATION"),
    FULL_PROJECT: t("serviceType.FULL_PROJECT"),
  };

  const serviceAreaLabels: Record<string, string> = {
    EXTERIOR: t("serviceArea.EXTERIOR"),
    INTERIOR: t("serviceArea.INTERIOR"),
  };

  const { data, loading, refetch } = useQuery(MY_ORDERS, {
    skip: !authMember,
    fetchPolicy: "cache-and-network",
  });

  const [cancelOrder] = useMutation(CANCEL_ORDER, {
    onCompleted: () => refetch(),
  });

  useEffect(() => {
    if (authReady && !authMember) {
      router.replace("/auth");
    }
  }, [authReady, authMember]);

  const orders: Order[] = data?.myOrder?.list ?? [];
  const total: number = data?.myOrder?.metaCounter?.total ?? orders.length;

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const pageOrders = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(t("confirmCancel"));
    if (!confirmed) return;
    cancelOrder({
      variables: { input: { orderId: id, orderStatus: "CANCELLED" } },
    });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  if (loading && !data) {
    return (
      <Stack className="member-page">
        <div style={{ maxWidth: 820, margin: "0 auto", width: "100%", padding: "32px 0", textAlign: "center" }}>
          Yuklanmoqda...
        </div>
      </Stack>
    );
  }

  return (
    <Stack className="member-page">
      <div style={{ maxWidth: 820, margin: "0 auto", width: "100%" }}>
        <div className="orders-header">
          <h2 className="orders-header__title">{t("title")}</h2>
          <span className="orders-header__count">
            {t("total", { count: total })}
          </span>
        </div>

        {pageOrders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty__icon">📋</div>
            <p className="orders-empty__text">{t("empty")}</p>
          </div>
        ) : (
          <div className="orders-list">
            {pageOrders.map((order) => (
              <div key={order._id} className="order-item">
                <div className="order-item__info">
                  <div className="order-item__top">
                    <span className="order-item__collection">
                      {SERVICE_COLLECTION_LABELS[order.serviceCollection] ??
                        order.serviceCollection}
                    </span>
                    <span className="order-item__detail">
                      {order.serviceDetail}
                    </span>
                    <span
                      className={`order-item__status order-item__status--${order.orderStatus}`}
                    >
                      {statusLabels[order.orderStatus] ?? order.orderStatus}
                    </span>
                  </div>

                  <div className="order-item__meta">
                    <span className="order-item__meta-item">
                      {t("labelService")}:{" "}
                      <span>
                        {serviceTypeLabels[order.serviceType] ?? order.serviceType}
                      </span>
                    </span>
                    <span className="order-item__meta-item">
                      {t("labelArea")}:{" "}
                      <span>
                        {serviceAreaLabels[order.serviceArea] ?? order.serviceArea}
                      </span>
                    </span>
                    <span className="order-item__meta-item">
                      {t("labelPhone")}: <span>{order.phone}</span>
                    </span>
                    <span className="order-item__meta-item">
                      {t("labelDate")}: <span>{formatDate(order.createdAt)}</span>
                    </span>
                  </div>
                </div>

                <div className="order-item__actions">
                  {order.orderStatus !== "CANCELLED" &&
                    order.orderStatus !== "FINISH" && (
                      <button
                        className="order-item__delete-btn"
                        onClick={() => handleDelete(order._id)}
                      >
                        {t("cancelBtn")}
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="member-pagination">
            <button
              className="pagination-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`pagination-btn${page === p ? " active" : ""}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </Stack>
  );
};

export default withLayoutBasic(MemberOrdersPage);
