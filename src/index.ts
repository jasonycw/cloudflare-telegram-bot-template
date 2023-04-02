/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import handleFetchedRequest from './features/fetchedRequestHandler';
import handleScheduledEvent from './features/scheduledEventHandler';
import Logger from './infras/logger';
import { Event, EnvironmentVariables } from './types/worker';

export default {
  async scheduled(event: Event, env: EnvironmentVariables, ctx: ExecutionContext) {
    const logger = new Logger(env);
    return await handleScheduledEvent(logger, event, env, ctx);
  },
  async fetch(request: Request, env: EnvironmentVariables, ctx: ExecutionContext): Promise<Response> {
    const logger = new Logger(env);
    return await handleFetchedRequest(logger, request, env);
  },
};
