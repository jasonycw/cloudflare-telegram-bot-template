# Cloudflare Serverless Telegram bot

**![](https://s2.googleusercontent.com/s2/favicons?domain_url=developers.cloudflare.com) Cloudflare** provides free serverless function hosting, calls [`workers`](https://developers.cloudflare.com/workers/), and public accessible URL that can trigger the function very quickly ([according to their doc, the startup time is just 200ms](https://developers.cloudflare.com/workers/platform/limits#account-plan-limits)). Only limitation are the [runtime, rate limit](https://developers.cloudflare.com/workers/platform/limits#worker-limits) and [request size](https://developers.cloudflare.com/workers/platform/limits#request-limits)

But this still makes it one of the good options to host a small Telegram bot for FREE!

<img width="151" alt="image" src="https://user-images.githubusercontent.com/4518597/232227364-04d45bce-c399-47aa-ab21-d2ceaa8193ed.png">


# Prerequisie

1. Use [@BotFather](https://t.me/BotFather) to create your own bot and have the API key available

   <img alt="BotFather" src="https://user-images.githubusercontent.com/4518597/228850224-f7c66aac-47b9-472c-94c5-1b690a1b8a7c.png">
   
2. Created an account on [Cloudflare](dash.cloudflare.com) and have created a worker and a KV

   <img alt="worker" src="https://user-images.githubusercontent.com/4518597/228850967-e85bba97-a8bc-4290-b9d0-1cd6868f4bb2.png">
   
   <img alt="KV" src="https://user-images.githubusercontent.com/4518597/228852192-8e9e9167-3d55-4e1c-b032-3a98f62882a5.png">
   
3. [Optional] Use [@getidsbot](https://t.me/getidsbot) or [@RawDataBot](https://t.me/RawDataBot) or other means to get a `chat_id` for logging

# How to use the code

1. Go to your Cloudflare worker, then go to `Settings` tab

2. Add Environment Variables, Telegram bot `API_KEY` and logging group's chat_id `TELEGRAM_LOG_CHAT_ID`(optional)

   And KV Namespace Bindings
   
   <img alt="settings" src="https://user-images.githubusercontent.com/4518597/228852866-fde9d590-ff42-413c-9675-fb6c38104a8d.png">
   
3. Quick edit the worker and copy [`worker.js`](https://github.com/jasonycw/cloudflare-telegram-bot-template/blob/master/worker.js) to the left panel

   <img alt="Quick edit" src="https://user-images.githubusercontent.com/4518597/228857719-37f5b898-8dcb-49e7-a86b-95c8203fdea1.png">
   
4. Save & deploy

   <img alt="Save and deploy" src="https://user-images.githubusercontent.com/4518597/228857895-9821b62c-720e-4737-b36a-a14e6392f943.png">

5. Call the following API `https://api.telegram.org/bot{YOUR TELEGRAM API KEY}/setWebhook?url={YOUR WORKER'S DOMAIN}`
   
   <img alt="webhook" src="https://user-images.githubusercontent.com/4518597/228856339-5f57c2a3-8ecf-4152-8e47-d55e05a56e63.png">

6. Done👍
