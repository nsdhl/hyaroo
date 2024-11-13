import { Typography, Stack } from "@mui/material"
import AddCarouselImage from "./AddCarouselImage"
import RemoveCarouselImage from "./RemoveCarouselImage"
import { getAdminProducts, getCarouselImages, getCarouselVideos, getCategories } from "../../api"
import { useEffect, useState } from "react"
import { ICategory, IProduct, IVideo } from "../../types/interfaces"
import { When } from "../../components/hoc/When"
import LoaderComponent from "../../components/loader/Loader"
import AddCarouselVideo from "./AddCarouselVideo"
import RemoveCarouselVideo from "./RemoveCarouselVideo"
import ManageCategories from "./ManageCategories"

const Customize = () => {
  const [loading, setLoading] = useState(false)

  //fetched carousel images
  const [carouselImages, setCarouselImages] = useState<{ _id: string; image: string; }[]>([])

  //fetched carousel videos
  const [carouselVideos, setCarouselVideos] = useState<IVideo[]>([])

  //current admin/vendor/supplier product
  const [products, setProducts] = useState<IProduct[]>([])

  //fetched categories
  const [categories, setCategories] = useState<ICategory[]>([])

  const fetchCarouselImage = async () => {
    const carouselImages = await getCarouselImages()
    setCarouselImages(carouselImages)
  }

  const fetchCarouselVideo = async () => {
    const carouselVideos = await getCarouselVideos()
    setCarouselVideos(carouselVideos)
  }

  const fetchCategories = async () => {
    const categories = await getCategories()
    setCategories(categories)
  }

  useEffect(() => {
    (
      async () => {
        setLoading(true)
        await fetchCarouselImage()
        await fetchCarouselVideo()
        const products = await getAdminProducts()
        setProducts(products)
        fetchCategories()
        setLoading(false)
      }
    )()
  }, [])

  return (
    <>
      <When condition={loading}>
        <LoaderComponent />
      </When>
      <Stack mb="1.5em">
        <Typography variant="h3">Customize App</Typography>
      </Stack>

      <AddCarouselImage fetchCarouselImage={fetchCarouselImage} />

      <RemoveCarouselImage carouselImages={carouselImages} fetchCarouselImage={fetchCarouselImage} />

      <AddCarouselVideo fetchCarouselVideo={fetchCarouselVideo} products={products} />

      <RemoveCarouselVideo carouselVideos={carouselVideos} fetchCarouselVideo={fetchCarouselVideo} />

      <ManageCategories categories={categories} fetchCategories={fetchCategories} />
    </>
  )
}

export default Customize
