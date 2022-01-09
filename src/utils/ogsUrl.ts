const URLS_BY_NODE_ENV = {
  'development' : 'https://beta.online-go.com',
  'production' : 'https://online-go.com',
  'test' : 'https://example.com',
};

export function ogsUrl() {
  return URLS_BY_NODE_ENV[process.env.NODE_ENV];
}
