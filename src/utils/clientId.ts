const URLS_BY_NODE_ENV = {
  'development' : 'oAQYkbAc4qdkYHDEDjN1RSbKyXXL2KtRaWWnJ8kp',
  'production' : '8RRcNQNSqH2AUPsz6WGqCIqTgy0sBPQJnLzdhNju',
  'test' : '1234',
};

export function clientId() {
  return URLS_BY_NODE_ENV[process.env.NODE_ENV];
}
