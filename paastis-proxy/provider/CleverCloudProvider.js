import { PaasProvider } from "./PaasProvider.js";

export class CleverCloudProvider extends PaasProvider {

  constructor() {
    super();
  }

  async listAllApps() {

  }

  async getClient(region) {
    const API_HOST = 'https://api.clever-cloud.com'
    const tokens = {
      OAUTH_CONSUMER_KEY: 'your OAUTH_CONSUMER_KEY',
      OAUTH_CONSUMER_SECRET: 'your OAUTH_CONSUMER_SECRET',
      API_OAUTH_TOKEN: 'your API_OAUTH_TOKEN',
      API_OAUTH_TOKEN_SECRET: 'your API_OAUTH_TOKEN_SECRET',
    }
  }

  async isAppRunning(appId, region) {

  }
  async ensureAppIsRunning(appId, region) {

  }
  async startApp(appId, region) {

  }
  async stopApp(appId, region) {

  }
}
