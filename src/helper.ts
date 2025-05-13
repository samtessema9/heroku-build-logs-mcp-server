const HEROKU_API_BASE_URL_STAGING = "https://api.staging.herokudev.com/apps/";
const HEROKU_API_BASE_URL_PRODUCTION = "https://api.heroku.com/apps/";
const LIST_BUILDS_PATH = "/builds";

export type HerokuEnv = "staging" | "production";

export function getHerokuAuthToken(env: HerokuEnv): string {
  const token = env === "staging"
    ? process.env.HEROKU_AUTH_TOKEN_STAGING
    : process.env.HEROKU_AUTH_TOKEN_PRODUCTION;
  if (!token) throw new Error(`HEROKU_AUTH_TOKEN_${env.toUpperCase()} env var not set`);
  return token;
}

export async function fetchBuilds(appName: string, env: HerokuEnv) {
  const baseUrl = env === "staging" ? HEROKU_API_BASE_URL_STAGING : HEROKU_API_BASE_URL_PRODUCTION;
  const url = `${baseUrl}${appName}${LIST_BUILDS_PATH}`;
  
  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${getHerokuAuthToken(env)}`,
      "Accept": "application/vnd.heroku+json; version=3",
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch builds: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function fetchBuildLogs(outputStreamUrl: string) {
  const res = await fetch(outputStreamUrl);
  if (!res.ok) throw new Error(`Failed to fetch build logs: ${res.status} ${await res.text()}`);
  return res.text();
} 