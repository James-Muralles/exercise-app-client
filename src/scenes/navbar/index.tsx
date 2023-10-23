import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import FlexBetween from '@/components/FlexBetween';
import PixIcon from '@mui/icons-material/Pix';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from 'react-redux';

const NavBar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const navigate = useNavigate();
  const isMobileScreens = useMediaQuery('(max-width: 1000px)');
  const { palette } = useTheme();
  const [selectedPage, setSelectedPage] = useState('loginPage');

  const toggleMobileMenu = () => {
    setIsMobileMenuToggled(!isMobileMenuToggled);
  };

  const handleLoginClick = () => {
    if (isMobileScreens) {
      setIsMobileMenuToggled(false); // Close the mobile menu when "Login" is clicked
    }
    setSelectedPage('loginPage');
    navigate('/login'); // Navigate to the login page
  };

  const handleRegisterClick = () => {
    if (isMobileScreens) {
      setIsMobileMenuToggled(false); // Close the mobile menu when "Login" is clicked
    }
    setSelectedPage('registerPage');
    navigate('/register'); // Navigate to the login page
  };

  

  return (
    <FlexBetween flexDirection={isMobileScreens ? 'column' : 'row'} mb="0.25rem" p=".5rem 0rem" color={palette.tertiary[500]}>
      {/* LEFT SIDE */}
      <FlexBetween gap=".75rem">
        <PixIcon sx={{ fontSize: '23px' }} />
        <Typography variant="h4" fontSize="16px">
          Jim Buddy
        </Typography>
      </FlexBetween>

      {/* RIGHT SIDE (Responsive) */}
      {isMobileScreens ? (
        // Display on mobile screens
        <Box>
          <button
            onClick={toggleMobileMenu}
            style={{
              width: '50vw', // Set the width to 80% of the viewport width
              height: '10vh',
              display: 'block',
              borderColor: palette.secondary[200],
              borderRadius: '5px',
            }}
          >
            <MenuIcon fontSize="large" />
          </button>
          {isMobileMenuToggled && (
            <div>
              <div>
                <Link
                  style={{
                    color: selectedPage === 'loginPage' ? 'inherit' : palette.grey[500],
                    textDecoration: 'inherit',
                  }}
                  onClick={handleLoginClick}
                  to="/"
                >
                  <Typography textAlign="center" fontSize="5vh">
                    LOGIN
                  </Typography>
                </Link>
              </div>
              <div>
                <Link
                  style={{
                    color: selectedPage === 'registerPage' ? 'inherit' : palette.grey[500],
                    textDecoration: 'inherit',
                  }}
                  onClick={handleRegisterClick}
                  to="/register"
                >
                  <Typography textAlign="center" fontSize="5vh">
                    REGISTER
                  </Typography>
                </Link>
              </div>
            </div>
          )}
        </Box>
      ) : (
        // Display on non-mobile screens
        <FlexBetween gap="2rem">
          <Box sx={{ '&:hover': { color: palette.secondary[200] } }}>
            <Link
              to="/"
              onClick={handleLoginClick}
              style={{
                color: selectedPage === 'loginPage' ? 'inherit' : palette.grey[500],
                textDecoration: 'inherit',
              }}
            >
              login
            </Link>
          </Box>
          <Box>
            <Link
              to="/register"
              onClick={() => setSelectedPage('registerPage')}
              style={{
                color: selectedPage === 'registerPage' ? 'inherit' : palette.grey[500],
                textDecoration: 'inherit',
              }}
            >
              register
            </Link>
          </Box>
        </FlexBetween>
      )}
    </FlexBetween>
  );
};

export default NavBar;
