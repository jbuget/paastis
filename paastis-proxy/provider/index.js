import ScalingoProvider from "./ScalingoProvider.js";
import config from "../config.js";
import { CleverCloudProvider } from "./CleverCloudProvider.js";

const provider = (config.registry.type === 'clever-cloud') ? new CleverCloudProvider() : new ScalingoProvider();

export default provider;
