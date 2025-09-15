from appium import webdriver
from appium.webdriver.common.appiumby import AppiumBy
import time

# --- Step 1: Set Desired Capabilities ---
desired_caps = {
    "platformName": "Android",
    "deviceName": "YOUR_DEVICE_ID",              # Replace with your Perfecto device ID
    "securityToken": "YOUR_SECURITY_TOKEN",      # Replace with your Perfecto security token
    "automationName": "UiAutomator2",
    "noReset": True                              # Optional: prevents app data reset between sessions
}

# --- Step 2: Initialize Remote WebDriver Session ---
driver = webdriver.Remote(
    command_executor='https://YOUR_CLOUD_NAME.perfectomobile.com/nexperience/perfectomobile/wd/hub',  # Replace YOUR_CLOUD_NAME
    desired_capabilities=desired_caps
)

try:
    # Wait a few seconds for device to be ready
    time.sleep(5)

    # --- Step 3: Locate Play Store icon by accessibility description ---
    play_store_icon = driver.find_element(AppiumBy.ANDROID_UIAUTOMATOR, 'new UiSelector().description("Play Store")')

    # --- Step 4: Click the Play Store app icon ---
    play_store_icon.click()

    # --- Step 5: Wait for Play Store app to open (wait for search box or main UI element) ---
    time.sleep(10)  # Adjust as needed or replace with explicit waits

    print("Play Store launched successfully on Perfecto cloud device.")

finally:
    # --- Step 6: End the session ---
    driver.quit()