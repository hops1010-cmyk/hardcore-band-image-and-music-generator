import type { Request, Response } from 'express';
import { app } from '../server';

export default function handler(request: Request, response: Response) {
  const url = request.url || '/';
  if (url !== '/api' && !url.startsWith('/api/')) {
    request.url = `/api${url.startsWith('/') ? url : `/${url}`}`;
  }

  return app(request, response);
}