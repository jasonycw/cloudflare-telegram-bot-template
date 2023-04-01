/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
/* eslint-disable @typescript-eslint/object-curly-spacing */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import type { Request as WorkerRequest } from '@cloudflare/workers-types/experimental';
import Logger from '../infras/logger';

type Env = Record<string, any>;

export default async function handleRequest(request: WorkerRequest, env: Env) {
  const logger = new Logger(env);
  try {
    if (request.method === 'POST') {
      const payload = await request.json();
      if (payload?.message?.from && !payload.message.from.is_bot) {
        const kvKey = `conversation-with-${payload.message.from.username}`;
        const past = await env.KV.get(kvKey, { type: 'json' });
        const kvValue = { ...past };
        kvValue[payload.message.date] = kvValue.hasOwnProperty(
          payload.message.date,
        )
          ? [...kvValue[payload.message.date], payload.message.text]
          : (kvValue[payload.message.date] = [payload.message.text]);
        await env.KV.put(kvKey, JSON.stringify(kvValue));

        if (!payload.message.from.is_bot) {
          const chatId = payload.message.chat.id;
          const text = `Hi ${payload.message.from.first_name} ${
            payload.message.from.last_name
          } @${
            payload.message.from.username
          }\nyour request payload is<pre><code class="language-json">${JSON.stringify(
            payload,
            null,
            2,
          )}</code></pre>`;

          const url = `https://api.telegram.org/bot${env.API_KEY}/sendMessage?chat_id=${chatId}&text=${text}&parse_mode=HTML&reply_to_message_id=${payload.message.message_id}`;
          await fetch(url);
          await logger.info(
            `Received msg from @${
              payload.message.from.username
            }.\nPayload:<pre><code class="language-json">${JSON.stringify(
              payload,
              null,
              2,
            )}</code></pre>`,
          );
        }
      }
    }

    return new Response(new Date().toISOString()); // Doesn't really matter
  } catch (exception) {
    if (exception instanceof Error) {
      await logger.error(`${exception.stack}`, request);
    }

    return new Response('NOT OK'); // Doesn't really matter
  }
}
