import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import { useState } from "react"
import toast from "react-hot-toast"
import * as Cookies from "js-cookie"
import { ISignin, IUser } from "../../types/interfaces"
import { When } from "../../components/hoc/When"
import LoaderComponent from "../../components/loader/Loader"
import { url } from "../../axios"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../components/hoc/AuthController"
import { jwtDecode } from "jwt-decode"


const Signin = () => {
  const [signinPayload, setSigninPayload] = useState<ISignin>({
    phone: "",
    email: "",
    password: ""
  })

  const [loading, setLoading] = useState(false)


  const clearSigninPayload = () => setSigninPayload({ phone: "", email: "", password: "" })

  const navigate = useNavigate()
  const auth = useAuth()


  const handleSignin = async () => {
    try {
      setLoading(true)
      const { data } = await url.post('/user/login', {
        phone: signinPayload.phone.includes("@") ? "" : signinPayload.phone,
        email: signinPayload.phone.includes("@") ? signinPayload.phone : "",
        password: signinPayload.password
      })
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
      toast.error(e?.response?.data?.message || "Something went wrong!")
      setLoading(false)
    }
  }



  return (
    <>
      <Stack direction="column" alignItems="center" rowGap="1.5em" sx={{
        width: { xs: "90%", sm: "40%" },
        margin: "0 auto",
        pt: "3em"
      }}>
        <Typography variant="h2">Sign In</Typography>

        <TextField value={signinPayload.phone} fullWidth label="Phone/Email" variant="outlined" type="text" onChange={(e) => {
          setSigninPayload(prev => ({ ...prev, phone: e.target.value }))
        }} />

        <TextField value={signinPayload.password} fullWidth label="Password" variant="outlined" type="password" onChange={(e) => {
          setSigninPayload(prev => ({ ...prev, password: e.target.value }))
        }} />

        <Stack sx={{
          width: { xs: "100%", sm: "100%" }
        }}>
          <Button variant="contained" fullWidth onClick={handleSignin}>
            <Typography variant="body1">Sign In</Typography>
          </Button>
        </Stack>

        <Box>
          <Typography variant="subtitle1" sx={{
            cursor: "pointer"
          }} onClick={() => navigate('/auth/signup')}>Don&apos;t have an account?
            <span style={{
              textDecoration: "underline"
            }} >
              Create One
            </span>

          </Typography>
        </Box>
      </Stack>
      <When condition={loading}>
        <LoaderComponent />
      </When>
    </>
  )
}

export default Signin

