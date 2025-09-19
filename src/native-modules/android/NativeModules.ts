import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

interface BatteryModuleInterface {
  getBatteryOptimizationStatus: () => Promise<{
    isIgnoringOptimizations: boolean;
    batteryLevel: number;
    packageName: string;
  }>;
  requestBatteryOptimizationExemption: () => Promise<string>;
  startBatteryMonitoring: () => Promise<string>;
  stopBatteryMonitoring: () => Promise<string>;
}

const BatteryModule: BatteryModuleInterface | null = Platform.OS === 'android' 
  ? NativeModules.BatteryModule 
  : null;

// Event emitters
const BatteryEventEmitter = Platform.OS === 'android' 
  ? new NativeEventEmitter(NativeModules.BatteryModule)
  : null;

export { BatteryModule, BatteryEventEmitter };

export const getBatteryStatus = async () => {
  if (Platform.OS === 'android' && BatteryModule) {
    try {
      return await BatteryModule.getBatteryOptimizationStatus();
    } catch (error) {
      console.error('Failed to get battery status:', error);
      throw error;
    }
  }
  throw new Error('Battery monitoring only available on Android');
};
