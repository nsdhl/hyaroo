import { Paper, Typography, Stack, InputLabel, TextField, Button, Autocomplete } from "@mui/material";
import { When } from "../../components/hoc/When";
import { FC, useState } from "react";
import { url } from "../../axios";
import toast from "react-hot-toast";
import LoaderComponent from "../../components/loader/Loader";

interface ICarouselImage {
  carouselImages: {
    _id: string;
    image: string;
  }[]
  fetchCarouselImage: () => void;
}

const RemoveCarouselImage: FC<ICarouselImage> = ({ carouselImages, fetchCarouselImage }) => {

  const apiUrl = import.meta.env.VITE_API_URL

  const [loading, setLoading] = useState(false)

  //selected carousel image to delete
  const [selectedCarouselImage, setSelectedCarouselImage] = useState<{ _id: string; image: string; } | undefined>()


  const handleCarouselImageDelete = async () => {
    try {
      if (!selectedCarouselImage) return;
      setLoading(true)
      await url.delete(`/app-feature/img/${selectedCarouselImage?._id}`)
      toast.success("Deleted Successfully!")
      fetchCarouselImage()
      setSelectedCarouselImage(undefined)
      setLoading(false)
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
        rowGap: "1.5em",
        mt: "1.5em"
      }}>
        <Typography variant="h5">Remove Carousel Image</Typography>
        <InputLabel id="carousel-image">Select Carousel Image</InputLabel>
        <Autocomplete
          options={carouselImages}
          getOptionLabel={(option) => option._id}
          renderInput={(params) => (
            <TextField {...params} label="Choose ID" variant="outlined"
            />
          )}
          onChange={(_, newValue) => setSelectedCarouselImage(newValue as { _id: string; image: string; })}
          value={selectedCarouselImage}
          freeSolo={false}
        />
        <When condition={!!selectedCarouselImage}>
          <Stack direction="row" columnGap="0.5em">
            <img
              src={`${apiUrl}/carousel/${selectedCarouselImage?.image}`}
              alt={"Carousel Image Preview"}
              style={{ width: '100px' }}
            />
          </Stack>
        </When>

        <Button variant="contained" onClick={handleCarouselImageDelete}>Delete</Button>
      </Paper>
    </>
  )
}

export default RemoveCarouselImage
