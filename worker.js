export default {
  // This is the webhook entry point
  async fetch(request, env) {
    return await handleRequest(request, env)
  }
}

async function errorLog(msg, request, env){
  await log2telegram(`<pre><b><code>ERROR LOG</code></b></pre>${msg}\nRequest:<pre><code class="language-json">${JSON.stringify(request, null, 2)}</code></pre>`, env, 'false')
}

async function infoLog(msg, payload, env){
  await log2telegram(`${msg}\nPayload:<pre><code class="language-json">${JSON.stringify(payload, null, 2)}</code></pre>`, env)
}

async function log2telegram(msg, env, disable_notification='True', chat_id = ''){
  const logUrl = `https://api.telegram.org/bot${env.API_KEY}/sendMessage?chat_id=${chat_id || env.TELEGRAM_LOG_CHAT_ID}&parse_mode=HTML&text=${msg}&protect_content=true&disable_notification=${disable_notification}`
  fetch(logUrl)
}

async function handleRequest(request, env) {
  try{
    if (request.method === "POST") {
      const payload = await request.json()
      if (payload?.message?.from && !payload.message.from.is_bot) { 
        const chatId = payload.message.chat.id
        const kvKey = `conversation-with-${payload.message.from.username}`;
        const text = `Hi ${payload.message.from.first_name} ${payload.message.from.last_name} @${payload.message.from.username}\nyour request payload is<pre><code class="language-json">${JSON.stringify(payload, null, 2)}</code></pre>`
        
        const url = `https://api.telegram.org/bot${env.API_KEY}/sendMessage?chat_id=${chatId}&text=${text}&parse_mode=HTML&reply_to_message_id=${payload.message.message_id}`
        await fetch(url)
        
        const past = await env.KV.get(kvKey, { type: "json" })
        const kvValue = {...past}
        kvValue[payload.message.date] = payload.message.text
        await env.KV.put(kvKey, JSON.stringify(kvValue))
        await infoLog(`Received msg from @${payload.message.from.username}.`, payload, env)
      }
    }
    return new Response("OK") // Doesn't really matter
  }catch(exception){
    await errorLog(`${exception.stack}`, request, env)
    return new Response("NOT OK") // Doesn't really matter
  }
}
