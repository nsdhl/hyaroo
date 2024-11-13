import { DataGrid } from "@mui/x-data-grid"
import { When } from "../../components/hoc/When"
import { Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { IUser } from "../../types/interfaces"
import { getUsers } from "../../api"
import LoaderComponent from "../../components/loader/Loader"

const MyUsers = () => {

  const [loading, setLoading] = useState(false)

  const [users, setUsers] = useState<IUser[]>([])

  const columns = [
    { field: '_id', headerName: 'User ID', width: 250 },
    { field: 'fullName', headerName: 'Name', width: 220 },
    { field: 'address', headerName: 'Address', width: 220 },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 250,
    },
    {
      field: 'roles',
      headerName: 'Role',
      width: 150,
      valueGetter: (params: any) => params.row.roles[0]
    },
  ];


  useEffect(() => {
    (
      async () => {
        setLoading(true)
        const users = await getUsers()
        setUsers(users)
        setLoading(false)
      }
    )()
  }, [])


  return (
    <>
      <When condition={loading}>
        <LoaderComponent />
      </When>
      <Typography variant="h3">My Users</Typography>
      <DataGrid
        sx={{
          mt: "1.5em"
        }}
        rows={users}
        columns={columns}
        getRowId={(row) => row._id}
        loading={loading}
        disableRowSelectionOnClick
        hideFooterPagination
        hideFooter
      />
    </>
  )
}

export default MyUsers
