import { IChannel } from './channel';
import { IPriority } from './priority';
import { IRecipient } from './recipient';

export interface IMessage {
    messageId: string;
    title?: string; 
    html?: string;
    text?: string;
    template?: string;
    priority: IPriority;
    channels: IChannel[];
    recipients: IRecipient[];
    data: object;
    from?: string;
    image?: string;
    analyticsLabel?: string;
    webhook?: string;
    // sendIndividually: boolean;
  }
  