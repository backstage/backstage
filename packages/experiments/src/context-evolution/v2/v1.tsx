import { AppContextV2 } from './v2';

export interface AppContextV1I extends AppContextV2 {}

export class AppContextV1 extends AppContextV2 implements AppContextV1I {}
