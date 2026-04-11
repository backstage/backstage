import type { EvalTask } from '../types';
import cardsWithList from './cards-with-list';
import cardsWithTable from './cards-with-table';
import headerWithActions from './header-with-actions';
import loginForm from './login-form';
import dialogForm from './dialog-form';
import dataTable from './data-table';

export const tasks: EvalTask[] = [
  // Tier 1 — Recipe / Guideline tasks (golden-path composition patterns)
  cardsWithList,
  cardsWithTable,
  headerWithActions,
  // Tier 2 — Component API tasks (individual prop/API knowledge)
  loginForm,
  dialogForm,
  dataTable,
];

export function getTask(id: string): EvalTask {
  const task = tasks.find(t => t.id === id);
  if (!task) {
    throw new Error(
      `Unknown task "${id}". Available tasks: ${tasks
        .map(t => t.id)
        .join(', ')}`,
    );
  }
  return task;
}
