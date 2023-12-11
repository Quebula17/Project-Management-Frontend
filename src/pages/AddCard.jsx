import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Typography, Paper, Box, Select, MenuItem, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAxios from '../utils/useAxios';

const CardForm = ({ onSubmit, project, card, setCard, lists }) => {
    const handleChange = (event) => {
        setCard({
            ...card,
            [event.target.name]: event.target.value,
        });
    };

    const teamMembers = project.team_members

    return (
        <Box component="form" onSubmit={onSubmit} sx={{ width: '100%' }}>
            <Box marginBottom={3}>
                <TextField
                    type="text" 
                    value={card.card_title} 
                    onChange={handleChange} 
                    name="card_title"
                    label="Card Title" 
                    required 
                    fullWidth
                    sx={{ fontFamily: 'Poppins', mb: 3 }}
                    InputLabelProps={{
                        style: { fontFamily: 'Poppins' },
                    }}
                    InputProps={{
                        style: { fontFamily: 'Poppins' },
                    }}
                />
                <InputLabel sx={{ fontFamily: 'Poppins'}}>Assign Members</InputLabel>
                <Select
                    required
                    multiple
                    name="assigned_users"
                    onChange={handleChange}
                    value={card.assigned_users}
                    fullWidth
                    sx={{ fontFamily: 'Poppins', mb: 3}}
                    >
                    {
                    teamMembers.map((member) => (
                        <MenuItem key={member.id} value={member.id} sx={{ fontFamily: 'Poppins'}}>
                        {member.first_name}
                        </MenuItem>
    ))}
                </Select>
                <InputLabel sx={{ fontFamily: 'Poppins'}}>Select List</InputLabel>
                <Select
                    required
                    name="task_list"
                    onChange={handleChange}
                    value={card.task_list}
                    fullWidth
                    sx={{ fontFamily: 'Poppins', mb: 3}}
                    >
                    {
                    lists.map((list) => (
                        <MenuItem key={list.list_id} value={list.list_id} sx={{ fontFamily: 'Poppins'}}>
                        {list.list_title}
                        </MenuItem>
    ))}
                </Select>
                <TextField
                        multiline
                        rows={4}
                        type="text" 
                        value={card.description} 
                        onChange={handleChange} 
                        name="description"
                        label="Description" 
                        required 
                        fullWidth
                        sx={{ fontFamily: 'Poppins', mb: 3 }}
                        InputLabelProps={{
                            style: { fontFamily: 'Poppins' },
                        }}
                        InputProps={{
                            style: { fontFamily: 'Poppins' },
                        }}
/>
            </Box>
            
            <Button type="submit" variant="contained" color="primary" fullWidth style={{ backgroundColor: '#3f51b5' }} sx={{ fontFamily: 'Poppins'}}>Add Card</Button>
        </Box>
    );
};

const AddCard = () => {

    const api = useAxios();
    const { projectId } = useParams();
    const [project, setProject] = useState({});
    const [lists, setLists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [card, setCard] = useState({
        card_title: '', 
        is_verified: false,
        assigned_users: [],
        task_list: '',
        description: '',
    });
    const navigate = useNavigate();

    const getProjectData = async () => {
        // fetch(`/api/projects/${projectId}`)
        // .then(response => response.json())
        // .then((data) => {
        //     console.log(data);
        //     setProject(data);
        // })
        // .catch((error) => {
        //     console.error('Error:', error);
        //     setIsLoading(false);
        // });

        let response = await api.get(`/api/projects/${projectId}`, {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`
        })
        if(response.status === 200){
            setProject(response.data);
        }
        else{
            console.log('Some Error Occurred')
        }

    }

    const getListData = async () => {

        // fetch('/api/lists/')
        // .then(response => response.json())
        // .then((data) => {
        //     setLists(data.filter(list => list.project.project_id === Number(projectId)));
        //     setIsLoading(false);
        // })

        let response = await api.get('/api/lists/', {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`
        })
        if(response.status === 200){
            setLists(response.data.filter(list => list.project.project_id === Number(projectId)));
            setIsLoading(false);
        }
        else{
            console.log('Some Error Occurred')
        }
        
    }

    useEffect(() => {

        getProjectData();
        getListData();

    }, [])

    const handleSubmit = async (event) => {

        event.preventDefault();

        // fetch('/api/cards/', {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(card),
        // })
        // .then((response) => {
        //     response.json()})
        // .then((data) => {
        //     console.log('Success:', data);
        //     navigate('/project/' + projectId, { state: { snackbarSuccessOpenCard: true } })
        // })
        // .catch((error) => {
        //     console.error('Error:', error);
        // });

        let response = await api.post('/api/cards/', 
        JSON.stringify(card),
        {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`,
                'Content-Type': 'application/json'
            }
        });
    
        if(response.status === 201){
            navigate(`/project/${projectId}`, { state: { snackbarSuccessOpenCard: true } })
        }
        else {
            console.log('Some Error Occured')
        }
    }



    return (
        <Paper elevation={3} style={{ padding: '3rem', backgroundColor: '#f5f5f5', minHeight: '80vh' }}>
            <Typography mb={2} variant="h4" gutterBottom sx={{ fontFamily: 'Poppins'}}>
                Create New Card
            </Typography>
            {isLoading ? <p>Loading...</p> : <CardForm onSubmit={handleSubmit} project={project} card={card} setCard={setCard} lists={lists} />}
        </Paper>
    );
};

export default AddCard;