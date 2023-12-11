import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Avatar, Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, Arial',
  },
  palette: {
    background: {
      default: '#f5f5f5'
    },
  },
});

const UserProfile = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.default', minHeight: '85vh' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Avatar sx={{ width: 80, height: 80, mb: 2, backgroundColor: '#3f51b5' }}>
            {user && user.first_name[0] + user.last_name[0]}
          </Avatar>
          <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <strong>First Name</strong>
                  </TableCell>
                  <TableCell align="right">{user && user.first_name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <strong>Last Name</strong>
                  </TableCell>
                  <TableCell align="right">{user && user.last_name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <strong>Enrollment Number</strong>
                  </TableCell>
                  <TableCell align="right">{user && user.username}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell align="right">{user && user.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <strong>Current Year</strong>
                  </TableCell>
                  <TableCell align="right">{user && user.current_year}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="outlined" color="error" onClick={handleClickOpen} sx={{ mt: 2, fontFamily: 'Poppins'}}>
            Logout
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Logout</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to logout?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                No
              </Button>
              <Button onClick={handleLogout} color="error" autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default UserProfile;