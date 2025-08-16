import { calculateBuild, checkCompatibility, calculateTotalTdp } from '@/lib/calculations'
import { Component } from '@/types'

describe('Build Validation Tests', () => {
  const validComponents: Component[] = [
    {
      id: 1,
      name: 'AMD Ryzen 7 5800X',
      category_id: 1,
      price: 25000,
      specs: { cores: 8, frequency: '3.8GHz' },
      stock_quantity: 10,
      tdp: 105,
      fps_fortnite: 180,
      fps_gta5: 120,
      fps_warzone: 140,
      compatibility: { socket_type: 'AM4' }
    },
    {
      id: 2,
      name: 'MSI B550-A PRO',
      category_id: 2,
      price: 12000,
      specs: { socket: 'AM4', chipset: 'B550' },
      stock_quantity: 8,
      tdp: 0,
      fps_fortnite: 0,
      fps_gta5: 0,
      fps_warzone: 0,
      compatibility: { socket_type: 'AM4' }
    },
    {
      id: 3,
      name: 'NVIDIA RTX 4070',
      category_id: 3,
      price: 45000,
      specs: { memory: '12GB GDDR6X' },
      stock_quantity: 5,
      tdp: 200,
      fps_fortnite: 240,
      fps_gta5: 160,
      fps_warzone: 180,
      compatibility: { min_psu: 650 }
    }
  ]

  const incompatibleComponents: Component[] = [
    {
      id: 1,
      name: 'Intel i7-12700K',
      category_id: 1,
      price: 30000,
      specs: { cores: 12, frequency: '3.6GHz' },
      stock_quantity: 10,
      tdp: 125,
      fps_fortnite: 190,
      fps_gta5: 130,
      fps_warzone: 150,
      compatibility: { socket_type: 'LGA1700' }
    },
    {
      id: 2,
      name: 'MSI B550-A PRO',
      category_id: 2,
      price: 12000,
      specs: { socket: 'AM4', chipset: 'B550' },
      stock_quantity: 8,
      tdp: 0,
      fps_fortnite: 0,
      fps_gta5: 0,
      fps_warzone: 0,
      compatibility: { socket_type: 'AM4' }
    }
  ]

  describe('Valid Build Validation', () => {
    it('should validate a complete compatible build', () => {
      const build = calculateBuild(validComponents)
      
      expect(build.compatibilityIssues).toEqual([])
      expect(build.totalPrice).toBeGreaterThan(0)
      expect(build.totalTdp).toBeGreaterThan(0)
      expect(build.recommendedPsu).toBeGreaterThanOrEqual(550)
    })

    it('should calculate correct total price', () => {
      const build = calculateBuild(validComponents)
      const expectedPrice = 25000 + 12000 + 45000
      
      expect(build.totalPrice).toBe(expectedPrice)
    })

    it('should calculate correct total TDP', () => {
      const build = calculateBuild(validComponents)
      const expectedTdp = 105 + 0 + 200
      
      expect(build.totalTdp).toBe(expectedTdp)
    })

    it('should recommend appropriate PSU wattage', () => {
      const build = calculateBuild(validComponents)
      const totalTdp = 305
      const expectedPsu = Math.ceil((totalTdp + 200) * 1.2)
      
      expect(build.recommendedPsu).toBeGreaterThanOrEqual(expectedPsu)
    })

    it('should provide FPS estimates', () => {
      const build = calculateBuild(validComponents)
      
      expect(build.fpsData.fortnite).toBeGreaterThan(0)
      expect(build.fpsData.gta5).toBeGreaterThan(0)
      expect(build.fpsData.warzone).toBeGreaterThan(0)
    })
  })

  describe('Incompatible Build Validation', () => {
    it('should detect socket incompatibility', () => {
      const issues = checkCompatibility(incompatibleComponents)
      
      expect(issues.length).toBeGreaterThan(0)
      expect(issues[0]).toContain('Несовместимость')
      expect(issues[0]).toContain('LGA1700')
      expect(issues[0]).toContain('AM4')
    })

    it('should include compatibility issues in build calculation', () => {
      const build = calculateBuild(incompatibleComponents)
      
      expect(build.compatibilityIssues.length).toBeGreaterThan(0)
      expect(build.compatibilityIssues[0]).toContain('Несовместимость')
    })
  })

  describe('Edge Cases Validation', () => {
    it('should handle empty components array', () => {
      const build = calculateBuild([])
      
      expect(build.totalPrice).toBe(0)
      expect(build.totalTdp).toBe(0)
      expect(build.compatibilityIssues).toEqual([])
      expect(build.warnings).toEqual([])
    })

    it('should handle single component', () => {
      const singleComponent = [validComponents[0]]
      const build = calculateBuild(singleComponent)
      
      expect(build.totalPrice).toBe(25000)
      expect(build.totalTdp).toBe(105)
      expect(build.fpsData.fortnite).toBe(0) // No GPU
    })

    it('should handle components with zero values', () => {
      const zeroComponents: Component[] = [
        {
          id: 1,
          name: 'Test Component',
          category_id: 1,
          price: 0,
          specs: {},
          stock_quantity: 0,
          tdp: 0,
          fps_fortnite: 0,
          fps_gta5: 0,
          fps_warzone: 0,
          compatibility: 'test'
        }
      ]
      
      const build = calculateBuild(zeroComponents)
      
      expect(build.totalPrice).toBe(0)
      expect(build.totalTdp).toBe(0)
      expect(build.fpsData.fortnite).toBe(0)
    })

    it('should handle very high TDP values', () => {
      const highTdpComponent: Component = {
        ...validComponents[0],
        tdp: 1000
      }
      
      const build = calculateBuild([highTdpComponent])
      
      expect(build.totalTdp).toBe(1000)
      expect(build.recommendedPsu).toBeGreaterThan(1000)
    })

    it('should handle very high prices', () => {
      const expensiveComponent: Component = {
        ...validComponents[0],
        price: 1000000
      }
      
      const build = calculateBuild([expensiveComponent])
      
      expect(build.totalPrice).toBe(1000000)
    })
  })

  describe('Type Safety Validation', () => {
    it('should handle string compatibility', () => {
      const stringCompatComponent: Component = {
        ...validComponents[0],
        compatibility: 'Compatible with AM4'
      }
      
      const build = calculateBuild([stringCompatComponent])
      
      expect(build.compatibilityIssues).toEqual([])
    })

    it('should handle object compatibility', () => {
      const objectCompatComponent: Component = {
        ...validComponents[0],
        compatibility: { socket_type: 'AM4', requires_atx: true }
      }
      
      const build = calculateBuild([objectCompatComponent])
      
      expect(build.compatibilityIssues).toEqual([])
    })

    it('should handle null compatibility', () => {
      const nullCompatComponent: Component = {
        ...validComponents[0],
        compatibility: null as any
      }
      
      const build = calculateBuild([nullCompatComponent])
      
      expect(build.compatibilityIssues).toEqual([])
    })
  })

  describe('Performance Validation', () => {
    it('should validate FPS calculations are reasonable', () => {
      const build = calculateBuild(validComponents)
      
      // FPS should be within reasonable bounds
      expect(build.fpsData.fortnite).toBeLessThanOrEqual(300)
      expect(build.fpsData.gta5).toBeLessThanOrEqual(200)
      expect(build.fpsData.warzone).toBeLessThanOrEqual(200)
      
      // FPS should be positive or zero
      expect(build.fpsData.fortnite).toBeGreaterThanOrEqual(0)
      expect(build.fpsData.gta5).toBeGreaterThanOrEqual(0)
      expect(build.fpsData.warzone).toBeGreaterThanOrEqual(0)
    })

    it('should validate TDP calculations are reasonable', () => {
      const build = calculateBuild(validComponents)
      
      // TDP should be reasonable for a PC build
      expect(build.totalTdp).toBeLessThanOrEqual(1000)
      expect(build.totalTdp).toBeGreaterThanOrEqual(0)
    })

    it('should validate PSU recommendations are reasonable', () => {
      const build = calculateBuild(validComponents)
      
      // PSU should be reasonable for a PC build
      expect(build.recommendedPsu).toBeLessThanOrEqual(2000)
      expect(build.recommendedPsu).toBeGreaterThanOrEqual(550)
    })
  })

  describe('Data Integrity Validation', () => {
    it('should preserve component data integrity', () => {
      const originalComponents = JSON.parse(JSON.stringify(validComponents))
      const build = calculateBuild(validComponents)
      
      // Original components should not be modified
      expect(validComponents).toEqual(originalComponents)
    })

    it('should handle missing optional properties', () => {
      const minimalComponent: Component = {
        id: 1,
        name: 'Minimal Component',
        category_id: 1,
        price: 1000,
        specs: {},
        stock_quantity: 1,
        tdp: 50,
        fps_fortnite: 60,
        fps_gta5: 45,
        fps_warzone: 50,
        compatibility: 'test'
      }
      
      const build = calculateBuild([minimalComponent])
      
      expect(build.totalPrice).toBe(1000)
      expect(build.totalTdp).toBe(50)
    })

    it('should validate all required properties are present', () => {
      const requiredProps = ['id', 'name', 'category_id', 'price', 'specs', 'stock_quantity', 'tdp', 'fps_fortnite', 'fps_gta5', 'fps_warzone', 'compatibility']
      
      validComponents.forEach(component => {
        requiredProps.forEach(prop => {
          expect(component).toHaveProperty(prop)
        })
      })
    })
  })
})


