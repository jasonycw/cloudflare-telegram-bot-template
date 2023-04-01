/* eslint-disable @typescript-eslint/object-curly-spacing */
/* eslint-disable @typescript-eslint/naming-convention */

type Event = {
  cron: string;
  type: string;
  scheduledTime: number;
};
type Env = {
  [key: string]: string;
  KV: KVNamespace;
};

export default async function scheduled(
  event: Event,
  env: Env,
  ctx: ExecutionContext,
) {
  // const logger = new Logger(env);
  const now = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Hong_Kong',
  });
  const photos = {
    'Victoria Peak (looking towards the north-northeast)':
      'https://www.hko.gov.hk/wxinfo/aws/hko_mica/vpb/latest_HD_VPB.jpg',
    'Central (Victoria Harbour)':
      'https://www.hko.gov.hk/wxinfo/aws/hko_mica/cp1/latest_HD_CP1.jpg',
    'International Commerce Centre (looking towards the southeast)':
      'https://www.hko.gov.hk/wxinfo/aws/hko_mica/ic1/latest_HD_IC1.jpg',
    'International Commerce Centre (looking towards the southwest)':
      'https://www.hko.gov.hk/wxinfo/aws/hko_mica/ic2/latest_HD_IC2.jpg',
    // 'Tsim Sha Tsui (looking towards the west)': `https://www.hko.gov.hk/wxinfo/aws/hko_mica/hk2/latest_HD_HK2.jpg`,
    // 'Sai Wan Ho (looking towards the east)': `https://www.hko.gov.hk/wxinfo/aws/hko_mica/swh/latest_HD_SWH.jpg`,
  };
  const inputMediaPhotos = Object.keys(photos).map((location: string) => ({
    type: 'photo',
    media: `${photos[location]}?v=${event.scheduledTime}`,
    caption: `${location}\n<pre>${now}</pre>`,
    parse_mode: 'HTML',
  }));
  const url = `https://api.telegram.org/bot${
    env.API_KEY
  }/sendMediaGroup?chat_id=${
    env.TELEGRAM_CRON_JOB_CHAT_ID
  }&media=${JSON.stringify(inputMediaPhotos)}&disable_notification=true`;
  console.log(222, url);
  const result = await fetch(url);
  console.log(333, result);
  // await logger.info(`Scheduled job from <code>${event.cron}</code> at ${now}.\n${photo}`);
}
