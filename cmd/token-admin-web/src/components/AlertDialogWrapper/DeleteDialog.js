import React from 'react';
import AlertDialogWrapper from '~/components/AlertDialogWrapper';
import Typography from '~/components/Typography';

export const DeleteDialog = ({ dialogType, text, ...props }) => {
  const open = dialogType === 'DELETE';

  return (
    <AlertDialogWrapper level='warning' open={open} {...props}>
      <Typography varient='h4'>您確定要刪除{text}嗎？</Typography>
    </AlertDialogWrapper>
  );
};

export default DeleteDialog;
