/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/object-curly-spacing */
/* eslint-disable @typescript-eslint/naming-convention */

type Env = {
  [key: string]: string;
  KV: KVNamespace;
};

export default class Logger {
  #API_KEY;
  #CHAT_ID;

  constructor(env: Env) {
    this.#API_KEY = env.API_KEY;
    this.#CHAT_ID = env.TELEGRAM_LOG_CHAT_ID;
  }

  async #log2telegram(msg: string, disable_notification = true) {
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
