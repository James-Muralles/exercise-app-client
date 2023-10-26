import React, { useState } from 'react';
import { Box, Typography, TextField, Button, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { RegisterFormValues } from '@/state/types';



const RegisterForm = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const registerSchema = yup.object().shape({
    firstName: yup.string().required('required'),
    lastName: yup.string().required('required'),
    email: yup.string().required('required'),
    username: yup.string().required('required'),
    password: yup.string().required('required'),
  });

  const initialLoginValues = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  };

  

  const register = async (values: RegisterFormValues, onSubmitProps: { resetForm: () => void; }) =>{
    // const formData = new FormData();
    const savedUserResponse = await fetch(
      "http://localhost:1337/auth/register",
      {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      }
    );
    const savedUser = await savedUserResponse.json();
    console.log(savedUser)
    onSubmitProps.resetForm();

  }

  // Handle form submission
  const handleFormSubmit = async (values: RegisterFormValues, onSubmitProps: { resetForm: () => void; }) => {
    await register(values, onSubmitProps);
    navigate("/home");
  };


  return (
    <Box >
        <Formik
      onSubmit={handleFormSubmit} 
      initialValues={initialLoginValues}
      validationSchema={registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        resetForm,
      }) => (
      <form onSubmit={handleSubmit}>
        {isMobileScreen ? (
          // Mobile view
          <>
            <TextField
             style={{
               width: '100%',
               background: 'white',
               
              }}
              label="First Name"
              name='firstName'
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.firstName}
              error={Boolean(touched.firstName) && Boolean(errors.firstName)}
              helperText={touched.firstName && errors.firstName}
              fullWidth
              margin="normal"
              />
              <TextField
             style={{
               width: '100%',
               background: 'white',
               
              }}
              label="Last Name"
              name='lastName'
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.lastName}
              error={Boolean(touched.lastName) && Boolean(errors.lastName)}
              helperText={touched.lastName && errors.lastName}
              fullWidth
              margin="normal"
              />
            <TextField
              style={{
                width: '100%',
                background: 'white',
              }}
              label="Username"
              name='username'
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.username}
              error={Boolean(touched.username) && Boolean(errors.username)}
              helperText={touched.username && errors.username}
              fullWidth
              margin="normal"
            />

            <TextField
              style={{
                width: '100%',
                background: 'white',
              }}
              label="Email"
              name='email'
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              fullWidth
              margin="normal"
            />

            <TextField
              style={{
                width: '100%',
                background: 'white',
              }}
              label="Password"
              name='password'
              type='password'
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              fullWidth
              margin="normal"
            />
            <Button variant="contained"
              style={{
                backgroundColor: theme.palette.secondary[200],
                color: theme.palette.tertiary[500],
                border: `1px solid ${theme.palette.tertiary[500]}`
                      }}
              type="submit">
          Register
        </Button>
          </>
        ) : (
          // Desktop view
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <TextField
              style={{
                width: '40vh',
                background: 'white',
              }}
              label="First Name"
              name='firstName'
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.firstName}
              error={Boolean(touched.firstName) && Boolean(errors.firstName)}
              helperText={touched.firstName && errors.firstName}
              fullWidth
              margin="normal"
            />
            <TextField
              style={{
                width: '40vh',
                background: 'white',
              }}
              label="Last Name"
              name='lastName'
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.lastName}
              error={Boolean(touched.lastName) && Boolean(errors.lastName)}
              helperText={touched.lastName && errors.lastName}
              fullWidth
              margin="normal"
            />
            <TextField
              style={{
                width: '40vh',
                background: 'white',
              }}
              label="Username"
              name='username'
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.username}
              error={Boolean(touched.username) && Boolean(errors.username)}
              helperText={touched.username && errors.username}
              fullWidth
              margin="normal"
            />
            <TextField
              style={{
                width: '40vh',
                background: 'white',
              }}
              label="Email"
              name='email'
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              fullWidth
              margin="normal"
            />
            <TextField
              style={{
                width: '40vh',
                background: 'white',
              }}
              label="Password"
              name='password'
              type='password'
              variant="outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              fullWidth
              margin="normal"
            />
             <Button variant="contained"
              style={{
                backgroundColor: theme.palette.secondary[200],
                color: theme.palette.tertiary[500],
                border: `1px solid ${theme.palette.tertiary[500]}`
                      }}
              type="submit">
          Register
         </Button>
            </Box>
          )}
        </form>
      )}
    </Formik>
    </Box>
  );
};

export default RegisterForm;
