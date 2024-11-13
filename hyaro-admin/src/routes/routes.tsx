import { Route, Routes, useRoutes } from "react-router-dom";
import ProductList from "../pages/product/ProductList";
import AddProduct from "../pages/product/AddProduct";
import { Mode } from "../types/interfaces";
import Signin from "../pages/auth/Signin";
import { ProtectedRoute } from "../components/hoc/ProtectedRoute";
import OrderList from "../pages/order/OrderList";
import OrderDetail from "../pages/order/OrderDetail";
import Customize from "../pages/customize/Customize";
import MyUsers from "../pages/myUsers/MyUsers";
import Signup from "../pages/auth/Signup";
import GiftList from "../pages/gift/GiftList";
import AssignGift from "../pages/gift/AssignGift";
import VerifyUserPage from "../pages/verify/Page";
import UnverifiedUserPage from "../pages/auth/Unverified";
import { useAuth } from "../components/hoc/AuthController";
import Announcement from "../pages/announcement/Announcement";

const ProductPageRoutes = () => {
  return (
    <ProtectedRoute>
      <Routes>
        <Route index element={<ProductList />} />
        <Route path="add" element={<AddProduct mode={Mode.POST} />} />
        <Route path="view/:productId" element={<AddProduct mode={Mode.VIEW} />} />
        <Route path="edit/:productId" element={<AddProduct mode={Mode.EDIT} />} />
      </Routes>
    </ProtectedRoute>
  )
}

const OrderPageRoutes = () => {
  return (
    <ProtectedRoute>
      <Routes>
        <Route index element={<OrderList />} />
        <Route path=":orderId" element={<OrderDetail />} />
      </Routes>
    </ProtectedRoute >
  )
}

const GiftPageRoutes = () => {
  return (
    <ProtectedRoute>
      <Routes>
        <Route index element={< GiftList />} />
        <Route path="assign" element={<AssignGift />} />
      </Routes>
    </ProtectedRoute>
  )
}


const RouterCollection = () => {

  const auth = useAuth()

  return useRoutes([
    {
      path: "*",
      element: auth?.roles.includes('delivery') ? <OrderPageRoutes /> : <ProductPageRoutes />
    },
    {
      path: "/order/*",
      element: <OrderPageRoutes />
    },
    {
      path: "/customize",
      element: <ProtectedRoute><Customize /></ProtectedRoute>
    },
    {
      path: "/my-users",
      element: <ProtectedRoute><MyUsers /></ProtectedRoute>
    },
    {
      path: '/add-users',
      element: <ProtectedRoute><Signup /></ProtectedRoute>
    },
    {
      path: "/gifts/*",
      element: <GiftPageRoutes />
    },
    {
      path: "/verify",
      element: <ProtectedRoute><VerifyUserPage /></ProtectedRoute>
    },
    {
      path: "/announcement",
      element: <ProtectedRoute><Announcement /></ProtectedRoute>
    },
    {
      path: "/auth",
      children: [
        {
          path: "signin",
          element: <Signin />
        },
        {
          path: "signup",
          element: <Signup />
        }
      ]
    },
    {
      path: "/unverified",
      element: <ProtectedRoute><UnverifiedUserPage /></ProtectedRoute>
    }
  ])
}

export { RouterCollection }
