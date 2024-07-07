import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 type ToastMessageProps ={
    success:boolean
 }
export default function ToastMessage( {success }:ToastMessageProps) {
  useEffect(() => {
    if (success) {
      toast.success('!הפעולה בוצאה בהצלחה', {
        position: "top-right",
        autoClose: 3000, // Close the toast after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [success]);

  return <ToastContainer />;
}
