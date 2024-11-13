import { ChangeEvent, FC, useState } from "react";
import { Paper, Typography, Stack, Button, Autocomplete, TextField } from "@mui/material";
import { When } from "../../components/hoc/When";
import LoaderComponent from "../../components/loader/Loader";
import { url } from "../../axios";
import toast from "react-hot-toast";
import { IProduct } from "../../types/interfaces";

interface IAddCarouselVideo {
  fetchCarouselVideo: () => void;
  products: IProduct[]
}

const AddCarouselVideo: FC<IAddCarouselVideo> = ({ fetchCarouselVideo, products }) => {
  const [loading, setLoading] = useState(false)

  //carousel image to upload
  const [uploadedCarouselVideo, setUploadedCarouselVideo] = useState<File | undefined>(undefined)

  const [linkedProduct, setLinkedProduct] = useState<IProduct | undefined>()

  const handleCarouselVideoUpload = async () => {
    const formData = new FormData()
    if (uploadedCarouselVideo) {
      formData.append("video", uploadedCarouselVideo, uploadedCarouselVideo.name)
    }
    formData.append("productId", linkedProduct?._id as string)
    try {
      if (!uploadedCarouselVideo || !linkedProduct) return
      setLoading(true)
      await url.post('/app-feature/vid', formData)
      toast.success("Uploaded Succesfully!")
      setUploadedCarouselVideo(undefined)
      fetchCarouselVideo()
      setLoading(false)
    } catch (e) {
      toast.error("Something went wrong! Try again later!")
      setUploadedCarouselVideo(undefined)
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
        <Typography variant="h5">Add Carousel Video</Typography>
        <When condition={!!uploadedCarouselVideo}>
          <Stack direction="row" columnGap="0.5em">
            <video width="200" controls>
              <source
                src={uploadedCarouselVideo && URL?.createObjectURL(uploadedCarouselVideo)}
              />
            </video>
          </Stack>
        </When>
        <Stack direction="column" sx={{
          padding: "1.5em 0em",
          border: "2px solid #55f",
          borderStyle: "dashed",
        }} component="label" htmlFor="vid-input">
          <input type="file" style={{
            display: "none"
          }} name="vid-input" id="vid-input"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files) {
                const selectedFiles: FileList = e.target.files;
                const fileArray: File[] = Array.from(selectedFiles)
                setUploadedCarouselVideo(fileArray[0])
              }
            }}
          />
          <Typography variant="h6" textAlign="center">Upload Videos</Typography>
        </Stack>
        <Stack>
          <Typography variant="h6">Link Product</Typography>
          <Autocomplete
            options={products}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Choose Product" variant="outlined"
              />
            )}
            onChange={(_, newValue) => setLinkedProduct(newValue as IProduct)}
            value={linkedProduct}
            freeSolo={false}
          />
        </Stack>
        <Button variant="contained" onClick={handleCarouselVideoUpload}>Upload</Button>
      </Paper>
    </>
  )
}

export default AddCarouselVideo
