import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import List from "../components/List";
import { SpeedDial, SpeedDialAction, Typography, Link, Table, TableBody, TableCell, TableContainer, TableRow, Paper, CircularProgress, Box, Button } from "@mui/material";
import ListIcon from '@mui/icons-material/List';
import CardIcon from '@mui/icons-material/CardMembership';
import AddIcon from '@mui/icons-material/Add';
import { Snackbar } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import GitHubIcon from '@mui/icons-material/GitHub';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AuthContext from "../context/AuthContext";
import useAxios from "../utils/useAxios";



const ProjectPage = () => {

    const api = useAxios();

    const { user } = useContext(AuthContext);

    const { projectId } = useParams();
    const [lists, setLists] = useState([]);
    const [project, setProject] = useState({});
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const [openSnackbarCard, setOpenSnackbarCard] = useState(location.state?.snackbarSuccessOpenCard || false);
    const [openSnackbarList, setOpenSnackbarList] = useState(location.state?.snackbarSuccessOpenList || false);


    const deleteProject = async (event) => {
            
            if(window.confirm('Do you want to DELETE this project?')){

            let response = await api.delete(`/api/projects/${projectId}/`, {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`
            })
            if(response.status === 204){
                navigate('/');
            }
            else{
                console.log('Some Error Occurred');
            }
        }
    }

    const handleCloseSnackbarCard = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbarCard(false);
    };

    const handleCloseSnackbarList = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbarList(false);
    };

    const navigate = useNavigate();

    const actions = [
        { icon: <ListIcon />, name: 'Add new list', path: `/add/list/${projectId}` },
        { icon: <CardIcon />, name: 'Add new card', path: `/add/card/${projectId}` },
    ];

    const getListData = async () => {

        let response = await api.get('/api/lists/', {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`
        })
        if(response.status === 200){
          const filteredData = response.data.filter(item => item.project.project_id === Number(projectId));
          setLists(filteredData);
        }
        else{
            console.log('Some Error Occurred')
        }
    }

    const getProjectData = async () => {

        let response = await api.get(`/api/projects/${projectId}/`, {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`
        })
        if(response.status === 200){
              setProject(response.data);
              setLoading(false);
          }
          else{
              console.log('Some Error Occurred')
          }
    }

    useEffect(() => {

        getListData();
        getProjectData();

    }, []);

    useEffect(() => {
        if (location.state?.snackbarSuccessOpenCard) {
            navigate('.', { state: { snackbarSuccessOpenCard: false } });
        }
        if (location.state?.snackbarSuccessOpenList) {
            navigate('.', { state: { snackbarSuccessOpenList: false } });
        }
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleAction = (path) => {
        handleClose();
        navigate(path);
    };

    return (
        <>
        <SpeedDial
            ariaLabel="SpeedDial"
            sx={{ position: 'fixed', bottom: 50, right: 50 }}
            icon={<AddIcon />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
        >
            {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={<Typography sx={{ fontFamily: 'Poppins' }}>{action.name}</Typography>}
                    onClick={() => handleAction(action.path)}
                />
            ))}
        </SpeedDial>
        <Box display="flex" justifyContent="space-between" alignItems="center">
    <div className="greeting">{project.project_name}{ ' ' }
        <Link href={project.github_link} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
            <GitHubIcon/>
        </Link>
    </div>
    <Box>
    {  user.is_admin &&  <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate('update')} sx={{ mr: 2 }}>Edit</Button>}
       { user.is_admin && <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => deleteProject()} sx={{ mr: 5 }}>Delete</Button>}
    </Box>
</Box>
       <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mb={4}>
    {loading ? <CircularProgress /> : 
        <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableBody>
                    <TableRow>
                        <TableCell><Typography style={{ fontFamily: 'Poppins', fontWeight: 'bold' }}>Description</Typography></TableCell>
                        <TableCell><Typography style={{ fontFamily: 'Poppins' }}>{project.description}</Typography></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Typography style={{ fontFamily: 'Poppins', fontWeight: 'bold' }}>Maintainer</Typography></TableCell>
                        <TableCell><Typography style={{ fontFamily: 'Poppins' }}>{project.maintainer.first_name} {project.maintainer.last_name}</Typography></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><Typography style={{ fontFamily: 'Poppins', fontWeight: 'bold' }}>Team Members</Typography></TableCell>
                        <TableCell>
                            {project.team_members.map((member) => (
                                <Typography key={member.id} style={{ fontFamily: 'Poppins' }}>{member.first_name} {member.last_name}</Typography>
                            ))}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    }
</Box>

        {
            lists.map(list => (
                <List key={list.list_id} list={list} />
            ))
        }
                    <Snackbar open={openSnackbarList} autoHideDuration={6000} onClose={handleCloseSnackbarList}>
                <MuiAlert onClose={handleCloseSnackbarList} severity="success" elevation={6} variant="filled">
                    List created successfully!
                </MuiAlert>
            </Snackbar>
            <Snackbar open={openSnackbarCard} autoHideDuration={6000} onClose={handleCloseSnackbarCard}>
                <MuiAlert onClose={handleCloseSnackbarCard} severity="success" elevation={6} variant="filled">
                    Card created successfully!
                </MuiAlert>
            </Snackbar>
        </>
    )
}

export default ProjectPage;