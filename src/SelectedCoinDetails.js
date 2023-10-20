import React, { useEffect, useRef, useState } from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { Line } from 'react-chartjs-2';
import axios from "axios"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    Title,
    Tooltip,
    Legend,
    PointElement
} from 'chart.js';

function SelectedCoinDetails({ selectedCoin }) {
    const chartRef = useRef(null);
    const [chartData, setChartData] = useState(null);


    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Months are zero-indexed
        const day = date.getDate();
        return date.toString().split(" ")[0]
    };
    useEffect(() => {

        fetchData()
    }, []);

    async function fetchData() {
        console.log(selectedCoin)
        const symbol = selectedCoin.symbol;
        const interval = '1d';
        let selectedCoinData = null
        // Make the API call to fetch the data
        const data = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}`)
        selectedCoinData = data.data
        ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);
        if (selectedCoinData && Array.isArray(selectedCoinData)) {
            const arr = selectedCoinData.slice(-10)
            console.log(selectedCoinData)

            // Extract timestamp and close prices from the data
            const timestamps = arr.map(item => formatTimestamp(item[6]));
            const closePrices = arr.map(item => (item[4]));
            const chartDatas = {
                labels: timestamps,
                datasets: [
                    {
                        label: 'Price Trend',
                        data: closePrices,
                        fill: false,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                    },
                ],
            };

            setChartData(chartDatas);
        }
    }
    return (
        <div>
            <Typography variant="h4" gutterBottom>
                {`Price Trend for ${selectedCoin.symbol}`}
            </Typography>
            <Paper elevation={3}>
                <Box p={2}>
                    {chartData ? <Line data={chartData} /> : 'Loading Chart...'}
                </Box>
            </Paper>
        </div>
    );
}

export default SelectedCoinDetails;
