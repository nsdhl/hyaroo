import { Button, IconButton, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { getAdminProducts } from "../../api"
import { IProduct } from "../../types/interfaces"
import { DataGrid } from "@mui/x-data-grid"
import { Delete } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { When } from "../../components/hoc/When"
import LoaderComponent from "../../components/loader/Loader"
import { url } from "../../axios"
import toast from "react-hot-toast"
import { useAuth } from "../../components/hoc/AuthController"


const ProductList = () => {

  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(false)

  const [productId, setProductId] = useState<string[]>([])

  const navigate = useNavigate()
  const auth = useAuth()


  const columns = [
    { field: '_id', headerName: 'Product ID', width: 250 },
    { field: 'name', headerName: 'Name', width: 300 },
    { field: 'basePrice', headerName: 'Base Price', width: 200 },
    {
      field: 'stock',
      headerName: 'Stock',
      width: 200,
    },
  ];

  useEffect(() => {
    (
      async () => {
        setLoading(true)
        if (!auth?._id) return
        const products = await getAdminProducts()
        setProducts(products)
        setLoading(false)
      }
    )()
  }, [auth?._id])

  const handleDelete = async () => {
    if (productId.length === 0) return;
    setLoading(true)
    await url.patch('/product', {
      productId: productId
    })
    const products = await getAdminProducts()
    setProducts(products)
    setLoading(false)
    toast.success("Products has been deleted!")
  }

  return (
    <>
      <When condition={loading}>
        <LoaderComponent />
      </When>
      <Typography variant="h3">Products</Typography>
      <Stack direction="row" columnGap="1.5em" justifyContent="right" m="0.5em 0em">
        <Button variant="contained" onClick={() => navigate('/add')}>Add</Button>
        <IconButton onClick={handleDelete}><Delete /></IconButton>
      </Stack>
      <DataGrid
        rows={products}
        columns={columns}
        checkboxSelection
        getRowId={(row) => row._id}
        loading={loading}
        disableRowSelectionOnClick
        hideFooterPagination
        hideFooter
        onCellDoubleClick={(params) => {
          navigate(`/view/${params.id}`)
        }}
        onRowSelectionModelChange={(productId) => {
          setProductId(productId as string[])
        }}
      />
    </>
  )
}

export default ProductList
