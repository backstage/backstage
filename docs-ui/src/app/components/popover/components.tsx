'use client';

import { Popover } from '../../../../../packages/ui/src/components/Popover/Popover';
import { DialogTrigger } from '../../../../../packages/ui/src/components/Dialog/Dialog';
import { Button } from '../../../../../packages/ui/src/components/Button/Button';

export const Default = () => {
  return (
    <DialogTrigger>
      <Button>Open Popover</Button>
      <Popover>
        <div style={{ padding: '16px' }}>
          <p>This is a popover</p>
        </div>
      </Popover>
    </DialogTrigger>
  );
};
