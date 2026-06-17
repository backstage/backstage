import { Chip } from '../Chip';
import {
  Button,
  Dialog,
  DialogTrigger,
  OverlayArrow,
  Popover,
} from 'react-aria-components';
import styles from './SpacingPopup.module.css';

interface SpacingPopupProps {
  values: string[];
}

export const SpacingPopup = ({ values }: SpacingPopupProps) => {
  // Display abbreviated list: first, second, ..., last
  const firstValue = values[0];
  const secondValue = values[1];
  const lastValue = values[values.length - 1];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
      <Chip>{firstValue}</Chip>
      <Chip>{secondValue}</Chip>
      <DialogTrigger>
        <Button className={styles.button}>...</Button>
        <Popover className={styles.popover}>
          <OverlayArrow className={styles.arrow}>
            <svg width={12} height={12} viewBox="0 0 12 12">
              <path d="M0 0 L6 6 L12 0" />
            </svg>
          </OverlayArrow>
          <Dialog>
            <div className={styles.title}>All spacing values</div>
            <div className={styles.grid}>
              {values.map(value => (
                <Chip key={value}>{value}</Chip>
              ))}
            </div>
            <div className={styles.note}>Also accepts custom string values</div>
          </Dialog>
        </Popover>
      </DialogTrigger>
      <Chip>{lastValue}</Chip>
    </div>
  );
};
