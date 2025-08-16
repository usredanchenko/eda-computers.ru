import { getRedirectPath, hasAccess } from '@/lib/authUtils'

describe('authUtils', () => {
  test('getRedirectPath by role', () => {
    expect(getRedirectPath(null, '/')).toBe('/')
    expect(getRedirectPath({ id: 1, email: 'a', name: 'n', role: 'ADMIN' } as any)).toBe('/admin')
    expect(getRedirectPath({ id: 2, email: 'u', name: 'u', role: 'USER' } as any)).toBe('/account')
  })

  test('hasAccess by role', () => {
    const admin = { id: 1, email: 'a', name: 'n', role: 'ADMIN' } as any
    const user = { id: 2, email: 'u', name: 'u', role: 'USER' } as any
    expect(hasAccess(null, 'ANY')).toBe(false)
    expect(hasAccess(admin, 'ADMIN')).toBe(true)
    expect(hasAccess(user, 'ADMIN')).toBe(false)
    expect(hasAccess(user, 'USER')).toBe(true)
    expect(hasAccess(admin, 'USER')).toBe(true)
  })
})


