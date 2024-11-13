import { useState } from 'react'
import { Stack, Typography, TextField, Button, InputLabel, Select, MenuItem } from '@mui/material'
import LoaderComponent from '../../components/loader/Loader'
import { When } from '../../components/hoc/When'
import { ISignup, IUser, Role } from '../../types/interfaces'
import toast from 'react-hot-toast'
import { url } from '../../axios'
import * as Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../components/hoc/AuthController'

const Signup = () => {
  const navigate = useNavigate()
  const auth = useAuth()

  const [loading, setLoading] = useState(false)

  const [signUpPayload, setSignUpPayload] = useState<ISignup>({
    fullName: "", //equivalent to Shop Name
    password: "",
    address: "",
    email: "",
    phone: "",
    roles: [Role.ADMIN]
  })

  const clearSigninPayload = () => setSignUpPayload({ fullName: "", phone: "", email: "", password: "", address: "", roles: [Role.VENDOR] })

  const handleSignUp = async () => {
    try {
      setLoading(true)
      const { data } = await url.post('/user/register', {
        fullName: signUpPayload.fullName,
        password: signUpPayload.password,
        address: signUpPayload.address,
        email: signUpPayload.email,
        phone: signUpPayload.phone,
        roles: signUpPayload.roles
      })
      if (auth?.loggedIn) {
        toast.success("Account created!")
        setLoading(false)
        return;
      }
      Cookies.default.set("token", JSON.stringify({
        token: data?.token
      }))

      const userInfo: Omit<IUser, '_id'> & { userId: string; } = jwtDecode(data.token)
      auth?.setUser({
        _id: userInfo.userId,
        fullName: userInfo.fullName,
        address: userInfo.address,
        email: userInfo.email,
        phone: userInfo.phone,
        roles: userInfo.roles,
        token: data.token,
        loggedIn: true,
        verified: userInfo.verified
      })
      clearSigninPayload()
      setLoading(false)
      toast.success("You're logged in!")
      navigate("/", { replace: true })

    } catch (e: any) {
      setLoading(false)
      toast.error(e?.response?.data?.message || "Something went wrong!")
    }
  }

  return (
    <>
      <Stack direction="column" alignItems="center" rowGap="1.5em" sx={{
        width: { xs: "90%", sm: "40%" },
        margin: "0 auto",
        pt: "3em"
      }}>
        <When condition={signUpPayload.roles.includes(Role.VENDOR) || signUpPayload.roles.includes(Role.SUPPLIER)}>
          <Typography variant="h2">Become a Seller</Typography>
        </When>

        <When condition={signUpPayload.roles.includes(Role.DELIVERY)}>
          <Typography variant="h4">Create Delivery Person's Account</Typography>
        </When>
        <Stack width="100%">
          <InputLabel id="role-select">Select Your Role</InputLabel>
          <Select
            labelId="role-select-label"
            id="role-select"
            value={signUpPayload.roles[0]}
            label="Stock"
            onChange={(e) => setSignUpPayload(prev => ({ ...prev, roles: [e.target.value] }))}
            variant="filled"
          >
            <MenuItem
              value={Role.ADMIN}
            >Admin</MenuItem>
            <MenuItem
              value={Role.SUPPLIER}
            >Supplier</MenuItem>
            {
              auth?.loggedIn &&
              <MenuItem
                value={Role.DELIVERY}
              >Delivery</MenuItem>
            }
          </Select>
        </Stack>

        <TextField value={signUpPayload.fullName} fullWidth label={signUpPayload.roles.includes(Role.DELIVERY) ? "Full Name" : "Name"} variant="outlined" type="text" onChange={(e) => {
          setSignUpPayload(prev => ({ ...prev, fullName: e.target.value }))
        }} />

        <TextField value={signUpPayload.password} fullWidth label="Password" variant="outlined" type="password" onChange={(e) => {
          setSignUpPayload(prev => ({ ...prev, password: e.target.value }))
        }} />

        <TextField value={signUpPayload.address} fullWidth label="Address" variant="outlined" type="text" onChange={(e) => {
          setSignUpPayload(prev => ({ ...prev, address: e.target.value }))
        }} />

        <TextField value={signUpPayload.email} fullWidth label="Email" variant="outlined" type="text" onChange={(e) => {
          setSignUpPayload(prev => ({ ...prev, email: e.target.value }))
        }} />

        <TextField value={signUpPayload.phone} fullWidth label="Phone" variant="outlined" type="tel" onChange={(e) => {
          setSignUpPayload(prev => ({ ...prev, phone: e.target.value }))
        }} />

        <Stack sx={{
          width: { xs: "100%", sm: "100%" }
        }}>
          <Button variant="contained" fullWidth onClick={handleSignUp}>
            <Typography variant="body1">{auth?.loggedIn ? 'Create' : 'Sign Up'}</Typography>
          </Button>
        </Stack>

      </Stack>
      <When condition={loading}>
        <LoaderComponent />
      </When>
    </>
  )
}

export default Signup
