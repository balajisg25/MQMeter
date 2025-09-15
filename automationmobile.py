from appium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Perfecto Cloud details
cloud_name = "<your-cloud>.perfectomobile.com"
security_token = "<your-security-token>"

# Replace with your exact Perfecto device ID
specific_device_id = "R58M35XXXXY"   # example: Samsung Galaxy S21

# Desired capabilities for Play Store
desired_caps = {
    'platformName': 'Android',
    'deviceName': specific_device_id,   # Specific device ID
    'appPackage': 'com.android.vending',
    'appActivity': 'com.google.android.finsky.activities.MainActivity',
    'securityToken': security_token,
    'newCommandTimeout': 300            # keeps session alive longer
}

# Appium server URL (Perfecto)
url = f"https://{cloud_name}/nexperience/perfectomobile/wd/hub"

# Create driver session
driver = webdriver.Remote(url, desired_caps)

try:
    print(f"Play Store launched on device {specific_device_id} ✅")

    # Wait for search bar to appear
    wait = WebDriverWait(driver, 20)
    search_box = wait.until(
        EC.presence_of_element_located((By.XPATH, "//android.widget.EditText"))
    )
    search_box.send_keys("WhatsApp")
    driver.press_keycode(66)  # press Enter to search

finally:
    driver.quit()