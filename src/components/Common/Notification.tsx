import React from 'react';
import { Snackbar, Alert } from '@mui/material';

export type NotificationState = {
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  };


interface Props {
    notification: NotificationState | null;
    onClose: () => void;
}

const Notification: React.FC<Props> = ({ notification, onClose }) => {
    return (
      <Snackbar
        open={!!notification}
        autoHideDuration={5000}
        onClose={onClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {notification ? (
          <Alert onClose={onClose} severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        ): undefined}
      </Snackbar>
    );
  };

  export default Notification;