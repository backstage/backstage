/*
 * Copyright 2025 The Backstage Authors
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

import {
  ShadcnDialog,
  ShadcnDialogContent,
  DialogHeader,
  DialogFooter,
  ShadcnDialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';

const meta = {
  title: 'Layout/Dialog',
  component: ShadcnDialog,
  tags: ['!manifest'],
};

export default meta;

export const Default = {
  args: {
    open: true,
  },
  render: ({ open }: { open: boolean }) => {
    return (
      <ShadcnDialog open={open}>
        <ShadcnDialogContent>
          <DialogHeader>
            <ShadcnDialogTitle>Dialog Box Title</ShadcnDialogTitle>
            <DialogDescription>
              This component is used whenever confirmation of some sort is
              needed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm text-foreground">
            <p>Common use cases include:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Consent to sensitive matters like GDPR, access, etc;</li>
              <li>Save, submit, cancel after a form is completed;</li>
              <li>Alert message;</li>
              <li>Buttons are optional.</li>
            </ul>
            <p className="text-muted-foreground">
              The color for the secondary button is the same as the primary.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline">Secondary action</Button>
            <Button>Primary action</Button>
          </DialogFooter>
        </ShadcnDialogContent>
      </ShadcnDialog>
    );
  },
};
