import { InputLabel, MenuItem, Paper, Select, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { IAdminProductOrder, OrderStatus } from "../../types/interfaces"
import { getOrderByOrderId, updateOrderStatus } from "../../api"
import { When } from "../../components/hoc/When"
import LoaderComponent from "../../components/loader/Loader"

const OrderDetail = () => {
  const params = useParams()
  const navigate = useNavigate()

  const { orderId } = params

  const [order, setOrder] = useState<IAdminProductOrder | undefined>()

  const [loading, setLoading] = useState(false)

  const orderStatusArray = [OrderStatus.ORDER_PLACED, OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED]

  const [selectedOrderStatus, setSelectedOrderStatus] = useState("")

  useEffect(() => {
    (
      async () => {
        setLoading(true)
        if (!orderId) return;
        const order = await getOrderByOrderId(orderId)
        setOrder(order)
        setLoading(false)
      }
    )()

  }, [orderId])

  return (
    <>
      <Typography variant="h3">Order Details</Typography>

      <When condition={!order || loading}>
        <LoaderComponent />
      </When>

      <When condition={!!order || !loading}>
        <Stack direction="column" mt="1.5em" rowGap="1.5em">
          <Stack direction="column">
            <InputLabel id="update-status">Update Status</InputLabel>
            <Select
              labelId="stock-select-label"
              id="stock-select"
              value={selectedOrderStatus}
              label="Stock"
              onChange={async (e) => {
                setLoading(true)
                await updateOrderStatus(orderId as string, e.target.value as OrderStatus)
                setSelectedOrderStatus(e.target.value as OrderStatus)
                setLoading(false)
              }}
              variant="filled"
            >
              {
                orderStatusArray.map((status, key) => {
                  return (
                    <MenuItem
                      value={status}
                      key={key}
                    >{status}
                    </MenuItem>
                  )
                })
              }
            </Select>
          </Stack>

          <Paper sx={{
            padding: "0.5em 1em"
          }}>
            <Typography variant="h5">Ordered By</Typography>
            <Typography variant="h6">User ID</Typography>
            <Typography variant="body1">{order?.user._id}</Typography>
            <Typography variant="h6">Name</Typography>
            <Typography variant="body1">{order?.user.fullName}</Typography>
            <Typography variant="h6">Phone</Typography>
            <Typography variant="body1">{order?.user.phone}</Typography>
            <Typography variant="h6">Email</Typography>
            <Typography variant="body1">{order?.user.email}</Typography>
          </Paper>

          <Paper sx={{
            padding: "0.5em 1em"
          }}>
            <Typography variant="h5">Product</Typography>
            <Typography variant="body1" sx={{
              cursor: "pointer",
              textDecoration: "underline"
            }} onClick={() => navigate(`/view/${order?.product._id}`)}>{order?.product._id}</Typography>
            <Typography variant="body1">{order?.product.name}</Typography>
          </Paper>

          <Paper sx={{
            padding: "0.5em 1em"
          }}>
            <Typography variant="h5">Order Details</Typography>
            <Typography variant="h6">Product Count</Typography>
            <Typography variant="body1">{order?.productCount}</Typography>
            <Typography variant="h6">Variants</Typography>
            {
              order?.variant.map((el, key) => {
                return (
                  <Stack key={key} direction="row" columnGap="1.5em">
                    <Typography variant="body1" fontWeight={500}>{el.variantType}:</Typography>
                    <Typography variant="body1">{el.variantName}</Typography>
                  </Stack>
                )
              })
            }
            <Typography variant="h6">Total Cost</Typography>
            <Typography variant="body1">Rs. {order?.totalCost}</Typography>
          </Paper>

          <Paper sx={{
            padding: "0.5em 1em"
          }}>
            <Typography variant="h5">Delivery Details</Typography>
            {
              order?.city &&
              <>
                <Typography variant="h6">City</Typography>
                <Typography variant="body1">{order?.city}</Typography>
              </>
            }
            <Typography variant="h6">Address</Typography>
            <Typography variant="body1">{order?.detailAddress}</Typography>
            <Typography variant="h6">Receiver's Phone</Typography>
            <Typography variant="body1">{order?.receiverPhone}</Typography>
            <Typography variant="h6">Receiver's Name</Typography>
            <Typography variant="body1">{order?.receiverName}</Typography>
          </Paper>
        </Stack>
      </When>

    </>
  )
}

export default OrderDetail
