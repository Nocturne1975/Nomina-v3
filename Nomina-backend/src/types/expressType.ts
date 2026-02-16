import type { ClerkAuthPayload } from './authType';

declare global {
  namespace Express {
    interface Request {
      auth?: ClerkAuthPayload;
    }
  }
}

export {};
