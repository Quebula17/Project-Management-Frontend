import React from "react";
import { Card, CardActionArea, CardActions, CardContent, Button, Typography, Grid } from '@mui/material';
import { useNavigate } from "react-router-dom";

const ProjectCard = (props) => {
    const navigate = useNavigate();
    return (
        <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column'}}>
                <CardActionArea onClick={() => navigate('/project/' + props.project.project_id)}>
                    
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="div" sx = {{fontFamily: 'Poppins'}}>
                            {props.project.project_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx = {{fontFamily: 'Poppins'}}>
                            {props.project.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button size="small" color="primary" onClick={() => window.open(props.project.github_link, "_blank")} sx = {{fontFamily: 'Poppins'}}>
                        Link to Github
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    )
}

export default ProjectCard;