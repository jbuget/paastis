class Application {

  constructor(name, region, startedAt, lastAccessedAt) {
    const now = new Date();
    this._name = name;
    this._region = region;
    this._startedAt = startedAt || now;
    this._lastAccessedAt = lastAccessedAt || now;
  }

  get name() {
    return this._name;
  }

  get region() {
    return this._region;
  }

  updateLastAccessedAt(lastAccessedAt) {
    this._lastAccessedAt = lastAccessedAt || new Date();
  }

  get lastAccessedAt() {
    return this._lastAccessedAt;
  }
}

class RunningAppsRegistry {

  constructor() {
    this._runningApps = new Map(); // [app_name<String>, app<Application>]
  }

  setApp(appName) {
    let app = this._runningApps.get(appName);
    if (!app) {
      app = new Application(appName);
      this._runningApps.add(appName, app);
      console.debug(`Registered "${appName}"`);
    } else {
      app.updateLastAccessedAt();
      console.debug(`Updated "${appName}"`);
    }
  }

  getApp(appName) {
    return this._runningApps.get(appName);
  }

  removeApp(appName) {
    this._runningApps.delete(appName);
    console.debug(`Unregistered "${appName}"`);
  }

  isRunningApp(appName) {
    return this._runningApps.has(appName);
  }

  findApps() {
    return this._runningApps;
  }

  listApps() {
    this._runningApps.forEach((app) => console.log(app));
  }

}

const registry = new RunningAppsRegistry();

export default registry;
