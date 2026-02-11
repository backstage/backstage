'use client';

import {
  Autocomplete,
  Dialog,
  Input,
  Label,
  Menu,
  MenuItem,
  Modal,
  ModalOverlay,
  SearchField,
  useFilter,
} from 'react-aria-components';
import { useRouter } from 'next/navigation';
import { components } from '@/utils/data';
import styles from './CommandPalette.module.css';

interface CommandPaletteProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const items = components.map(c => ({ id: c.slug, ...c }));

export const CommandPalette = ({
  isOpen,
  onOpenChange,
}: CommandPaletteProps) => {
  const router = useRouter();
  const { contains } = useFilter({ sensitivity: 'base' });

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable
      className={styles.overlay}
    >
      <Modal className={styles.modal}>
        <Dialog aria-label="Command palette" className={styles.dialog}>
          <Autocomplete filter={contains}>
            <SearchField
              autoFocus
              aria-label="Search components"
              className={styles.searchField}
            >
              <Label className={styles.srOnly}>Search</Label>
              <Input
                placeholder="Search components..."
                className={styles.input}
              />
            </SearchField>
            <Menu
              items={items}
              className={styles.menu}
              onAction={key => {
                router.push(`/components/${key}`);
                onOpenChange(false);
              }}
              renderEmptyState={() => (
                <div className={styles.empty}>No components found.</div>
              )}
            >
              {item => (
                <MenuItem id={item.slug} className={styles.menuItem}>
                  {item.title}
                </MenuItem>
              )}
            </Menu>
          </Autocomplete>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};
