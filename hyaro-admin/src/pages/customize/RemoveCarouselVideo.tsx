import { Paper, Typography, Stack, InputLabel, TextField, Button, Autocomplete } from "@mui/material";
import { When } from "../../components/hoc/When";
import { FC, useState } from "react";
import { url } from "../../axios";
import toast from "react-hot-toast";
import LoaderComponent from "../../components/loader/Loader";
import { IVideo } from "../../types/interfaces";

interface ICarouselVideo {
  carouselVideos: IVideo[]
  fetchCarouselVideo: () => void;
}

const RemoveCarouselVideo: FC<ICarouselVideo> = ({ carouselVideos, fetchCarouselVideo }) => {

  const apiUrl = import.meta.env.VITE_API_URL

  const [loading, setLoading] = useState(false)

  //selected carousel image to delete
  const [selectedCarouselVideo, setSelectedCarouselVideo] = useState<IVideo | undefined>()


  const handleCarouselVideoDelete = async () => {
    try {
      if (!selectedCarouselVideo) return;
      setLoading(true)
      await url.delete(`/app-feature/vid/${selectedCarouselVideo?._id}`)
      toast.success("Deleted Successfully!")
      fetchCarouselVideo()
      setSelectedCarouselVideo(undefined)
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
        <Typography variant="h5">Remove Carousel Video</Typography>
        <InputLabel id="carousel-video">Select Carousel Video</InputLabel>
        <Autocomplete
          options={carouselVideos}
          getOptionLabel={(option) => option._id}
          renderInput={(params) => (
            <TextField {...params} label="Choose ID" variant="outlined"
            />
          )}
          onChange={(_, newValue) => setSelectedCarouselVideo(newValue as IVideo)}
          value={selectedCarouselVideo}
          freeSolo={false}
        />
        <When condition={!!selectedCarouselVideo}>
          <Stack direction="row" columnGap="0.5em">
            <video width="200" controls key={selectedCarouselVideo?._id}>
              <source
                src={`${apiUrl}/carousel/${selectedCarouselVideo?.video}`}
              />
            </video>
          </Stack>
        </When>

        <Button variant="contained" onClick={handleCarouselVideoDelete}>Delete</Button>
      </Paper>
    </>
  )
}

export default RemoveCarouselVideo 
