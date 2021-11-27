const urlsByNodeEnv = {
  'development' : 'https://beta.online-go.com',
  'production' : 'https://online-go.com',
  'test' : 'https://example.com',
};

export function ogsUrl() {
  return urlsByNodeEnv[process.env.NODE_ENV];
}
