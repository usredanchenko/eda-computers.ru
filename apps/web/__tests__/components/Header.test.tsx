import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Header from '@/components/Header'
import { AuthProvider } from '@/hooks/useAuth'
import { CartProvider } from '@/hooks/useCart'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  },
}))

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      <CartProvider>
        {component}
      </CartProvider>
    </AuthProvider>
  )
}

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders logo and navigation', () => {
    renderWithProviders(<Header />)

    expect(screen.getByText('EDA')).toBeInTheDocument()
    expect(screen.getByText('Computers')).toBeInTheDocument()
    expect(screen.getAllByText('Главная')).toHaveLength(2) // Desktop and mobile
    expect(screen.getAllByText('Готовые сборки')).toHaveLength(2)
    expect(screen.getAllByText('О нас')).toHaveLength(2)
  })

  it('shows cart icon', () => {
    renderWithProviders(<Header />)

    expect(screen.getAllByText('🛒')).toHaveLength(2) // Desktop and mobile
  })

  it('shows login link when not authenticated', () => {
    renderWithProviders(<Header />)

    expect(screen.getByText('Личный кабинет')).toBeInTheDocument()
  })

  it('toggles mobile menu', () => {
    renderWithProviders(<Header />)

    const menuButton = screen.getByText('☰')
    fireEvent.click(menuButton)

    // Menu should be visible and button should change to X
    expect(screen.getByText('✕')).toBeInTheDocument()
  })
})
