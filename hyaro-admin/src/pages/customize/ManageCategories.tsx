import { Autocomplete, Button, Paper, TextField, Typography } from "@mui/material"
import { ICategory } from "../../types/interfaces"
import { FC, useState } from "react"
import toast from "react-hot-toast"
import { url } from "../../axios"
import { When } from "../../components/hoc/When"
import LoaderComponent from "../../components/loader/Loader"

interface IManageCategories {
  categories: ICategory[]
  fetchCategories: () => void
}

const ManageCategories: FC<IManageCategories> = ({ categories, fetchCategories }) => {

  const [loading, setLoading] = useState(false)

  const [addedCategory, setAddedCategory] = useState('')

  const [selectedCategory, setSelectedCategory] = useState<ICategory | undefined>()

  const addCategory = async () => {
    try {
      await url.post('/app-feature/category', {
        categoryName: addedCategory
      })
      setAddedCategory('')
      fetchCategories()
      toast.success("Category succesfully added!")
    } catch (e) {
      toast.error("Something went wrong! Try again later!")
      setLoading(false)
    }
  }

  const deleteCategory = async () => {
    try {
      await url.delete(`/app-feature/category/${selectedCategory?._id}`)
      fetchCategories()
      toast.success("Category succesfully deleted!")
    } catch (e) {
      toast.error("Something went wrong! Try again later!")
      setLoading(false)
    }
  }

  return (
    <>
      <When condition={loading}>
        <LoaderComponent />
      </When>
      <Paper sx={{
        p: "0.5em 1.5em",
        display: "flex",
        flexDirection: "column",
        rowGap: "1.5em"
      }}>
        <Typography variant="h5">Add New Category</Typography>

        <TextField type="text" value={addedCategory}
          onChange={(e) => setAddedCategory(e.target.value)}
          label="Category Name"
        />

        <Button variant="contained" onClick={addCategory}>Add</Button>
      </Paper>

      <Paper sx={{
        p: "0.5em 1.5em",
        display: "flex",
        flexDirection: "column",
        rowGap: "1.5em",
        mt: "1.5em"
      }}>
        <Typography variant="h5">Delete Category</Typography>

        <Autocomplete
          options={categories}
          getOptionLabel={(option) => option.category}
          renderInput={(params) => (
            <TextField {...params} label="Choose Category" variant="outlined"
            />
          )}
          onChange={(_, newValue) => setSelectedCategory(newValue as ICategory)}
          value={selectedCategory}
          freeSolo={false}
        />

        <Button variant="contained" onClick={deleteCategory}>Delete</Button>
      </Paper>
    </>
  )
}

export default ManageCategories
