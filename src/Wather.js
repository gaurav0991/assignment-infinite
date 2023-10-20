import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, Paper, CircularProgress } from '@mui/material';;

function WeatherData() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('https://api.data.gov.sg/v1/environment/air-temperature');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const jsonData = await response.json();
                setData(jsonData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: 'center' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom>
                Places and Air Temperatures
            </Typography>
            <List>
                {data.metadata.stations.map((station) => {
                    console.log(station)
                    const reading = data.items[0].readings.find((r) => r.station_id === station.id);
                    return (
                        <ListItem key={station.id}>
                            <ListItemText
                                primary={`Place: ${station.name}`}
                                secondary={`Air Temperature: ${reading.value} ${'reading_unit'}`}
                            />
                        </ListItem>
                    );
                })}
            </List>
        </Paper>);
}


export default WeatherData;
