const URLS_BY_NODE_ENV = {
  'development' : 'http://localhost:3000/',
  'production' : 'https://ogs-voice-client.surge.sh/',
  'test' : 'https://example.com/',
};

export function redirectUri() {
  return URLS_BY_NODE_ENV[process.env.NODE_ENV];
}
