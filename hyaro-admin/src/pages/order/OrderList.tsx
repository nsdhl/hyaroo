import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { When } from "../../components/hoc/When";
import { Button, Container, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { IAdminProductOrder } from "../../types/interfaces";
import LoaderComponent from "../../components/loader/Loader";
import { useAuth } from "../../components/hoc/AuthController";
import OrderFilter from "./OrderFilter";
import {
  getAdminProductOrders,
  getAdminProductOrdersForDelivery,
} from "../../api";
import { CONSTS } from "../../lib/constants";

const OrderList = () => {
  const [orders, setOrders] = useState<IAdminProductOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const auth = useAuth();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const columns = [
    { field: "_id", headerName: "Order ID", width: 220 },
    { field: "productCount", headerName: "Count", width: 80 },
    { field: "totalCost", headerName: "Total Cost", width: 120 },
    {
      field: "fullName",
      headerName: "Ordered Name",
      width: 150,
      valueGetter: (params: any) => params.row?.user.fullName,
    },
    {
      field: "email",
      headerName: "Orderer Email",
      width: 200,
      valueGetter: (params: any) => params.row?.user.email,
    },
    {
      field: "phone",
      headerName: "Orderer Phone",
      width: 150,
      valueGetter: (params: any) => params.row?.user.phone,
    },
    {
      field: "city",
      headerName: "Delivery City",
      width: 150,
    },
    {
      field: "detailAddress",
      headerName: "Delivery Address",
      width: 150,
    },
    {
      field: "orderStatus",
      headerName: "Order Status",
      width: 100,
    },
  ];

  const handlePreviousPage = () => setPage((prev) => prev - 1);
  const handleNextPage = () => setPage((prev) => prev + 1);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (auth?.roles && auth?.roles.length > 0) {
        if (auth?.roles.includes("delivery")) {
          const orders = await getAdminProductOrdersForDelivery();
          setOrders(orders);
        } else {
          const params = new URLSearchParams();
          const fromDate = searchParams.get("fromDate");
          const toDate = searchParams.get("toDate");
          const status = searchParams.get("status");
          const priceSort = searchParams.get("priceSort");
          const page = searchParams.get("page");
          const limit = searchParams.get("limit");

          fromDate ? params.append("fromDate", fromDate) : {};
          toDate ? params.append("toDate", toDate) : {};
          status ? params.append("status", status) : {};
          priceSort ? params.append("priceSort", priceSort) : {};
          params.append("page", page || "1");
          params.append("limit", limit || CONSTS.limit.toString());

          const res = await getAdminProductOrders(params);
          setOrders(res.orders);
          setHasNextPage(res.hasNextPage);
        }
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.roles, searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    if (!page || !limit) {
      if (!page) {
        params.append("page", "1");
      }

      if (!limit) {
        params.append("limit", CONSTS.limit.toString());
      }

      navigate({ search: params.toString() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    navigate({ search: params.toString() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <>
      <When condition={loading}>
        <LoaderComponent />
      </When>
      <Typography variant="h3" mb="0.5em">
        Orders
      </Typography>
      <OrderFilter />
      <DataGrid
        rows={orders}
        columns={columns}
        getRowId={(row) => row._id}
        loading={loading}
        disableRowSelectionOnClick
        hideFooterPagination
        hideFooter
        onCellDoubleClick={(params) => {
          navigate(`${params.id}`);
        }}
      />
      <Container
        disableGutters
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button
          size="large"
          disabled={page <= 1}
          variant="outlined"
          onClick={handlePreviousPage}
        >
          Previous Page
        </Button>
        <Button
          disabled={!hasNextPage}
          size="large"
          variant="outlined"
          onClick={handleNextPage}
        >
          Next Page
        </Button>
      </Container>
    </>
  );
};

export default OrderList;
