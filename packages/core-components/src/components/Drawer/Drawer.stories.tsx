/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useState } from 'react';
import { cn } from '../../lib/utils';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '../ui/sheet';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

export default {
  title: 'Layout/Drawer',
  component: Sheet,
  tags: ['!manifest'],
};

/* Example content wrapped inside the Sheet component */
const DrawerContent = ({
  toggleDrawer,
}: {
  toggleDrawer: (isOpen: boolean) => void;
}) => {
  return (
    <>
      <SheetHeader>
        <div className={cn('flex flex-row justify-between items-center')}>
          <SheetTitle>Side Panel Title</SheetTitle>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              title="Close the drawer"
              onClick={() => toggleDrawer(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        </div>
        <SheetDescription>Example drawer content</SheetDescription>
      </SheetHeader>
      <div className="h-[80%] bg-muted" />
      <SheetFooter>
        <Button variant="default" onClick={() => toggleDrawer(false)}>
          Primary Action
        </Button>
        <Button
          variant="outline"
          className="ml-5"
          onClick={() => toggleDrawer(false)}
        >
          Secondary Action
        </Button>
      </SheetFooter>
    </>
  );
};

/* Default drawer can toggle open or closed.
 * It can be cancelled by clicking the overlay
 * or pressing the esc key.
 */
export const DefaultDrawer = () => {
  const [isOpen, toggleDrawer] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={toggleDrawer}>
      <SheetTrigger asChild>
        <Button variant="default" onClick={() => toggleDrawer(true)}>
          Open Default Drawer
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-1/2 flex flex-col justify-between p-6"
      >
        <DrawerContent toggleDrawer={toggleDrawer} />
      </SheetContent>
    </Sheet>
  );
};

/* Persistent drawer works like the default one —
 * except that the content sits on the same level
 * as the main content and you can't cancel it by
 * clicking the overlay or pressing the esc key.
 *
 * Set the Sheet modal prop to false for persistent behavior.
 */
export const PersistentDrawer = () => {
  const [isOpen, toggleDrawer] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={toggleDrawer} modal={false}>
      <SheetTrigger asChild>
        <Button variant="default" onClick={() => toggleDrawer(true)}>
          Open Persistent Drawer
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-1/2 flex flex-col justify-between p-6"
      >
        <DrawerContent toggleDrawer={toggleDrawer} />
      </SheetContent>
    </Sheet>
  );
};
