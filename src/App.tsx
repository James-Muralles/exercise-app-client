import { ThemeProvider, createTheme } from "@mui/material/styles"
import { useMemo } from "react"
import { themeSettings } from "./theme"
import { Box, CssBaseline } from "@mui/material"
import NavBar from "./scenes/navbar"
import LoginPage from "@/scenes/loginPage";
import RegisterPage from "@/scenes/registerPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";




function App() {
  const theme= useMemo(() => createTheme(themeSettings), [])
  return (
   
      <div className="app">
        <BrowserRouter>
        <ThemeProvider theme={theme}> 
        {/* removes styling and sets to default */}
        <CssBaseline/>
        <Box width="100%" height="100%" padding="1rem 2rem 4rem 2rem">
        <NavBar/>
        <Routes>
          <Route path="/" element={<LoginPage/>}/>
        </Routes>
        <Routes>
          <Route path="/register" element={<RegisterPage/>}/>
        </Routes>
        </Box>
        </ThemeProvider>
        </BrowserRouter>
     
      </div>
      
  )
}

export default App
