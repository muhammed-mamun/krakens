package utils

import (
	"strings"
)

type UAInfo struct {
	Browser string
	Device  string
	OS      string
}

func ParseUserAgent(ua string) UAInfo {
	info := UAInfo{
		Browser: "Unknown",
		Device:  "Desktop",
		OS:      "Unknown",
	}

	ua = strings.ToLower(ua)

	// Browser detection
	if strings.Contains(ua, "chrome") && !strings.Contains(ua, "edg") {
		info.Browser = "Chrome"
	} else if strings.Contains(ua, "safari") && !strings.Contains(ua, "chrome") {
		info.Browser = "Safari"
	} else if strings.Contains(ua, "firefox") {
		info.Browser = "Firefox"
	} else if strings.Contains(ua, "edg") {
		info.Browser = "Edge"
	} else if strings.Contains(ua, "opera") || strings.Contains(ua, "opr") {
		info.Browser = "Opera"
	}

	// Device detection
	if strings.Contains(ua, "mobile") || strings.Contains(ua, "android") || strings.Contains(ua, "iphone") {
		info.Device = "Mobile"
	} else if strings.Contains(ua, "tablet") || strings.Contains(ua, "ipad") {
		info.Device = "Tablet"
	}

	// OS detection
	if strings.Contains(ua, "windows") {
		info.OS = "Windows"
	} else if strings.Contains(ua, "mac") {
		info.OS = "macOS"
	} else if strings.Contains(ua, "linux") {
		info.OS = "Linux"
	} else if strings.Contains(ua, "android") {
		info.OS = "Android"
	} else if strings.Contains(ua, "iphone") || strings.Contains(ua, "ipad") {
		info.OS = "iOS"
	}

	return info
}
