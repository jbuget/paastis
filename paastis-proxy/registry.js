class ManagedApplication {

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

  registerApp(appName, appRegion) {
    let managedApp = this._runningApps.get(appName);
    if (!managedApp) {
      managedApp = new ManagedApplication(appName, appRegion);
      this._runningApps.set(appName, managedApp);
      console.debug(`Registered "${appName}"`);
    }
  }

  getApp(appName) {
    return this._runningApps.get(appName);
  }

  removeApp(appName) {
    if (this.isRegisteredApp(appName)) {
      this._runningApps.delete(appName);
      console.debug(`Unregistered "${appName}"`);
    }
  }

  isRegisteredApp(appName) {
    return this._runningApps.has(appName);
  }

  listApps() {
    return Array.from(this._runningApps.values());
  }
}

const registry = new RunningAppsRegistry();

export default registry;
