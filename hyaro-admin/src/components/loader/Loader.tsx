import { CircularProgress } from '@mui/material'

const LoaderComponent = () => {
  return (
    <CircularProgress sx={{
      position: "fixed",
      top: "45%",
      left: "50%",
      zIndex: 100
    }} size={60} />
  )
}

export default LoaderComponent

