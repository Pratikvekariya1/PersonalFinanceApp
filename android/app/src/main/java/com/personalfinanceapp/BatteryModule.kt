package com.personalfinanceapp

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.BroadcastReceiver
import android.os.BatteryManager
import android.os.PowerManager
import android.provider.Settings
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class BatteryModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var batteryReceiver: BroadcastReceiver? = null
    private val powerManager: PowerManager = reactContext.getSystemService(Context.POWER_SERVICE) as PowerManager

    override fun getName(): String {
        return "BatteryModule"
    }

    @ReactMethod
    fun getBatteryOptimizationStatus(promise: Promise) {
        try {
            val packageName = reactApplicationContext.packageName
            val isIgnoringOptimizations = powerManager.isIgnoringBatteryOptimizations(packageName)
            
            val batteryManager = reactApplicationContext.getSystemService(Context.BATTERY_SERVICE) as BatteryManager
            val batteryLevel = batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
            
            val result = Arguments.createMap().apply {
                putBoolean("isIgnoringOptimizations", isIgnoringOptimizations)
                putInt("batteryLevel", batteryLevel)
                putString("packageName", packageName)
            }
            
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("BATTERY_ERROR", "Failed to get battery optimization status", e)
        }
    }

    @ReactMethod
    fun requestBatteryOptimizationExemption(promise: Promise) {
        try {
            val packageName = reactApplicationContext.packageName
            
            if (!powerManager.isIgnoringBatteryOptimizations(packageName)) {
                val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                    data = android.net.Uri.parse("package:$packageName")
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                }
                
                reactApplicationContext.startActivity(intent)
                promise.resolve("Battery optimization exemption requested")
            } else {
                promise.resolve("Already exempt from battery optimization")
            }
        } catch (e: Exception) {
            promise.reject("BATTERY_ERROR", "Failed to request battery optimization exemption", e)
        }
    }

    @ReactMethod
    fun startBatteryMonitoring(promise: Promise) {
        try {
            if (batteryReceiver != null) {
                promise.resolve("Battery monitoring already started")
                return
            }

            batteryReceiver = object : BroadcastReceiver() {
                override fun onReceive(context: Context?, intent: Intent?) {
                    when (intent?.action) {
                        Intent.ACTION_BATTERY_LOW -> {
                            sendBatteryEvent("BATTERY_LOW", "Battery is running low")
                        }
                        Intent.ACTION_BATTERY_OKAY -> {
                            sendBatteryEvent("BATTERY_OKAY", "Battery level is okay")
                        }
                        Intent.ACTION_POWER_CONNECTED -> {
                            sendBatteryEvent("POWER_CONNECTED", "Device is charging")
                        }
                        Intent.ACTION_POWER_DISCONNECTED -> {
                            sendBatteryEvent("POWER_DISCONNECTED", "Device is not charging")
                        }
                        Intent.ACTION_BATTERY_CHANGED -> {
                            val level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
                            val scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1)
                            val batteryPct = (level * 100) / scale
                            
                            sendBatteryEvent("BATTERY_CHANGED", "Battery level: $batteryPct%", batteryPct)
                        }
                    }
                }
            }

            val intentFilter = IntentFilter().apply {
                addAction(Intent.ACTION_BATTERY_LOW)
                addAction(Intent.ACTION_BATTERY_OKAY)
                addAction(Intent.ACTION_POWER_CONNECTED)
                addAction(Intent.ACTION_POWER_DISCONNECTED)
                addAction(Intent.ACTION_BATTERY_CHANGED)
            }

            reactApplicationContext.registerReceiver(batteryReceiver, intentFilter)
            promise.resolve("Battery monitoring started")
            
        } catch (e: Exception) {
            promise.reject("BATTERY_ERROR", "Failed to start battery monitoring", e)
        }
    }

    @ReactMethod
    fun stopBatteryMonitoring(promise: Promise) {
        try {
            batteryReceiver?.let {
                reactApplicationContext.unregisterReceiver(it)
                batteryReceiver = null
            }
            promise.resolve("Battery monitoring stopped")
        } catch (e: Exception) {
            promise.reject("BATTERY_ERROR", "Failed to stop battery monitoring", e)
        }
    }

    private fun sendBatteryEvent(eventName: String, message: String, batteryLevel: Int? = null) {
        val params = Arguments.createMap().apply {
            putString("message", message)
            putString("timestamp", System.currentTimeMillis().toString())
            batteryLevel?.let { putInt("batteryLevel", it) }
        }

        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        try {
            batteryReceiver?.let {
                reactApplicationContext.unregisterReceiver(it)
            }
        } catch (e: Exception) {
            // Handle cleanup error
        }
    }
}
