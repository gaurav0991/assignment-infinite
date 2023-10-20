import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Paper, Typography, Grid, Button } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import CoinDetailsModal from './CoinDetailsModal';

function CoinDetails() {
    const [coinData, setCoinData] = useState(null);
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Fetch coin details from the API
        axios
            .get('https://api.binance.com/api/v3/ticker/24hr')
            .then((response) => {
                setCoinData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching coin details:', error);
            });
    }, []);

    if (!coinData) {
        return <p>Loading coin details...</p>;
    }

    const chartData = {
        labels: coinData.map((coin) => coin.symbol),
        datasets: [
            {
                label: 'Change Percentage',
                data: coinData.map((coin) => parseFloat(coin.priceChangePercent)),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const handleCoinSelect = (symbol) => {
        const selected = coinData.find((coin) => coin.symbol === symbol);
        setSelectedCoin(selected);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedCoin(null);
        setIsModalOpen(false);
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Coin Details
            </Typography>
            <Grid container spacing={2}>
                {coinData.map((coin, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper elevation={3}>
                            <Box p={2}>
                                <Typography variant="h6">Symbol: {coin.symbol}</Typography>
                                <Typography>Last Price: {coin.lastPrice}</Typography>
                                <Typography>Change Percentage: {coin.priceChangePercent}%</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleCoinSelect(coin.symbol)}
                                >
                                    Select Coin
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            {isModalOpen ? <CoinDetailsModal selectedCoin={selectedCoin} onClose={closeModal} /> : null}
        </div>
    );
}

export default CoinDetails;
