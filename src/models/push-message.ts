export interface IPushMessage {
    topic?: string;
    tokens?: string[];
    notification: {title: string, body: string, image?: string};
    image?: string
    analyticsLabel?: string;
  }
  