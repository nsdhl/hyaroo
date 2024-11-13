import { Box } from "@mui/material"
import { FC, ReactNode } from "react"

interface IPageLayoutWrapper {
  children: ReactNode;
}

export const PageLayoutWrapper: FC<IPageLayoutWrapper> = ({ children }) => {
  return (
    <Box sx={{
      width: "90%",
      margin: "0 auto",
      p: "1.5em 0em"
    }}>
      {children}
    </Box>
  )
}
