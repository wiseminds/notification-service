import { IChannel } from './channel';
import { IPriority } from './priority';
import { IRecipient } from './recipient';

export interface ITemplate { 
    title?: string; 
    html?: string;
    text?: string; 
    data: object; 
    slug: string;
  }
  