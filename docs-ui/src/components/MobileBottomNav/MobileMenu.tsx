'use client';

import { Button, Dialog, Modal, ModalOverlay } from 'react-aria-components';
import { RiCloseLine } from '@remixicon/react';
import styles from './MobileBottomNav.module.css';
import { Navigation } from '@/components/Navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onClose}
      className={styles.overlay}
      isDismissable
    >
      <Modal className={styles.modal}>
        <Dialog className={styles.dialog} aria-label="Navigation menu">
          {({ close }) => (
            <div className={styles.menuContent}>
              <Navigation onLinkClick={close} />
            </div>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};
