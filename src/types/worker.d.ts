type Event = {
  cron: string;
  type: string;
  scheduledTime: number;
};

type EnvironmentVariables = {
  [key: string]: string;
  KV: KVNamespace;
};

export {
    Event,
    EnvironmentVariables
};