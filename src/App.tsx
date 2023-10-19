import { ThemeProvider, createTheme } from "@mui/material/styles"
import { useMemo } from "react"
import { themeSettings } from "./theme"
import { CssBaseline } from "@mui/material"


function App() {
  const theme= useMemo(() => createTheme(themeSettings), [])
  return (
   
      <div className="app">
        <ThemeProvider theme={theme}> 
        {/* removes styling and sets to default */}
        <CssBaseline/>
        hi
        </ThemeProvider>
     
      </div>
      
  )
}

export default App
