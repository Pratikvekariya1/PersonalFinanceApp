module.exports = {
  android: {
    platformName: 'Android',
    'appium:deviceName': 'Android Emulator',
    'appium:platformVersion': '11.0',
    'appium:automationName': 'UiAutomator2',
    'appium:app': './android/app/build/outputs/apk/debug/app-debug.apk',
    'appium:newCommandTimeout': 300,
    'appium:connectHardwareKeyboard': true,
    'appium:unicodeKeyboard': true,
    'appium:resetKeyboard': true,
  },
  
  ios: {
    platformName: 'iOS',
    'appium:deviceName': 'iPhone 14',
    'appium:platformVersion': '16.0',
    'appium:automationName': 'XCUITest',
    'appium:app': './ios/build/Build/Products/Debug-iphonesimulator/PersonalFinanceApp.app',
    'appium:newCommandTimeout': 300,
    'appium:connectHardwareKeyboard': true,
  },
};
