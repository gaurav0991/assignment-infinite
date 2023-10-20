import React from 'react';
import { Modal, Paper, Typography, Box } from '@mui/material';
import SelectedCoinDetails from './SelectedCoinDetails';

function CoinDetailsModal({ selectedCoin, onClose }) {
    return (
        <Modal open={!!selectedCoin} onClose={onClose}>
            <Paper style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Box p={2}>
                    <Typography variant="h5">Selected Coin Details</Typography>
                    <SelectedCoinDetails selectedCoin={selectedCoin} />
                </Box>
            </Paper>
        </Modal>
    );
}

export default CoinDetailsModal;
