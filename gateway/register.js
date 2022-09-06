class RunningAppsRegister {

  constructor() {
    this._runningApps = new Set();
  }

  setApp(appName) {
    this._runningApps.add(appName);
    console.debug(`Registered "${appName}"`);
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

  listApps() {
    this._runningApps.forEach(console.log);
  }

}

const register = new RunningAppsRegister();

export default register;
