import { useEffect } from 'react';
import { toast } from 'react-toastify';


interface UseSuccessToastProps {
    success: boolean;
  
}

export const useSuccessToast = ({ success }: UseSuccessToastProps) => {
  useEffect(() => {

    
    if (success) {
        console.log('successAddFeature');
      toast.success('! הפעולה בוצעה בהצלחה', {
        position: "top-right",
        autoClose: 3000, // Close the toast after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    else  {
        console.log('successDeleteFeature');
      toast.error('!ישנה שגיאה', {
        position: "top-right",
        autoClose: 3000, // Close the toast after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [success ]);
};


