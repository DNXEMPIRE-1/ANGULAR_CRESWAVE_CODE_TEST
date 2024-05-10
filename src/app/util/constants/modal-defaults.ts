import { ModalConfirmData } from 'src/app/models';

const cancelModalData = (): ModalConfirmData => ({
  title: 'Cancel',
  message: 'Are you sure you want to cancel? All changes will be lost.',
  confirmText: 'Yes, cancel',
});

const deleteModalData = (): ModalConfirmData => ({
  title: 'Delete Item',
  message: 'Are you sure you want to delete this item?',
  confirmText: 'Yes, delete',
});

const saveModalData = (): ModalConfirmData => ({
  title: 'Save Item',
  message: 'Are you sure you want to save this item?',
  confirmText: 'Yes, save',
});

const unsavedChangesModalData = (): ModalConfirmData => ({
  title: 'Unsaved Changes',
  message: 'Are you sure you want to leave? All unsaved changes will be lost.',
  confirmText: 'Yes, leave',
});

const logoutModalData = (): ModalConfirmData => ({
  title: 'Logout',
  message: 'Are you sure you want to logout?',
  confirmText: 'Yes, logout',
});

const successModalData = (): ModalConfirmData => ({
  title: 'Success',
  message: 'Your changes have been saved successfully!',
});

export {
  cancelModalData,
  deleteModalData,
  unsavedChangesModalData,
  saveModalData,
  successModalData,
  logoutModalData,
};
