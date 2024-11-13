import { Autocomplete, Box, Button, Paper, TextField, Typography } from "@mui/material"
import { When } from "../../components/hoc/When"
import LoaderComponent from "../../components/loader/Loader"
import { useEffect, useState } from "react"
import { getAdminProducts, getUsers } from "../../api"
import { IProduct, IUser, Role } from "../../types/interfaces"
import { useAuth } from "../../components/hoc/AuthController"
import toast from "react-hot-toast"
import { url } from "../../axios"

const AssignGift = () => {

  const apiUrl = import.meta.env.VITE_API_URL

  const [loading, setLoading] = useState(false)

  const [users, setUsers] = useState<IUser[]>([])
  const [products, setProducts] = useState<IProduct[]>([])

  const auth = useAuth()

  const [giftPayload, setGiftPayload] = useState<{
    user: IUser | undefined;
    product: IProduct | undefined;
  }>({
    user: undefined,
    product: undefined
  })

  useEffect(() => {
    (
      async () => {
        setLoading(true)
        const users = await getUsers()
        setUsers(users)
        const products = await getAdminProducts()
        setProducts(products)
        setLoading(false)
      }
    )()
  }, [])

  const assignGift = async () => {
    try {
      setLoading(true)
      if (!giftPayload.product && !giftPayload.user) {
        return toast.error("Select all required fields!")
      }
      const { data } = await url.post(`/app-feature/gift`, {
        userId: (giftPayload.user as IUser)._id,
        productId: (giftPayload.product as IProduct)._id
      })

      toast.success(data)
      setLoading(false)
    } catch (e) {
      toast.error("Something went wrong!")
      setLoading(false)
    }
  }

  return (
    <>
      <When condition={loading}>
        <LoaderComponent />
      </When>
      <Typography variant="h3">Assign Gift</Typography>
      <Paper sx={{
        p: "0.5em 1.5em",
        display: "flex",
        flexDirection: "column",
        rowGap: "1.5em",
        m: "1.5em 0em"
      }}>
        <Autocomplete
          options={users as IUser[]}
          getOptionLabel={(option: IUser) => option._id}
          renderInput={(params) => (
            <TextField {...params} label="Select User" variant="outlined"
            />
          )}
          onChange={(_, newValue) => {
            setGiftPayload((prev) => {
              return {
                ...prev,
                user: newValue as IUser
              }
            })
          }}
          value={giftPayload.user}
          freeSolo={false}
        />
        <When condition={!!giftPayload.user && !!auth?.roles.includes(Role.ADMIN)}>
          <Box>
            <Typography variant="h6">User Details</Typography>
            <Typography variant="body2">Full Name: {giftPayload.user?.fullName}</Typography>
            <Typography variant="body2">Phone: {giftPayload.user?.phone}</Typography>
            <Typography variant="body2">Email: {giftPayload.user?.email}</Typography>
            <Typography variant="body2">Address: {giftPayload.user?.address}</Typography>
          </Box>
        </When>
      </Paper>

      <Paper sx={{
        p: "0.5em 1.5em",
        display: "flex",
        flexDirection: "column",
        rowGap: "1.5em",
        m: "1.5em 0em"
      }}>
        <Autocomplete
          options={products}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} label="Select Product" variant="outlined"
            />
          )}
          onChange={(_, newValue) => {
            setGiftPayload((prev) => {
              return {
                ...prev,
                product: newValue as IProduct
              }
            })
          }}
          value={giftPayload.product}
          freeSolo={false}
        />
        <When condition={!!giftPayload.product}>
          <Box>
            <Typography variant="h6">Product Details</Typography>
            <Typography variant="body2">Product Name: {giftPayload.product?.name}</Typography>
            <Typography variant="body2">Product Price: {giftPayload.product?.basePrice}</Typography>
            <img
              src={`${apiUrl}/product/${giftPayload.product?.images[0]}`}
              alt={"Product"}
              style={{ width: '100px' }}
            />
          </Box>
        </When>
      </Paper>
      <Button variant="contained" fullWidth onClick={assignGift}>Gift Now</Button>
    </>
  )
}

export default AssignGift
