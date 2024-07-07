import { toast } from "react-toastify";

export const toastMessage = (success:boolean)=>{
  if(success === true){
    return  toast.success('הפעולה בוצעה בהצלחה!', {
      position: 'top-right',
      rtl:true,
      autoClose: 3000, 
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
  return  toast.error('הפעולה נכשלה!', {
    position: 'top-right',
    rtl:true,
    autoClose: 3000, 
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

}