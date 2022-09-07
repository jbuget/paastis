class Application {

  constructor(name, startedAt, lastAccessedAt) {
    const now = new Date();
    this._name = name;
    this._startedAt = startedAt || now;
    this._lastAccessedAt = lastAccessedAt || now;
  }

  updateLastAccessedAt(lastAccessedAt) {
    this._lastAccessedAt = lastAccessedAt || new Date();
  }

  get lastAccessedAt() {
    return this._lastAccessedAt;
  }
}

class RunningAppsRegister {

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
    this._runningApps.get(appName);
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

const register = new RunningAppsRegister();

export default register;
