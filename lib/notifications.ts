'use client'

export type NotificationPermissionStatus = 'default' | 'granted' | 'denied' | 'unsupported'

/**
 * Checks if the Web Notification API is supported by the user's browser.
 */
export function isBrowserNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

/**
 * Gets current notification permission status.
 */
export function getNotificationPermission(): NotificationPermissionStatus {
  if (!isBrowserNotificationSupported()) {
    return 'unsupported'
  }
  return Notification.permission
}

/**
 * Requests browser notification permission.
 */
export async function requestBrowserNotificationPermission(): Promise<NotificationPermissionStatus> {
  if (!isBrowserNotificationSupported()) {
    return 'unsupported'
  }

  try {
    const permission = await Notification.requestPermission()
    return permission
  } catch (err) {
    console.error('Error requesting notification permission:', err)
    return 'denied'
  }
}

/**
 * Displays a desktop browser notification if granted.
 */
export function showBrowserNotification(title: string, options?: NotificationOptions): boolean {
  if (!isBrowserNotificationSupported() || Notification.permission !== 'granted') {
    return false
  }

  try {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    })
    return true
  } catch (err) {
    console.error('Error showing browser notification:', err)
    return false
  }
}
