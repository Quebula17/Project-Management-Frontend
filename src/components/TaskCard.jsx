import { useState, useContext } from 'react';
import { Card, CardActionArea, CardContent, Typography, Modal, Box, Button } from '@mui/material';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useAxios from '../utils/useAxios';

const TaskCard = (props) => {

    const api = useAxios();
    const [open, setOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const deleteCard = async (event) => {

        if(window.confirm('Do you want to DELETE this card?')){
        handleClose();

        // fetch('/api/cards/' + props.card.card_id + '/', {
        //     method: 'DELETE',
        // })
        // .then((response) => {
        //   window.location.href = '/project/' + props.card.task_list.project.project_id})
        // .catch((error) => {
        //     console.error('Error:', error);
        // });

        let response = await api.delete(`/api/cards/${props.card.card_id}/`, {
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

    return (
        <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column'}}>
            <CardActionArea onClick={handleOpen}>
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div" sx = {{fontFamily: 'Poppins'}}>
                        {props.card.card_title}
                    </Typography>
                    <Typography  mt={1} component="div" sx = {{fontFamily: 'Poppins', fontSize: '1rem'}}>
                    Assigned To: {props.card.assigned_users.map((user) => user.first_name).join(', ')}
                    </Typography>
                </CardContent>
            </CardActionArea>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    width: 400, 
                    bgcolor: 'background.paper', 
                    border: '2px solid #000', 
                    boxShadow: 24, 
                    p: 4 
                }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{fontFamily: 'Poppins'}}>
                        {props.card.card_title}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2, fontFamily: 'Poppins' }}>
                        {props.card.description}
                    </Typography>
{             user.is_admin &&     <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={(event) => {
                        event.stopPropagation();
                        deleteCard();
                            }} 
                    sx={{ mt: 2, ml: 1, fontFamily: 'Poppins' }} 
>
                        Delete Card
                    </Button>}
       {    user.is_admin &&  <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={(event) => {
                        event.stopPropagation();
                        navigate('card/' + props.card.card_id);
                            }} 
                    sx={{ mt: 2, ml: 1, fontFamily: 'Poppins' }} 
>
                        Update Card
                    </Button>}
                </Box>
            </Modal>
        </Card>
    )
}

export default TaskCard;