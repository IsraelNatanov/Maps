
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { forwardRef, useEffect, useState } from "react";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
type OpenProps = {
  openAlertSnackbar: boolean;
};

export default function SnackbarMessage({ openAlertSnackbar }: OpenProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (openAlertSnackbar === true) {
      setOpen(true)
    }
  }, [openAlertSnackbar])
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  return (
    <Snackbar open={open} autoHideDuration={3000}
      onClose={handleClose}
      message="Note archived" >
      <Alert severity="success" sx={{ width: '100%' }}>
        ! הפעולה בוצעה בהצלחה
      </Alert>
    </Snackbar>
  );
}
