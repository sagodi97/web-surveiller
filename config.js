const environments = {};

environments.staging = { port: 3000, envName: "staging" };

environments.production = { port: 5000, envName: "production" };

export default process.env.NODE_ENV &&
environments[process.env.NODE_ENV.toLowerCase()]
  ? environments[process.env.NODE_ENV.toLowerCase()]
  : environments.staging;
