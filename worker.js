export default {
  async scheduled(event, env, ctx) {
    const now = (new Date()).toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong' });
    const photo = `https://www.hko.gov.hk/wxinfo/aws/hko_mica/ic2/latest_HD_IC2.jpg?v=${event.scheduledTime}`;
    const url = `https://api.telegram.org/bot${env.API_KEY}/sendPhoto?chat_id=${env.TELEGRAM_LOG_CHAT_ID}&photo=${photo}&caption=CRON: \`${event.cron}\`\nFrom: [${now}](${photo})&parse_mode=MarkdownV2&disable_notification=true`;
    await fetch(url);
  },
  async fetch(request, env) {
    return await handleRequest(request, env);
  }
}

class Logger {
  #API_KEY;
  #CHAT_ID;

  constructor(env) {
    this.#API_KEY = env.API_KEY;
    this.#CHAT_ID = env.TELEGRAM_LOG_CHAT_ID;
  }

  async #log2telegram(msg, disable_notification = true) {
    if (this.#CHAT_ID) {
      const logUrl = `https://api.telegram.org/bot${this.#API_KEY}/sendMessage?chat_id=${this.#CHAT_ID}&parse_mode=HTML&text=${msg}&protect_content=true&disable_notification=${disable_notification ? 'true' : 'false'}`;
      await fetch(logUrl);
    }
  }

  async error(msg, request) {
    await this.#log2telegram(`<pre><b><code>ERROR LOG</code></b></pre>${msg}\nRequest:<pre><code class="language-json">${JSON.stringify(request, null, 2)}</code></pre>`, false);
  }

  async info(msg) {
    await this.#log2telegram(msg);
  }
}

async function handleRequest(request, env) {
  const logger = new Logger(env);
  try {
    if (request.method === "POST") {
      const payload = await request.json();
      if (payload?.message?.from && !payload.message.from.is_bot) {
        const kvKey = `conversation-with-${payload.message.from.username}`;
        const past = await env.KV.get(kvKey, { type: "json" });
        const kvValue = { ...past };
        kvValue[payload.message.date] = kvValue.hasOwnProperty(payload.message.date)
          ? [...kvValue[payload.message.date], payload.message.text]
          : kvValue[payload.message.date] = [payload.message.text];
        await env.KV.put(kvKey, JSON.stringify(kvValue));

        if (!payload.message.from.is_bot) {
          const chatId = payload.message.chat.id;
          const text = `Hi ${payload.message.from.first_name} ${payload.message.from.last_name} @${payload.message.from.username}\nyour request payload is<pre><code class="language-json">${JSON.stringify(payload, null, 2)}</code></pre>`;

          const url = `https://api.telegram.org/bot${env.API_KEY}/sendMessage?chat_id=${chatId}&text=${text}&parse_mode=HTML&reply_to_message_id=${payload.message.message_id}`;
          await fetch(url);
          await logger.info(`Received msg from @${payload.message.from.username}.\nPayload:<pre><code class="language-json">${JSON.stringify(payload, null, 2)}</code></pre>`);
        }
      }
    }
    return new Response("OK") // Doesn't really matter
  } catch (exception) {
    await logger.error(`${exception.stack}`, request)
    return new Response("NOT OK") // Doesn't really matter
  }
}
