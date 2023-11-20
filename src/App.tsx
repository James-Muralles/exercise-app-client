import { ThemeProvider, createTheme } from "@mui/material/styles"
import { useMemo, useState } from "react"
import { themeSettings } from "./theme"
import { Box, CssBaseline } from "@mui/material"
import NavBar from "./scenes/navbar"
import LoginPage from "@/scenes/loginPage";
import RegisterPage from "@/scenes/registerPage";
import HomePage from "@/scenes/homePage";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthState } from "./state/types"
import WorkoutPage from "./scenes/workoutPage"
import TemplatesPage from "./scenes/TemplatePage"
import SessionsCompletedPage from "./scenes/completedSessionsPage"
import WorkoutProgressChart from "./scenes/progressPage"
import './index.css'




function App() {
  const theme= useMemo(() => createTheme(themeSettings), [])
  const isAuth = Boolean(useSelector((state: AuthState) => state.isAuthenticated));
  const [workoutCompleted, setWorkoutCompleted] = useState(false);

  console.log(workoutCompleted)

  return (
   
      <div className="app">
        <BrowserRouter>
        <ThemeProvider theme={theme}> 
        {/* removes styling and sets to default */}
        <CssBaseline/>
        <Box width="100%" height="100%" padding="1rem 2rem 4rem 2rem">
        <NavBar/>
        <Routes>
          
          <Route path="/" element={isAuth ?  <Navigate to="/home" />  : <LoginPage />}/>
          <Route path="/login" element={isAuth ?  <Navigate to="/home" />  : <LoginPage />}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/Templates" element={<TemplatesPage/>}/>
          <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/workoutStart" element={workoutCompleted ? <Navigate to="/completedSessions" /> : <WorkoutPage workoutCompleted={workoutCompleted} setWorkoutCompleted={setWorkoutCompleted}/>} />
          <Route path="/completedSessions" element={<SessionsCompletedPage/>} />
          <Route path="/progress" element={<WorkoutProgressChart/>} />
        </Routes>
        
        </Box>
        </ThemeProvider>
        </BrowserRouter>
     
      </div>
      
  )
}

export default App
