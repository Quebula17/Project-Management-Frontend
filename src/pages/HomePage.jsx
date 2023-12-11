import React, { useState, useEffect } from "react";
import ProjectCard from "../components/ProjectCard";
import Greeting from "../components/Greeting";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Link, useLocation } from 'react-router-dom';
import { Snackbar, Grid } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import useAxios from "../utils/useAxios";

const HomePage = () => {

    const [projects, setProjects] = useState([]);
    const location = useLocation();
    const [openSnackbar, setOpenSnackbar] = useState(location.state?.snackbarSuccessOpen || false);

    const api = useAxios()

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    useEffect(() => {

        getProjects();

    }, []);

    const getProjects = async () => {

        let response = await api.get('/api/projects/', {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`
            }
        })

        if (response.status === 200){
            setProjects(response.data)
        }
        else {
            console.log('Some Error Occurred')
        }

    }

    return (
        <>
        <Greeting />
            <Grid container spacing={2} sx = {{padding: 2}}>
                {projects.map(project => (
                    <ProjectCard key={project.project_id} project={project} />
                ))}
            </Grid>
            <Link to="/add/project">
                <Fab color="primary"  aria-label="add" sx={{ position: 'fixed', bottom: 50, right: 50 }}>
                    <AddIcon />
                </Fab>
            </Link>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <MuiAlert onClose={handleCloseSnackbar} severity="success" elevation={6} variant="filled">
                    Project created successfully!
                </MuiAlert>
            </Snackbar>
        </>
    );
}

export default HomePage;