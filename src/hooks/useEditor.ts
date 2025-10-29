import create from 'zustand';

interface EditorImage {
  id: number;
  url: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface EditorState {
  mode: 'edit' | 'view';
  images: EditorImage[];
  setMode: (mode: 'edit' | 'view') => void;
  addImage: (url: string) => void;
  updateImage: (id: number, updates: Partial<EditorImage>) => void;
  removeImage: (id: number) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  mode: 'view',
  images: [],
  setMode: (mode) => set({ mode }),
  addImage: (url) =>
    set((state) => ({
      images: [
        ...state.images,
        {
          id: Date.now(),
          url,
          position: { x: 0, y: 0 },
          size: { width: 200, height: 200 },
        },
      ],
    })),
  updateImage: (id, updates) =>
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id ? { ...img, ...updates } : img
      ),
    })),
  removeImage: (id) =>
    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
    })),
}));