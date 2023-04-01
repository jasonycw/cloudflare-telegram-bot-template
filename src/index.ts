/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import handleRequestFetch from './features/fetchEventHandler';
import handleRequestScheduled from './features/scheduledEventHandler';

type Event = {
  cron: string;
  type: string;
  scheduledTime: number;
};
type Env = {
  [key: string]: string;
  KV: KVNamespace;
};

export default {
  async scheduled(event: Event, env: Env, ctx: ExecutionContext) {
    return handleRequestScheduled(event, env, ctx);
  },
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    return handleRequestFetch(request, env);
  },
};
