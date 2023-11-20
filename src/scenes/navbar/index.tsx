import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import FlexBetween from '@/components/FlexBetween';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '@/state';
import {AuthState} from "@/state/types";


const NavBar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const navigate = useNavigate();
  const isMobileScreens = useMediaQuery('(max-width: 767px)');
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

  const handleTemplatesClick = () => {
    if (isMobileScreens) {
      setIsMobileMenuToggled(false);
    }
    setSelectedPage('TemplatePage');
    navigate('/templates');
  };

  const handleCompletedSessionsClick = () => {
    if (isMobileScreens) {
      setIsMobileMenuToggled(false);
    }
    setSelectedPage('completedSessionsPage');
    navigate('/completedSessions');
  };
  const handleCompletedProgressClick = () => {
    if (isMobileScreens) {
      setIsMobileMenuToggled(false);
    }
    setSelectedPage('progressPage');
    navigate('/progress');
  };

  

   // Use Redux to check if the user is authenticated
   const isAuthenticated = useSelector((state: AuthState ) => state.isAuthenticated);
   const dispatch = useDispatch();

   const handleLogout = () => {
    // Handle logout and dispatch the action
    dispatch(setLogout());
    navigate('/login'); // Redirect to the home page or any desired page after logout
  };

  // Increase the size of the img when in mobile mode
  const imgSize = isMobileScreens ? '2.5rem' : '1.5rem';

  

  return (
    <FlexBetween sx={{ borderBottom: 2, borderColor: palette.primary[200] }} flexDirection={isMobileScreens ? 'column' : 'row'} mb="0.25rem" p=".5rem 0rem" color={palette.tertiary[500]}>
      {/* LEFT SIDE */}
      <FlexBetween gap=".75rem">
        {!isMobileScreens && (
          <>
            <img
              style={{
                width: imgSize,
                height: imgSize,
              }}
              alt="jim-icon" src='src/assets/man-lifting-weights.png'
            />
            <Typography sx={{ color: `${palette.secondary[100]}` }} variant="h4" fontSize="1rem">
              Jim Buddy
            </Typography>
          </>
        )}
      </FlexBetween>

      {/* RIGHT SIDE (Responsive) */}
      {isMobileScreens ? (
        // Display on mobile screens
        <Box mt={3}>
          <button
            onClick={toggleMobileMenu}
            style={{
              width: '50vw',
              height: '10vh',
              display: 'block',
              border: `2px solid ${palette.tertiary[500]}`,
              borderRadius: '10px',
              background: `${palette.secondary[200]}`,
              marginBottom: '10px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <img
              style={{
                width: imgSize,
                height: imgSize,
                filter: 'sepia(100%) hue-rotate(240deg)',
              }}
              alt="jim-icon" src='src/assets/man-lifting-weights.png'
            />
          </button>
          {isMobileMenuToggled && (
            <div style={{ textAlign: 'center' }}>
              {isAuthenticated ? (
                // Display Logout when authenticated
                <div>
                  <button
                    style={{
                      color: palette.grey[500],
                      textDecoration: 'inherit',
                      margin: '5px 0',
                    }}
                    onClick={handleTemplatesClick}
                  >
                    <Typography textAlign="center" fontSize="5vh">
                      Templates
                    </Typography>
                  </button>
                  <button
                    style={{
                      color: palette.grey[500],
                      textDecoration: 'inherit',
                      margin: '5px 0',
                    }}
                    onClick={handleCompletedSessionsClick}
                  >
                    <Typography textAlign="center" fontSize="5vh">
                      Completed Sessions
                    </Typography>
                  </button>
                  <button
                    style={{
                      color: palette.grey[500],
                      textDecoration: 'inherit',
                      margin: '5px 0',
                    }}
                    onClick={handleCompletedProgressClick}
                  >
                    <Typography textAlign="center" fontSize="5vh">
                      Progress
                    </Typography>
                  </button>
                  <button
                    style={{
                      color: palette.grey[500],
                      textDecoration: 'inherit',
                      margin: '5px 0',
                    }}
                    onClick={handleLogout}
                  >
                    <Typography textAlign="center" fontSize="5vh">
                      Logout
                    </Typography>
                  </button>
                </div>
              ) : (
                // Display Login and Register when not authenticated
                <>
                  <div>
                    <Link
                      style={{
                        color: selectedPage === 'loginPage' ? 'inherit' : palette.grey[500],
                        textDecoration: 'inherit',
                        margin: '5px 0',
                      }}
                      onClick={handleLoginClick}
                      to="/login"
                    >
                      <Typography textAlign="center" fontSize="5vh">
                        Login
                      </Typography>
                    </Link>
                  </div>
                  <div>
                    <Link
                      style={{
                        color: selectedPage === 'registerPage' ? 'inherit' : palette.grey[500],
                        textDecoration: 'inherit',
                        margin: '5px 0',
                      }}
                      onClick={handleRegisterClick}
                      to="/register"
                    >
                      <Typography textAlign="center" fontSize="5vh">
                        Register
                      </Typography>
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </Box>
      ) : (
        // Display on non-mobile screens
        <FlexBetween gap="2rem">
          <Box sx={{ '&:hover': { color: palette.secondary[200] } }}>
            {isAuthenticated ? (
              // Display Logout when authenticated
              <Box>
                <button
                  className='buttonNav'
                  style={{
                    color: palette.grey[500],
                    textDecoration: 'inherit',
                    margin: '5px 0',
                  }}
                  onClick={handleTemplatesClick}
                >
                  Templates
                </button>
                <button
                  className='buttonNav'
                  style={{
                    color: palette.grey[500],
                    textDecoration: 'inherit',
                    margin: '5px 0',
                  }}
                  onClick={handleCompletedSessionsClick}
                >
                  Completed Sessions
                </button>
                 <button
                  className='buttonNav'
                  style={{
                    color: palette.grey[500],
                    textDecoration: 'inherit',
                    margin: '5px 0',
                  }}
                  onClick={handleCompletedProgressClick}
                >
                  Progress
                </button>
                <button
                  className='buttonNav'
                  style={{
                    color: palette.grey[500],
                    textDecoration: 'inherit',
                    margin: '5px 0',
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </Box>
            ) : (
              // Display Login and Register when not authenticated
              <Box sx={{ display: 'flex', gap: '10px' }}>
                <Link
                  to="/login"
                  onClick={handleLoginClick}
                  style={{
                    color: selectedPage === 'loginPage' ? 'inherit' : palette.grey[500],
                    textDecoration: 'inherit',
                    margin: '5px 0',
                  }}
                >
                  <Typography textAlign="center" fontSize="2vh">
                    Login
                  </Typography>
                </Link>
                <Link
                  to="/register"
                  onClick={handleRegisterClick}
                  style={{
                    color: selectedPage === 'registerPage' ? 'inherit' : palette.grey[500],
                    textDecoration: 'inherit',
                    margin: '5px 0',
                  }}
                >
                  <Typography textAlign="center" fontSize="2vh">
                    Register
                  </Typography>
                </Link>
              </Box>
            )}
          </Box>
        </FlexBetween>
      )}
    </FlexBetween>
  );
};

export default NavBar;
