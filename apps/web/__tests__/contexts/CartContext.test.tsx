import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from '@/contexts/CartContext'
import { Component } from '@/types'

const mockComponent: Component = {
  id: 1,
  name: 'Test Component',
  category_id: 1,
  price: 1000,
  specs: {},
  stock_quantity: 1,
  tdp: 50,
  fps_fortnite: 60,
  fps_gta5: 60,
  fps_warzone: 60,
  compatibility: {}
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>
    {children}
  </CartProvider>
)

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('provides initial cart state', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.state.itemCount).toBe(0)
    expect(result.current.state.totalPrice).toBe(0)
  })

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addItem(mockComponent)
    })

    expect(result.current.state.itemCount).toBe(1)
    expect(result.current.state.totalPrice).toBe(1000)
  })

  it('removes item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    // Add item first
    act(() => {
      result.current.addItem(mockComponent)
    })

    // Then remove it
    act(() => {
      result.current.removeItem(1)
    })

    expect(result.current.state.itemCount).toBe(0)
    expect(result.current.state.totalPrice).toBe(0)
  })

  it('clears cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    // Add item first
    act(() => {
      result.current.addItem(mockComponent)
    })

    // Then clear cart
    act(() => {
      result.current.clearCart()
    })

    expect(result.current.state.itemCount).toBe(0)
    expect(result.current.state.totalPrice).toBe(0)
  })
})
