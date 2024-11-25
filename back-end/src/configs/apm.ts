// Add this to the very top of the first file loaded in your app
const apm = require('elastic-apm-node');

apm.start({
  serviceName: process.env.APM_SERVICE_NAME,
  secretToken: process.env.APM_SECRET_TOKEN,
  serverUrl: process.env.APM_SERVER_URL,
  environment: process.env.APM_ENV,
});

export { apm };
