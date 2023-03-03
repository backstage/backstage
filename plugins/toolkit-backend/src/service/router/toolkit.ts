/*
 * Copyright 2023 The Backstage Authors
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
import { Router } from 'express';

import {
  addToolkit,
  createUpdateToolkit,
  deleteToolkitById,
  toolkitById,
  myToolkits,
  getToolkits,
  removeToolkit,
} from '../controller';

const router = Router();
router.get('/myToolkits', myToolkits);
router.get('/getToolkits', getToolkits);
router.get('/:id', toolkitById);
router.post('/create', createUpdateToolkit);
router.put('/update/:id', createUpdateToolkit);
router.post('/add', addToolkit);
router.delete('/delete/:id', deleteToolkitById);
router.delete('/remove/:toolkit', removeToolkit);
export default router;
