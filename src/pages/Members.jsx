import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Card, CardContent, Typography, Box, Grid, CardActionArea, CardActions, Button } from '@mui/material';
import useAxios from '../utils/useAxios';

const Members = () => {

    const api = useAxios();
    const { user } = useContext(AuthContext);
    const [admins, setAdmins] = useState([]);
    const [nonAdmins, setNonAdmins] = useState([]);
    const [blacklist, setBlacklist] = useState([]);

    const getBlackListedData = async () => {

        let response = await api.get('/api/blacklisted_users', {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`
        })
        if (response.status === 200){
            const blacklistedIds = response.data? response.data.map(blacklistedUser => blacklistedUser.user.id) : [];
            setBlacklist(blacklistedIds);
        }
        else{
            console.log('Some Error Occurred')
        }
    }

    useEffect(() => {
        fetch('/api/users')
        .then(response => response.json())
        .then(data => {
            setAdmins(data.filter(u => u.is_admin));
            setNonAdmins(data.filter(u => !u.is_admin));
        })
        .catch(error => console.log(error));

        getBlackListedData();


    }, []);

    const blacklistUser = async (userId) => {
        if (window.confirm('Do you want to blacklist this user?')) {

            let response = await api.post('/api/blacklisted_users/', 
            JSON.stringify({
                user: userId,
            }),
            {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if(response.status === 201){
                setBlacklist([...blacklist, userId]);
            }
            else {
                console.log('Some Error Occured')
            }
        }
    };

    const promoteToAdmin = async (userId) => {
        // if (window.confirm('Do you want to promote this user to admin?')) {
        //     fetch('/api/users/' + userId + '/', {
        //         method: 'PATCH',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`,
        //         },
        //         body: JSON.stringify({
        //             is_admin: true,
        //         })
        //     })
        //     .then(response => response.json())
        //     .then(data => {
        //         if (data.id) {
        //             setAdmins([...admins, data]);
        //             setNonAdmins(nonAdmins.filter(u => u.id !== userId));
        //         } else {
        //             console.error('Failed to promote user to admin');
        //         }
        //     })
        //     .catch(error => console.error('Error:', error));
        // }

        if (window.confirm('Do you want to promote this user to admin?')) {

            let response = await api.patch(`/api/users/${userId}/`, 
            JSON.stringify({
                is_admin: true,
            }),
            {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if(response.status === 200){
                    setAdmins([...admins, response.data]);
                    setNonAdmins(nonAdmins.filter(u => u.id !== userId));
            }
            else {
                console.log('Some Error Occured')
            }
        }
    }

    const demoteAdmin = async (userId) => {
        if (window.confirm('Do you want to demote this user from admin?')) {
            // fetch('/api/users/' + userId + '/', {
            //     method: 'PATCH',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`,
            //     },
            //     body: JSON.stringify({
            //         is_admin: false,
            //     })
            // })
            // .then(response => response.json())
            // .then(data => {
            //     if (data.id) {
            //         setNonAdmins([...nonAdmins, data]);
            //         setAdmins(admins.filter(u => u.id !== userId));
            //     } else {
            //         console.error('Failed to demote admin');
            //     }
            // })
            // .catch(error => console.error('Error:', error));

            let response = await api.patch(`/api/users/${userId}/`, 
            JSON.stringify({
                is_admin: false,
            }),
            {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if(response.status === 200){
                    setNonAdmins([...nonAdmins, response.data]);
                    setAdmins(admins.filter(u => u.id !== userId));
            }
            else {
                console.log('Some Error Occured')
            }
        }
    }


    const renderUserCard = (User) => {


        if(user.user_id === User.id){
            return null;
        }
    
        return (
            <Grid item xs={12} sm={6} md={3} key={User.id}>
                <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <CardActionArea onClick={() => console.log('User card clicked')}>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography gutterBottom variant="h5" component="div" sx = {{fontFamily: 'Poppins'}}>
                                {User.first_name}{blacklist.includes(User.id) && ' (Blacklisted)'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx = {{fontFamily: 'Poppins'}}>
                                {User.last_name}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        {
                        !User.is_admin && !blacklist.includes(User.id) && <Button size="small" color="primary" onClick={() => promoteToAdmin(User.id)} sx = {{fontFamily: 'Poppins'}}>
                            Promote to Admin
                        </Button>}
    
                        {
                        User.is_admin && !blacklist.includes(User.id) && <Button size="small" color="error" onClick={() => demoteAdmin(User.id)} sx = {{fontFamily: 'Poppins'}}>
                            Demote
                        </Button>}
                        { !User.is_admin && !blacklist.includes(User.id) && <Button size="small" color="error" onClick={() => blacklistUser(User.id)} sx = {{fontFamily: 'Poppins'}}>
                            Blacklist User
                        </Button>}
                    </CardActions>
                </Card>
            </Grid>
        );
    
                        }

    return (
        <Box sx={{ flexGrow: 1, m:3}}>
            <div className='greeting'>Admins</div>
            <Grid container spacing={2}>
                {admins.map(renderUserCard)}
            </Grid>
            <div className='greeting'>Non-Admins</div>
            <Grid container spacing={2}>
                {nonAdmins.map(renderUserCard)}
            </Grid>
        </Box>
    );
};

export default Members;