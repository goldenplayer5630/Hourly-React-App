import { ReactNode } from 'react';

export class NavItem {
    constructor(
      public label: string,
      public path: string,
      public icon: ReactNode
    ) {}
  }