import { useLocation, useNavigate } from "react-router-dom"
import { ReactNode, useEffect } from "react"
import * as Cookies from "js-cookie"
import { IUser } from "../../types/interfaces"
import { jwtDecode } from "jwt-decode"

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()
  const location = useLocation()


  useEffect(() => {
    const _token = Cookies.default.get("token")
    if (!_token) {
      navigate('/auth/signin')
      return
    }
    const { token } = JSON.parse(_token)
    const userInfo: Omit<IUser, '_id'> & { userId: string; } = jwtDecode(token)
    if (!userInfo.verified) {
      navigate('/unverified')
    }
  }, [location.pathname])

  return children
}
