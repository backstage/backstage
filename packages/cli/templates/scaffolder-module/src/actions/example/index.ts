import { scaffolderModule } from './module';

/*
  @deprecated - this way of importing modules will soon be unsupported, and you should use `backend.add(import(...))` instead.
*/
export { createAcmeExampleAction } from './example';
export default scaffolderModule;
