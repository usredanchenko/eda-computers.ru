import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ComponentCard from '@/components/ComponentCard'
import { Component } from '@/types'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'

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

const mockComponent: Component = {
  id: 1,
  name: 'AMD Ryzen 7 5800X',
  category_id: 1,
  price: 25000,
  specs: { 
    cores: 8, 
    frequency: '3.8GHz',
    socket: 'AM4'
  },
  stock_quantity: 10,
  image_url: 'https://picsum.photos/300/200',
  tdp: 105,
  fps_fortnite: 180,
  fps_gta5: 120,
  fps_warzone: 140,
  compatibility: { socket_type: 'AM4' }
}

const mockComponentWithStringCompatibility: Component = {
  ...mockComponent,
  id: 2,
  name: 'Test Component',
  compatibility: 'Compatible with AM4'
}

describe('ComponentCard', () => {
  const defaultProps = {
    component: mockComponent,
    isSelected: false,
    onSelect: jest.fn(),
    onAddToCart: jest.fn(),
    showFps: true,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders component information correctly', () => {
    renderWithProviders(<ComponentCard {...defaultProps} />)

    expect(screen.getByText('AMD Ryzen 7 5800X')).toBeInTheDocument()
    expect(screen.getByText('25 000 ₽')).toBeInTheDocument()
    expect(screen.getByText('TDP: 105W')).toBeInTheDocument()
    expect(screen.getByText('В наличии: 10')).toBeInTheDocument()
  })

  it('displays FPS information for gaming components', () => {
    // Create a GPU component for FPS testing
    const gpuComponent = {
      ...mockComponent,
      id: 3,
      name: 'NVIDIA RTX 4070',
      category_id: 3, // GPU category
      fps_fortnite: 240,
      fps_gta5: 160,
      fps_warzone: 180
    }
    
    renderWithProviders(<ComponentCard {...defaultProps} component={gpuComponent} />)

    // FPS information should be displayed for GPU components
    expect(screen.getByText('Fortnite:')).toBeInTheDocument()
    expect(screen.getByText('240')).toBeInTheDocument()
    expect(screen.getByText('GTA 5:')).toBeInTheDocument()
    expect(screen.getByText('160')).toBeInTheDocument()
    expect(screen.getByText('Warzone:')).toBeInTheDocument()
    expect(screen.getByText('180')).toBeInTheDocument()
  })

  it('displays specs information', () => {
    renderWithProviders(<ComponentCard {...defaultProps} />)

    expect(screen.getByText('Спецификации:')).toBeInTheDocument()
    expect(screen.getByText('cores:')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('frequency:')).toBeInTheDocument()
    expect(screen.getByText('3.8GHz')).toBeInTheDocument()
  })

  it('shows out of stock message when stock is 0', () => {
    const outOfStockComponent = { ...mockComponent, stock_quantity: 0 }
    renderWithProviders(<ComponentCard {...defaultProps} component={outOfStockComponent} />)

    expect(screen.getByText('Нет в наличии')).toBeInTheDocument()
  })

  it('calls onSelect when select button is clicked', () => {
    renderWithProviders(<ComponentCard {...defaultProps} />)

    const selectButton = screen.getByText('Выбрать')
    fireEvent.click(selectButton)

    expect(defaultProps.onSelect).toHaveBeenCalledWith(mockComponent)
  })

  it('calls onAddToCart when cart button is clicked', () => {
    renderWithProviders(<ComponentCard {...defaultProps} />)

    const cartButton = screen.getByText('🛒')
    fireEvent.click(cartButton)

    expect(defaultProps.onAddToCart).toHaveBeenCalled()
  })

  it('shows selected state when isSelected is true', () => {
    renderWithProviders(<ComponentCard {...defaultProps} isSelected={true} />)

    expect(screen.getByText('Выбрано')).toBeInTheDocument()
  })

  it('handles object compatibility correctly', () => {
    renderWithProviders(<ComponentCard {...defaultProps} />)

    // Should not crash when compatibility is an object
    expect(screen.getByText('AMD Ryzen 7 5800X')).toBeInTheDocument()
  })

  it('handles string compatibility correctly', () => {
    renderWithProviders(<ComponentCard {...defaultProps} component={mockComponentWithStringCompatibility} />)

    // Should not crash when compatibility is a string
    expect(screen.getByText('Test Component')).toBeInTheDocument()
  })

  it('displays compatibility warnings when present', () => {
    const componentWithWarnings = {
      ...mockComponent,
      compatibility: { 
        socket_type: 'AM4',
        requires_atx: true,
        min_psu: 650
      }
    }

    renderWithProviders(<ComponentCard {...defaultProps} component={componentWithWarnings} />)

    expect(screen.getByText('Требует корпус ATX')).toBeInTheDocument()
    expect(screen.getByText('Мин. БП: 650W')).toBeInTheDocument()
  })

  it('does not display compatibility section when no compatibility data', () => {
    const componentWithoutCompatibility = {
      ...mockComponent,
      compatibility: ''
    }

    renderWithProviders(<ComponentCard {...defaultProps} component={componentWithoutCompatibility} />)

    // Should not crash and should render normally
    expect(screen.getByText('AMD Ryzen 7 5800X')).toBeInTheDocument()
  })

  it('handles missing specs gracefully', () => {
    const componentWithoutSpecs = {
      ...mockComponent,
      specs: {}
    }

    renderWithProviders(<ComponentCard {...defaultProps} component={componentWithoutSpecs} />)

    expect(screen.getByText('AMD Ryzen 7 5800X')).toBeInTheDocument()
    expect(screen.getByText('Спецификации:')).toBeInTheDocument()
  })

  it('handles missing image_url gracefully', () => {
    const componentWithoutImage = {
      ...mockComponent,
      image_url: undefined
    }

    renderWithProviders(<ComponentCard {...defaultProps} component={componentWithoutImage} />)

    expect(screen.getByText('AMD Ryzen 7 5800X')).toBeInTheDocument()
  })

  it('displays correct price formatting', () => {
    const expensiveComponent = {
      ...mockComponent,
      price: 150000
    }

    renderWithProviders(<ComponentCard {...defaultProps} component={expensiveComponent} />)

    expect(screen.getByText('150 000 ₽')).toBeInTheDocument()
  })

  it('handles zero price correctly', () => {
    const freeComponent = {
      ...mockComponent,
      price: 0
    }

    renderWithProviders(<ComponentCard {...defaultProps} component={freeComponent} />)

    expect(screen.getByText('0 ₽')).toBeInTheDocument()
  })

  it('prevents event propagation on button clicks', () => {
    const mockEvent = {
      stopPropagation: jest.fn()
    }

    renderWithProviders(<ComponentCard {...defaultProps} />)

    const selectButton = screen.getByText('Выбрать')
    fireEvent.click(selectButton, mockEvent)

    // The component should handle the event properly
    expect(defaultProps.onSelect).toHaveBeenCalled()
  })

  it('renders with correct CSS classes for selected state', () => {
    renderWithProviders(<ComponentCard {...defaultProps} isSelected={true} />)

    const selectButton = screen.getByText('Выбрано')
    expect(selectButton).toHaveClass('bg-neon-cyan')
    expect(selectButton).toHaveClass('text-dark-950')
  })

  it('renders with correct CSS classes for unselected state', () => {
    renderWithProviders(<ComponentCard {...defaultProps} />)

    const selectButton = screen.getByText('Выбрать')
    expect(selectButton).toHaveClass('bg-dark-800')
    expect(selectButton).toHaveClass('text-white')
  })
})
