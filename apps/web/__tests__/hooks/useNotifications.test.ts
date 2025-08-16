import { renderHook, act } from '@testing-library/react'
import { useNotifications } from '@/hooks/useNotifications'

// Mock the hook to return actual implementation
jest.unmock('@/hooks/useNotifications')

describe('useNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('provides initial state', () => {
    const { result } = renderHook(() => useNotifications())

    expect(result.current.notifications).toEqual([])
    expect(typeof result.current.addNotification).toBe('function')
    expect(typeof result.current.removeNotification).toBe('function')
    expect(typeof result.current.clearNotifications).toBe('function')
  })

  it('adds notification', () => {
    const { result } = renderHook(() => useNotifications())

    act(() => {
      result.current.addNotification({
        type: 'success',
        title: 'Success',
        message: 'Operation completed'
      })
    })

    expect(result.current.notifications).toHaveLength(1)
    expect(result.current.notifications[0]).toMatchObject({
      type: 'success',
      title: 'Success',
      message: 'Operation completed'
    })
  })

  it('removes notification', () => {
    const { result } = renderHook(() => useNotifications())

    act(() => {
      result.current.addNotification({
        type: 'success',
        title: 'Success',
        message: 'Operation completed'
      })
    })

    const notificationId = result.current.notifications[0].id

    act(() => {
      result.current.removeNotification(notificationId)
    })

    expect(result.current.notifications).toHaveLength(0)
  })

  it('clears all notifications', () => {
    const { result } = renderHook(() => useNotifications())

    act(() => {
      result.current.addNotification({
        type: 'success',
        title: 'Success',
        message: 'Operation completed'
      })
      result.current.addNotification({
        type: 'error',
        title: 'Error',
        message: 'Something went wrong'
      })
    })

    expect(result.current.notifications).toHaveLength(2)

    act(() => {
      result.current.clearNotifications()
    })

    expect(result.current.notifications).toHaveLength(0)
  })

  it('auto-removes notification after duration', () => {
    jest.useFakeTimers()
    
    const { result } = renderHook(() => useNotifications())

    act(() => {
      result.current.addNotification({
        type: 'info',
        title: 'Info',
        message: 'Auto-removing notification',
        duration: 3000
      })
    })

    expect(result.current.notifications).toHaveLength(1)

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    expect(result.current.notifications).toHaveLength(0)

    jest.useRealTimers()
  })
})
