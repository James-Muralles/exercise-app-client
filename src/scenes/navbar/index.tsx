import {useState} from 'react';
import { Link } from 'react-router-dom';
import { Box,Typography, useTheme } from '@mui/material';
import FlexBetween from '@/components/FlexBetween';
import PixIcon from '@mui/icons-material/Pix';

const NavBar = () => {
    const {palette} = useTheme();
    const [selectedPage, setSelectedPage] = useState("loginPage");
  return (
    <FlexBetween mb="0.25rem" p=".5rem 0rem" color="black">

        {/* LEFT SIDE */}
        <FlexBetween gap=".75rem">
            <PixIcon sx={{fontSize: "23px"}}/>
            <Typography variant="h4" fontSize="16px">
                Jim Buddy
            </Typography>
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap="2rem">
            {/* @ts-ignore */}
            <Box sx={{"&:hover": { color: palette.secondary[200]}}}>
                <Link 
                to="/"
                onClick={()=> setSelectedPage("loginPage")}
                style={{
                    color: selectedPage === "loginPage" ? "inherit": palette.tertiary[500],
                    textDecoration: "inherit"
                }}
                >
                login</Link>
            </Box>
            {/* @ts-ignore */}
            <Box sx={{"&:hover": { color: palette.primary[100]}}}>
                <Link 
                to="/register"
                onClick={()=> setSelectedPage("predictions")}
                style={{
                    color: selectedPage === "register" ? "inherit": palette.tertiary[500],
                    textDecoration: "inherit"
                }}
                >
                register</Link>
            </Box>
        </FlexBetween>

    </FlexBetween>
  )
}

export default NavBar;
