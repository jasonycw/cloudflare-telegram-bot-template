import { EnvironmentVariables } from '../types/worker';

export default class Logger {
  #API_KEY;
  #CHAT_ID;

  constructor(env: EnvironmentVariables) {
    this.#API_KEY = env.API_KEY;
    this.#CHAT_ID = env.TELEGRAM_LOG_CHAT_ID;
  }

  async #log2telegram(msg: string, disable_notification: boolean = true) {
    if (this.#CHAT_ID) {
      const logUrl = `https://api.telegram.org/bot${
        this.#API_KEY
      }/sendMessage?chat_id=${
        this.#CHAT_ID
      }&parse_mode=HTML&text=${msg}&protect_content=true&disable_notification=${
        disable_notification ? 'true' : 'false'
      }`;
      await fetch(logUrl);
    }
  }

  async error(msg: string, request: Request) {
    await this.#log2telegram(
      `<pre><b><code>ERROR LOG</code></b></pre>${msg}\nRequest:<pre><code class="language-json">${JSON.stringify(
        request,
        null,
        2,
      )}</code></pre>`,
      false,
    );
  }

  async info(msg: string) {
    await this.#log2telegram(msg);
  }
}
