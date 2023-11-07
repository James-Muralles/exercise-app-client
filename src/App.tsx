import { ThemeProvider, createTheme } from "@mui/material/styles"
import { useMemo } from "react"
import { themeSettings } from "./theme"
import { Box, CssBaseline } from "@mui/material"
import NavBar from "./scenes/navbar"
import LoginPage from "@/scenes/loginPage";
import RegisterPage from "@/scenes/registerPage";
import HomePage from "@/scenes/homePage";
import CreateTemplatePage from "@/scenes/createTemplate";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthState } from "./state/types"




function App() {
  const theme= useMemo(() => createTheme(themeSettings), [])
  const isAuth = Boolean(useSelector((state: AuthState) => state.isAuthenticated));
  console.log(isAuth)

  return (
   
      <div className="app">
        <BrowserRouter>
        <ThemeProvider theme={theme}> 
        {/* removes styling and sets to default */}
        <CssBaseline/>
        <Box width="100%" height="100%" padding="1rem 2rem 4rem 2rem">
        <NavBar/>
        <Routes>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/createTemplate" element={<CreateTemplatePage/>}/>
          <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/login" />} />
        </Routes>
        
        </Box>
        </ThemeProvider>
        </BrowserRouter>
     
      </div>
      
  )
}

export default App
