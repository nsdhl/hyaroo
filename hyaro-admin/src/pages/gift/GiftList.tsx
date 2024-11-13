import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAssignedGifts } from "../../api"
import { IGift } from "../../types/interfaces"
import { When } from "../../components/hoc/When"
import LoaderComponent from "../../components/loader/Loader"
import { Button, IconButton, Stack, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { Delete } from "@mui/icons-material"
import toast from "react-hot-toast"
import { url } from "../../axios"

const GiftList = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [gifts, setGifts] = useState<IGift[]>([])

  const [selectedGiftIds, setSelectedGiftIds] = useState<string[]>([])

  const columns = [
    { field: '_id', headerName: 'Gift ID', width: 220 },
    { field: 'product', headerName: 'Product ID', width: 250, valueGetter: (params: any) => params.row?.productId._id },
    { field: 'name', headerName: 'Product Name', width: 150, valueGetter: (params: any) => params.row?.productId.name },
    { field: 'fullName', headerName: 'Name', width: 200, valueGetter: (params: any) => params.row?.userId.fullName },
    { field: 'phone', headerName: 'Phone', width: 150, valueGetter: (params: any) => params.row?.userId.phone },
    { field: 'email', headerName: 'Email', width: 200, valueGetter: (params: any) => params.row?.userId.email },
  ];

  useEffect(() => {
    (
      async () => {
        setLoading(true)
        const gifts = await getAssignedGifts()
        setGifts(gifts)
        setLoading(false)
      }
    )()
  }, [])

  const handleDelete = async () => {
    try {
      setLoading(true)
      const { data } = await url.delete('/app-feature/gift', {
        data: {
          giftId: selectedGiftIds
        }
      })
      const gifts = await getAssignedGifts()
      setGifts(gifts)
      toast.success(data)
      setLoading(false)
    } catch (e) {
      toast.error("Something went wrong!")
    }
  }

  return (
    <>
      <When condition={loading}>
        <LoaderComponent />
      </When>
      <Typography variant="h3">Assigned Gifts</Typography>
      <Stack direction="row" columnGap="1.5em" justifyContent="right" m="0.5em 0em">
        <Button variant="contained" onClick={() => navigate('assign')}>Assign</Button>
        <IconButton onClick={handleDelete}><Delete /></IconButton>
      </Stack>
      <DataGrid
        rows={gifts}
        columns={columns}
        checkboxSelection
        getRowId={(row) => row._id}
        loading={loading}
        disableRowSelectionOnClick
        hideFooterPagination
        hideFooter
        onRowSelectionModelChange={(giftId) => {
          setSelectedGiftIds(giftId as string[])
        }}
      />
    </>
  )
}

export default GiftList
