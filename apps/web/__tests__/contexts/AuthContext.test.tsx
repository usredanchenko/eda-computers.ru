import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    {children}
  </AuthProvider>
)

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('provides initial auth state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.state.isAuthenticated).toBe(false)
    expect(result.current.state.user).toBe(null)
  })

  it('handles login', async () => {
    // Mock successful login response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
        token: 'test-token'
      })
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('test@example.com', 'password')
    })

    expect(result.current.state.isAuthenticated).toBe(true)
    expect(result.current.state.user?.name).toBe('Test User')
  })

  it('handles logout', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.logout()
    })

    expect(result.current.state.isAuthenticated).toBe(false)
    expect(result.current.state.user).toBe(null)
  })

  it('loads user from localStorage on mount', () => {
    // Set up localStorage with user data
    localStorage.setItem('auth_token', 'test-token')
    localStorage.setItem('auth_user', JSON.stringify({
      id: 1,
      name: 'Stored User',
      email: 'stored@example.com'
    }))

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.state.isAuthenticated).toBe(true)
    expect(result.current.state.user?.name).toBe('Stored User')
  })
})
