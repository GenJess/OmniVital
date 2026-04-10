#!/usr/bin/env python3
"""
Backend API Testing for OmniVital
Tests the FastAPI backend endpoints using the production URL
"""

import requests
import json
import sys
from datetime import datetime
import uuid

# Use the production backend URL from frontend/.env
BACKEND_URL = "https://white-wellness.preview.emergentagent.com/api"

def test_root_endpoint():
    """Test the root API endpoint"""
    print("Testing GET /api/ endpoint...")
    try:
        response = requests.get(f"{BACKEND_URL}/", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Hello World":
                print("✅ Root endpoint working correctly")
                return True
            else:
                print("❌ Root endpoint returned unexpected message")
                return False
        else:
            print(f"❌ Root endpoint failed with status {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Root endpoint request failed: {e}")
        return False

def test_get_status_endpoint():
    """Test the GET /api/status endpoint"""
    print("\nTesting GET /api/status endpoint...")
    try:
        response = requests.get(f"{BACKEND_URL}/status", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data}")
            print("✅ GET /api/status endpoint working correctly")
            return True, data
        else:
            print(f"❌ GET /api/status failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ GET /api/status request failed: {e}")
        return False, None

def test_post_status_endpoint():
    """Test the POST /api/status endpoint"""
    print("\nTesting POST /api/status endpoint...")
    
    test_data = {
        "client_name": "OmniVital_Test_Client"
    }
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/status", 
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data}")
            
            # Validate response structure
            required_fields = ["id", "client_name", "timestamp"]
            if all(field in data for field in required_fields):
                if data["client_name"] == test_data["client_name"]:
                    print("✅ POST /api/status endpoint working correctly")
                    return True, data
                else:
                    print("❌ POST /api/status returned incorrect client_name")
                    return False, None
            else:
                print("❌ POST /api/status response missing required fields")
                return False, None
        else:
            print(f"❌ POST /api/status failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ POST /api/status request failed: {e}")
        return False, None

def test_backend_connectivity():
    """Test basic connectivity to the backend"""
    print("Testing backend connectivity...")
    try:
        response = requests.get(BACKEND_URL, timeout=5)
        print(f"Backend connectivity test - Status: {response.status_code}")
        return response.status_code < 500
    except requests.exceptions.RequestException as e:
        print(f"❌ Backend connectivity failed: {e}")
        return False

def run_all_tests():
    """Run all backend tests"""
    print("=" * 60)
    print("OmniVital Backend API Testing")
    print(f"Backend URL: {BACKEND_URL}")
    print("=" * 60)
    
    results = {
        "connectivity": False,
        "root_endpoint": False,
        "get_status": False,
        "post_status": False
    }
    
    # Test connectivity first
    results["connectivity"] = test_backend_connectivity()
    if not results["connectivity"]:
        print("\n❌ Backend connectivity failed. Cannot proceed with API tests.")
        return results
    
    # Test individual endpoints
    results["root_endpoint"] = test_root_endpoint()
    results["get_status"], _ = test_get_status_endpoint()
    results["post_status"], _ = test_post_status_endpoint()
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    total_tests = len(results)
    passed_tests = sum(results.values())
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
    
    print(f"\nOverall: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print("🎉 All backend tests passed!")
    else:
        print("⚠️  Some backend tests failed. Check logs above for details.")
    
    return results

if __name__ == "__main__":
    results = run_all_tests()
    
    # Exit with error code if any tests failed
    if not all(results.values()):
        sys.exit(1)
    else:
        sys.exit(0)