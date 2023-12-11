import React, { useState, useContext } from "react";
import ProjectCard from "../components/ProjectCard";
import { Grid } from '@mui/material';
import AuthContext from "../context/AuthContext";
import useAxios from "../utils/useAxios";

const UserDashboard = () => {

    const [userProjects, setUserProjects] = useState([]);
    const {user} = useContext(AuthContext);
    const api = useAxios();

    const getDashboard = async () => {

        let response = await api.get('/api/projects/', {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('access_token'))}`
            },
        })

        if (response.status === 200){
                     for (let i = 0; i < response.data.length; i++) {
                  for (let j = 0; j < response.data[i].team_members.length; j++) {
                      if (response.data[i].team_members[j].id === user.user_id || response.data[i].maintainer.id === user.user_id) {
                          setUserProjects(userProjects => [...userProjects, response.data[i]]);
                          break;
                      }
                  }
                }
        }

    }


    React.useEffect(() => {

        getDashboard();

    }, []);

    return (
        <>
        <div className="greeting">{user.first_name}'s Dashboard</div>
            <Grid container spacing={2} sx = {{padding: 2}}>
                {userProjects.map(project => (
                    <ProjectCard key={project.project_id} project={project} />
                ))}
            </Grid>
        </>
    );
}

export default UserDashboard;