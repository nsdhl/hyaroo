import { useEffect, useState } from "react";
import { When } from "../../components/hoc/When";
import LoaderComponent from "../../components/loader/Loader";
import { Typography } from "@mui/material";
import { IUser } from "../../types/interfaces";
import { getUnverifiedUsers } from "../../api";
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import { url } from "../../axios";


const VerifyUserPage = () => {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    (
      async () => {
        setLoading(true)
        const unverifiedUsers = await getUnverifiedUsers()
        setUsers(unverifiedUsers)
        setLoading(false)
      }
    )()
  }, [])


  const columns = [
    { field: '_id', headerName: 'User ID', width: 250 },
    { field: 'verified', headerName: 'Verified', width: 120, editable: true },
    { field: 'fullName', headerName: 'Name', width: 150 },
    { field: 'address', headerName: 'Address', width: 150 },
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

  return (
    <>
      <When condition={loading}>
        <LoaderComponent />
      </When>
      <Typography variant="h3">Verify Users</Typography>
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
        editMode="cell"
        processRowUpdate={async (newValue, oldValue) => {
          //@ts-ignore
          if (newValue.verified === "true" || newValue.verified === "false") {
            setLoading(true)
            const { data } = await url.patch(`/user/verify/${newValue._id}`)
            toast.success(data)
            setLoading(false)
            return newValue
          }
          toast.error("Value must be true or false!")
          return oldValue
        }}
      />
    </>
  )
}

export default VerifyUserPage;
