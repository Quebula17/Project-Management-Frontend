import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, Typography, Paper, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAxios from '../utils/useAxios';

const AddProjectForm = () => {

  const api = useAxios();
  const navigate = useNavigate();
  const [project, setProject] = useState({
    project_name: '',
    description: '',
    maintainer: '',
    team_members: [],
    github_link: '',
  });

  const [users, setUsers] = useState([]);
  const [maintainers, setMaintainers] = useState([]);

  const getUserData = async () => {
    // fetch('/api/users')
    // .then((response) => response.json())
    // .then((data) => {
    //   setUsers(data);
    //   const thirdYearUsers = data.filter(user => user.current_year === 3);
    //   setMaintainers(thirdYearUsers);
    // })
    // .catch((error) => {
    //   console.error('Error:', error);
    // });

    let response = await api.get('/api/users/', {
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`
    }
    })
    if(response.status === 200){
      setUsers(response.data);
      const thirdYearUsers = response.data.filter(user => user.current_year === 3);
      setMaintainers(thirdYearUsers);
    }
    else{
      console.log('Some Error Occurred')
    }

  }

  useEffect(() => {
    getUserData();
  }, []);

  const handleChange = (event) => {
    setProject({
      ...project,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    let response = await api.post('/api/projects/', 
    JSON.stringify(project),
    {
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`,
            'Content-Type': 'application/json'
        }
    });

    if(response.status === 201){
      navigate('/', { state: { snackbarSuccessOpen: true } });
    }
    else {
        console.log('Some Error Occured')
        navigate('/')
    }
  };


    return (

  <Paper elevation={3} style={{ padding: '3rem', backgroundColor: '#f5f5f5', minHeight: '80vh' }}>
    <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Poppins'}}>
      Create New Project
    </Typography>
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box marginBottom={2}>
            <TextField
              required
              name="project_name"
              label="Project Name"
              value={project.project_name}
              onChange={handleChange}
              fullWidth
              sx={{ fontFamily: 'Poppins'}}
              InputLabelProps={{
                style: { fontFamily: 'Poppins' },
              }}
              InputProps={{
                style: { fontFamily: 'Poppins' },
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box marginBottom={2}>
            <TextField
              required
              name="github_link"
              label="GitHub Link"
              value={project.github_link}
              onChange={handleChange}
              fullWidth
              sx={{ fontFamily: 'Poppins' }}
              InputLabelProps={{
                style: { fontFamily: 'Poppins' },
              }}
              InputProps={{
                style: { fontFamily: 'Poppins' },
              }}
            />
          </Box>
        </Grid>
      </Grid>
      <Box marginBottom={2}>
        <InputLabel sx={{ fontFamily: 'Poppins'}}>Maintainer</InputLabel>
        <Select
          required
          name="maintainer"
          value={project.maintainer}
          onChange={handleChange}
          fullWidth
          sx={{ fontFamily: 'Poppins'}}
        >
          {maintainers.map((user) => (
            <MenuItem key={user.id} value={user.id} sx={{ fontFamily: 'Poppins'}}>
              {user.first_name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box marginBottom={2}>
        <InputLabel sx={{ fontFamily: 'Poppins'}}>Team Members</InputLabel>
        <Select
          required
          name="team_members"
          multiple
          value={project.team_members}
          onChange={handleChange}
          fullWidth
          sx={{ fontFamily: 'Poppins'}}
        >
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id} sx={{ fontFamily: 'Poppins'}}>
              {user.first_name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box marginBottom={2}>
        <TextField
          required
          name="description"
          label="Description"
          value={project.description}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
          sx={{ fontFamily: 'Poppins' }}
          InputLabelProps={{
            style: { fontFamily: 'Poppins' },
          }}
          InputProps={{
            style: { fontFamily: 'Poppins' },
          }}
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        fullWidth
        style={{ backgroundColor: '#3f51b5' }}
        sx={{ fontFamily: 'Poppins', mt : 2}}
      >
        Submit
      </Button>
    </form>
  </Paper>
);
  };
  
  export default AddProjectForm;