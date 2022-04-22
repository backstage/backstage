import React, { PropsWithChildren } from 'react';
import { Typography, Box, IconButton } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';

type Props = {
    onRefresh: () => void;
}

const InfoCardHeader = (props: PropsWithChildren<Props>) => {
    const { children, onRefresh } = props;

    return (
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center">
                <Typography variant="h5">Open pull requests</Typography>
                <IconButton color="secondary" onClick={onRefresh}>
                    <RefreshIcon />
                </IconButton>
            </Box>
            {children}
        </Box>
    );
};

export default InfoCardHeader;
