package com.personalfinanceapp

import android.content.Context
import android.os.PowerManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import io.mockk.*
import org.junit.Before
import org.junit.Test
import org.junit.Assert.*

class BatteryModuleTest {

    private lateinit var batteryModule: BatteryModule
    private lateinit var mockContext: ReactApplicationContext
    private lateinit var mockPowerManager: PowerManager
    private lateinit var mockPromise: Promise

    @Before
    fun setUp() {
        mockContext = mockk(relaxed = true)
        mockPowerManager = mockk()
        mockPromise = mockk(relaxed = true)
        
        every { mockContext.getSystemService(Context.POWER_SERVICE) } returns mockPowerManager
        every { mockContext.packageName } returns "com.test.app"
        
        batteryModule = BatteryModule(mockContext)
    }

    @Test
    fun `getBatteryOptimizationStatus should return correct status`() {
        // Given
        every { mockPowerManager.isIgnoringBatteryOptimizations("com.test.app") } returns true

        // When
        batteryModule.getBatteryOptimizationStatus(mockPromise)

        // Then
        verify { mockPromise.resolve(any()) }
    }

    @Test
    fun `getBatteryOptimizationStatus should handle exceptions`() {
        // Given
        every { mockPowerManager.isIgnoringBatteryOptimizations(any()) } throws Exception("Test error")

        // When
        batteryModule.getBatteryOptimizationStatus(mockPromise)

        // Then
        verify { mockPromise.reject("BATTERY_ERROR", "Failed to get battery optimization status", any<Exception>()) }
    }

    @Test
    fun `startBatteryMonitoring should resolve with success message`() {
        // When
        batteryModule.startBatteryMonitoring(mockPromise)

        // Then
        verify { mockPromise.resolve("Battery monitoring started") }
    }
}
