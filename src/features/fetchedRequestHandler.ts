import Logger from '../infras/logger';
import { EnvironmentVariables } from '../types/worker'

export default async function handler(
  logger: Logger, 
  request: Request, 
  env: EnvironmentVariables
) {
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
