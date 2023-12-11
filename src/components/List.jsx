import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import TaskCard from './TaskCard';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useAxios from '../utils/useAxios';


const List = (props) => {


    const api = useAxios();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [cards, setCards] = useState([])
    const teamMembersIds = props.list.project.team_members?.map(member => member.id);
    const userCanEdit = teamMembersIds?.includes(user.user_id) || props.list.project.maintainer === user.user_id || user.is_admin


    const deleteList = async (event) => {
                
                if(window.confirm('Do you want to DELETE this list?')){
        
                // fetch('/api/lists/' + props.list.list_id + '/', {
                //     method: 'DELETE',
                // })
                // .then((response) => {
                // window.location.reload() })
                // .catch((error) => {
                //     console.error('Error:', error);
                // });

                let response = await api.delete(`/api/lists/${props.list.list_id}/`, {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`
                })
                if(response.status === 204){
                    window.location.reload();
                }
                else{
                    console.log('Some Error Occurred')
                }
            }
        }

    useEffect(() => {
        fetch('/api/cards/')
          .then(response => response.json())
          .then((data) => {
            const filteredData = data.filter(item => item.task_list.list_id === props.list.list_id);
            setCards(filteredData);
          });
    }, [])

    return (
        <Box pb={2} sx={{ width: '100%', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div className="greeting">
                {props.list.list_title}
{      userCanEdit &&          <IconButton onClick={() => navigate('list/' + props.list.list_id)} sx = {{color: 'blue'}}>
                    <EditIcon />
                </IconButton>}
{        user.is_admin &&        <IconButton onClick={() => deleteList()} sx = {{color: 'red'}}>
                    <DeleteIcon />
                </IconButton>}
            </div>
            <Grid pl={2} container spacing={2} sx={{ width: '100%', flexWrap: 'wrap' }}>
                {cards.length > 0 ? (
                    cards.map(card => (
                        <Grid key={card.card_id} item xs={12} sm={6} md={3}>
                            <TaskCard card={card} />
                        </Grid>
                    ))
                ) : (
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="h6" component="div" sx={{ fontFamily: 'Poppins', color: 'grey' }}>
                            The list is empty
                        </Typography>
                    </Box>
                )}
            </Grid>
        </Box>
    );
}

export default List;