import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Typography, Paper, Box, Select, MenuItem, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAxios from '../utils/useAxios';

const ListForm = ({ onSubmit, projects, list, setList }) => {
    const handleChange = (event) => {
        setList({
            ...list,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <Box component="form" onSubmit={onSubmit} sx={{ width: '100%' }}>
            <Box marginBottom={2}>
                <TextField
                    type="text" 
                    value={list.list_title} 
                    onChange={handleChange} 
                    name="list_title"
                    label="List Name" 
                    required 
                    fullWidth
                    sx={{ fontFamily: 'Poppins', mb: 2 }}
                    InputLabelProps={{
                        style: { fontFamily: 'Poppins' },
                    }}
                    InputProps={{
                        style: { fontFamily: 'Poppins' },
                    }}
                />
                <InputLabel sx={{ fontFamily: 'Poppins'}}>Project</InputLabel>
                <Select
                    required
                    name="project"
                    onChange={handleChange}
                    value={list.project}
                    fullWidth
                    sx={{ fontFamily: 'Poppins'}}
                    >
                    {projects.map((project) => (
                        <MenuItem key={project.project_id} value={project.project_id} sx={{ fontFamily: 'Poppins'}}>
                        {project.project_name}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
            
            <Button type="submit" variant="contained" color="primary" fullWidth style={{ backgroundColor: '#3f51b5' }} sx={{ fontFamily: 'Poppins', mt : 2 }}>Add List</Button>
        </Box>
    );
};

const AddList = () => {

    const api = useAxios();
    const { projectId } = useParams();
    const [projects, setProjects] = useState([]);
    const [list, setList] = useState({
        list_title: '', 
        project: projectId,
    });
    const navigate = useNavigate();

    const handleSubmit = async (event) => {

        event.preventDefault();

        let response = await api.post('/api/lists/', 
        JSON.stringify(list),
        {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`,
                'Content-Type': 'application/json'
            }
        });
    
        if(response.status === 201){
            navigate(`/project/${projectId}`, { state: { snackbarSuccessOpenList: true } })
        }
        else {
            console.log('Some Error Occured')
        }
    }


    const getProjectsData = async () => {

        let response = await api.get(`/api/projects/`, {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`
        })
        if(response.status === 200){
              setProjects(response.data);
          }
          else{
              console.log('Some Error Occurred')
          }
    }

    useEffect(() => {

        getProjectsData();

    }, [])

    return (
        <Paper elevation={3} style={{ padding: '3rem', backgroundColor: '#f5f5f5', minHeight: '80vh' }}>
            <Typography mb={2} variant="h4" gutterBottom sx={{ fontFamily: 'Poppins'}}>
                Create New List
            </Typography>
            <ListForm onSubmit={handleSubmit} projects={projects} list={list} setList={setList} />
        </Paper>
    );
};

export default AddList;