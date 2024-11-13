import { Paper, Typography, Stack, Button } from "@mui/material";
import { When } from "../../components/hoc/When";
import { ChangeEvent, FC, useState } from "react";
import toast from "react-hot-toast";
import { url } from "../../axios";
import LoaderComponent from "../../components/loader/Loader";

interface IAddCarouselImage {
  fetchCarouselImage: () => void;
}

const AddCarouselImage: FC<IAddCarouselImage> = ({ fetchCarouselImage }) => {

  const [loading, setLoading] = useState(false)

  //carousel image to upload
  const [uploadedCarouselImage, setUploadedCarouselImage] = useState<File | undefined>(undefined)

  const handleCarouselImageUpload = async () => {
    const formData = new FormData()
    if (uploadedCarouselImage) {
      formData.append("image", uploadedCarouselImage, uploadedCarouselImage.name)
    }
    try {
      setLoading(true)
      await url.post('/app-feature/img', formData)
      toast.success("Uploaded Succesfully!")
      setUploadedCarouselImage(undefined)
      fetchCarouselImage()
      setLoading(false)
    } catch (e) {
      toast.error("Something went wrong! Try again later!")
      setUploadedCarouselImage(undefined)
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
        <Typography variant="h5">Add Carousel Image</Typography>
        <When condition={!!uploadedCarouselImage}>
          <Stack direction="row" columnGap="0.5em">
            <img
              src={uploadedCarouselImage && URL?.createObjectURL(uploadedCarouselImage)}
              alt={"Carousel Image Preview"}
              style={{ width: '100px' }}
            />
          </Stack>
        </When>
        <Stack direction="column" sx={{
          padding: "1.5em 0em",
          border: "2px solid #55f",
          borderStyle: "dashed",
        }} component="label" htmlFor="img-input">
          <input type="file" style={{
            display: "none"
          }} name="img-input" id="img-input"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files) {
                const selectedFiles: FileList = e.target.files;
                const fileArray: File[] = Array.from(selectedFiles)
                setUploadedCarouselImage(fileArray[0])
              }
            }}
          />
          <Typography variant="h6" textAlign="center">Upload Images</Typography>
        </Stack>
        <Button variant="contained" onClick={handleCarouselImageUpload}>Upload</Button>
      </Paper>
    </>
  )
}

export default AddCarouselImage
