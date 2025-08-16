import { Component, Build, Order, Review } from '@/types'

describe('Type Definitions', () => {
  describe('Component Interface', () => {
    it('should have all required properties', () => {
      const component: Component = {
        id: 1,
        name: 'Test CPU',
        category_id: 1,
        price: 15000,
        specs: { cores: 8, frequency: '3.6GHz' },
        stock_quantity: 10,
        image_url: 'test.jpg',
        tdp: 65,
        fps_fortnite: 120,
        fps_gta5: 90,
        fps_warzone: 100,
        compatibility: { socket_type: 'AM4' }
      }

      expect(component.id).toBe(1)
      expect(component.name).toBe('Test CPU')
      expect(component.category_id).toBe(1)
      expect(component.price).toBe(15000)
      expect(component.specs).toEqual({ cores: 8, frequency: '3.6GHz' })
      expect(component.stock_quantity).toBe(10)
      expect(component.tdp).toBe(65)
      expect(component.fps_fortnite).toBe(120)
      expect(component.fps_gta5).toBe(90)
      expect(component.fps_warzone).toBe(100)
    })

    it('should handle string compatibility', () => {
      const component: Component = {
        id: 1,
        name: 'Test Component',
        category_id: 1,
        price: 1000,
        specs: {},
        stock_quantity: 5,
        tdp: 50,
        fps_fortnite: 60,
        fps_gta5: 45,
        fps_warzone: 50,
        compatibility: 'Compatible with AM4'
      }

      expect(typeof component.compatibility).toBe('string')
    })

    it('should handle object compatibility', () => {
      const component: Component = {
        id: 1,
        name: 'Test Component',
        category_id: 1,
        price: 1000,
        specs: {},
        stock_quantity: 5,
        tdp: 50,
        fps_fortnite: 60,
        fps_gta5: 45,
        fps_warzone: 50,
        compatibility: { socket_type: 'AM4', requires_atx: true }
      }

      expect(typeof component.compatibility).toBe('object')
      expect((component.compatibility as Record<string, any>).socket_type).toBe('AM4')
    })
  })

  describe('Build Interface', () => {
    it('should have all required properties', () => {
      const build: Build = {
        id: 1,
        name: 'Gaming Build',
        components: [],
        totalPrice: 50000,
        performance: 85,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      expect(build.id).toBe(1)
      expect(build.name).toBe('Gaming Build')
      expect(build.components).toEqual([])
      expect(build.totalPrice).toBe(50000)
      expect(build.performance).toBe(85)
    })
  })

  describe('Order Interface', () => {
    it('should have all required properties', () => {
      const order: Order = {
        id: 1,
        user_id: 1,
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        customer_phone: '+1234567890',
        status: 'pending',
        total_price: 50000,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        components: [],
        has_review: false
      }

      expect(order.id).toBe(1)
      expect(order.customer_name).toBe('John Doe')
      expect(order.status).toBe('pending')
      expect(order.total_price).toBe(50000)
      expect(order.has_review).toBe(false)
    })
  })

  describe('Review Interface', () => {
    it('should have all required properties', () => {
      const review: Review = {
        id: 1,
        user_id: 1,
        order_id: 1,
        rating: 5,
        text: 'Great service!',
        status: 'approved',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        order_total: 50000,
        admin_comment: null
      }

      expect(review.id).toBe(1)
      expect(review.rating).toBe(5)
      expect(review.text).toBe('Great service!')
      expect(review.status).toBe('approved')
      expect(review.order_total).toBe(50000)
    })
  })
})


