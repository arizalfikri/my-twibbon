// store/uiStore.js
import { create } from 'zustand';

const useUIStore = create((set) => ({
  // Modal states
  showUploadModal: false,
  showCamera: false,
  
  // Loading states
  isDownloading: false,
  
  // Actions untuk modal
  setShowUploadModal: (show) => set({ showUploadModal: show }),
  setShowCamera: (show) => set({ showCamera: show }),
  
  // Actions untuk loading
  setIsDownloading: (loading) => set({ isDownloading: loading }),
  
  // Combined actions
  openUploadModal: () => set({ showUploadModal: true }),
  closeUploadModal: () => set({ showUploadModal: false }),
  
  openCamera: () => set({ 
    showCamera: true, 
    showUploadModal: false 
  }),
  closeCamera: () => set({ showCamera: false }),
  
  // Reset all modals
  closeAllModals: () => set({ 
    showUploadModal: false, 
    showCamera: false 
  }),
}));

export default useUIStore;