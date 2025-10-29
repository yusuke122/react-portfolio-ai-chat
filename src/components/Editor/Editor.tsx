import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import * as Switch from '@radix-ui/react-switch';
import { useEditorStore } from '@/hooks/useEditor';
import './Editor.scss';

export const Editor: React.FC = () => {
  const { t } = useTranslation();
  const { mode, setMode, images } = useEditorStore();

  return (
    <div className="editor-container p-3">
      <div className="editor-header mb-4">
        <h2>{t('editor.title')}</h2>
        <div className="d-flex align-items-center">
          <span className="me-2">{t('editor.editMode')}</span>
          <Switch.Root
            checked={mode === 'edit'}
            onCheckedChange={(checked) => setMode(checked ? 'edit' : 'view')}
            className="switch-root"
          >
            <Switch.Thumb className="switch-thumb" />
          </Switch.Root>
        </div>
      </div>
      
      <motion.div
        layout
        className="editor-content"
      >
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            layoutId={`image-${image.id}`}
            drag={mode === 'edit'}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            className="image-container"
          >
            <img src={image.url} alt={`Editor image ${index + 1}`} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};