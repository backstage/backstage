import { ComplexTypeDef } from '@/utils/propDefs';
import { Chip } from '../Chip';
import {
  Button,
  Dialog,
  DialogTrigger,
  OverlayArrow,
  Popover,
} from 'react-aria-components';
import styles from './TypePopup.module.css';

interface TypePopupProps {
  complexType: ComplexTypeDef;
  name: string;
}

export const TypePopup = ({ complexType, name }: TypePopupProps) => {
  return (
    <DialogTrigger>
      <Button className={styles.button}>{name}</Button>
      <Popover className={styles.popover}>
        <OverlayArrow className={styles.arrow}>
          <svg width={12} height={12} viewBox="0 0 12 12">
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </OverlayArrow>
        <Dialog>
          <div className={styles.name}>{complexType.name}</div>
          <div className={styles.grid}>
            {Object.entries(complexType.properties).map(
              ([propName, propDef]) => [
                <div key={`${propName}-name`} className={styles.col1}>
                  {propName}
                  {propDef.required ? '' : '?'}
                </div>,
                <div key={`${propName}-type`} className={styles.col2}>
                  <Chip>{propDef.type}</Chip>
                </div>,
                <div key={`${propName}-desc`} className={styles.col3}>
                  {propDef.description}
                </div>,
              ],
            )}
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
};
