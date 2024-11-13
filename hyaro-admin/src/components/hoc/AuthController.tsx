import { FC, ReactNode, createContext, useContext, useEffect, useState } from "react"
import * as Cookies from "js-cookie"
import { IAuth, IUser } from "../../types/interfaces"
import { jwtDecode } from "jwt-decode"

interface IAuthController {
  children: ReactNode
}

interface IAuthContext extends IAuth {
  setUser: (authInfo: IAuth) => void
  unsetUser: () => void
}

const AuthContext = createContext<IAuthContext | null>(null)

export const AuthController: FC<IAuthController> = ({ children }) => {

  const initialState = {
    _id: "",
    fullName: "",
    address: "",
    phone: "",
    email: "",
    roles: [],
    token: "",
    loggedIn: false,
    verified: undefined
  }

  const [auth, setAuth] = useState<IAuth>(initialState)

  useEffect(() => {
    const _token = Cookies.default.get("token")
    if (_token) {
      const { token } = JSON.parse(_token)
      const userInfo: Omit<IUser, '_id'> & { userId: string; } = jwtDecode(token)

      setAuth({
        _id: userInfo.userId,
        fullName: userInfo.fullName,
        address: userInfo.address,
        email: userInfo.email,
        phone: userInfo.phone,
        roles: userInfo.roles,
        token: token,
        loggedIn: true,
        verified: userInfo.verified
      })
    }
  }, [])

  const setUser = (authInfo: IAuth) => {
    setAuth(authInfo)
  }

  const unsetUser = () => {
    setAuth(initialState)
    Cookies.default.remove('token')
  }

  return <AuthContext.Provider
    value={{
      ...auth,
      setUser,
      unsetUser
    }}
  >
    {children}
  </AuthContext.Provider>
}

export const useAuth = () => {
  const auth = useContext(AuthContext)
  return auth
}
