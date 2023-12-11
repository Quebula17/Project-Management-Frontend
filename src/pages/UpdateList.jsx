import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Typography, Paper, Box} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAxios from '../utils/useAxios';

const ListForm = ({ onSubmit, list, setList }) => {
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
            </Box>
            
            <Button type="submit" variant="contained" color="primary" fullWidth style={{ backgroundColor: '#3f51b5' }} sx={{ fontFamily: 'Poppins', mt : 2 }}>Update</Button>
        </Box>
    );
};

const UpdateList = () => {

    const api = useAxios();
    const { projectId, listId } = useParams();
    const [list, setList] = useState({
        list_title: '', 
        project: projectId,
    });
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        
        event.preventDefault();

        let response = await api.put(`/api/lists/${listId}/`, 
        JSON.stringify(list),
        {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`,
                'Content-Type': 'application/json'
            }
        });

        if(response.status === 200){
            navigate('/project/' + projectId)
        }
        else {
            console.log('Some Error Occured')
        }
    }

    const getListData = async () => {

        let response = await api.get(`/api/lists/${listId}/`)

        if (response.status === 200){
            setList({
                list_title: response.data.list_title,
                project: projectId,
            })
        }
        else{
            console.log('Some Error Occured')
        }

    }
    

    useEffect(() => {
        getListData();
    }, [])

    return (
        <Paper elevation={3} style={{ padding: '3rem', backgroundColor: '#f5f5f5', minHeight: '80vh' }}>
            <Typography mb={2} variant="h4" gutterBottom sx={{ fontFamily: 'Poppins'}}>
                Update List
            </Typography>
            <ListForm onSubmit={handleSubmit} list={list} setList={setList} />
        </Paper>
    );
};

export default UpdateList;