import { useEffect, useRef } from 'react';
import { socketService } from '../../lib/socketService';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/slices/notificationSlice';

const NotificationManager = () => {
    const dispatch = useDispatch();
    const audioRef = useRef(null);

    useEffect(() => {
        // Preload generic beep
        // Using a reliable CDN URL for notification sound
        audioRef.current = new Audio('https://res.cloudinary.com/dxfq3iotg/video/upload/v1557233524/success.mp3');
        audioRef.current.volume = 1.0;

        const handleNotification = (data) => {
            console.log('[NotificationManager] Received:', data);

            // 1. Update Redux State (UI Badge/List)
            dispatch(addNotification(data));

            // 2. Play Sound
            try {
                if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play().catch(e => console.warn('Audio play failed:', e));
                }
            } catch (error) {
                console.error('Error playing sound:', error);
            }

            // 3. Show Toast
            Swal.fire({
                position: 'top-end',
                icon: data.type || 'info', // success, error, warning, info, question
                title: data.title || 'New Notification',
                text: data.message,
                showConfirmButton: false,
                timer: 4000,
                toast: true,
                background: '#fff',
                color: '#333',
                customClass: {
                    popup: 'dark:bg-gray-800 dark:text-white'
                }
            });
        };

        const attachListener = () => {
            if (socketService.socket) {
                socketService.onNotification(handleNotification);
            } else {
                setTimeout(attachListener, 1000);
            }
        };

        attachListener();

        return () => {
            if (socketService.socket) {
                socketService.socket.off('notification', handleNotification);
            }
        };
    }, [dispatch]);

    return null;
};

export default NotificationManager;
