import React, { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { requestForToken, onMessageListener } from '../firebase';

const Notification = () => {
  const navigate = useNavigate()
  const [notification, setNotification] = useState({ title: '', body: '', url: '' });
  const notify = () => toast(<ToastDisplay />);
  function ToastDisplay() {
    return (
      <div className='notificationPopup' onClick={() => window.open(notification.url, "_blank")}>
        <p><b>{notification?.title}</b></p>
        <p>{notification?.body}</p>
      </div>
    );
  };

  useEffect(() => {
    if (notification?.title) {
      notify()
    }
  }, [notification])

  requestForToken();

  onMessageListener()
    .then((payload) => {
      setNotification({ title: payload?.notification?.title, body: payload?.notification?.body, url: payload?.data?.url });
    })
    .catch((err) => console.log('failed: ', err));

  return (
    <Toaster />
  )
}

export default Notification