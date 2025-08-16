import {
  calculateTotalTdp,
  calculateRecommendedPsu,
  calculateFps,
  checkCompatibility,
  calculateBuild,
  getPerformanceLevel,
  formatPrice,
  getFpsColor,
  getRiskColor,
  FPS_TARGETS
} from '@/lib/calculations'
import { Component } from '@/types'

const mockComponents: Component[] = [
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
  },
  {
    id: 3,
    name: 'Corsair 750W',
    category_id: 6,
    price: 8000,
    specs: { wattage: 750 },
    stock_quantity: 15,
    tdp: 0,
    fps_fortnite: 0,
    fps_gta5: 0,
    fps_warzone: 0,
    compatibility: 'ATX'
  }
]

describe('Calculations Module', () => {
  describe('calculateTotalTdp', () => {
    it('should calculate total TDP correctly', () => {
      const totalTdp = calculateTotalTdp(mockComponents)
      expect(totalTdp).toBe(305) // 105 + 200 + 0
    })

    it('should return 0 for empty components array', () => {
      const totalTdp = calculateTotalTdp([])
      expect(totalTdp).toBe(0)
    })

    it('should handle components with zero TDP', () => {
      const components = [{ ...mockComponents[2] }]
      const totalTdp = calculateTotalTdp(components)
      expect(totalTdp).toBe(0)
    })
  })

  describe('calculateRecommendedPsu', () => {
    it('should calculate recommended PSU with 20% margin', () => {
      const totalTdp = 300
      const recommended = calculateRecommendedPsu(totalTdp)
      // (300 + 200) * 1.2 = 600, should round up to 650
      expect(recommended).toBe(650)
    })

    it('should handle low TDP values', () => {
      const totalTdp = 50
      const recommended = calculateRecommendedPsu(totalTdp)
      // (50 + 200) * 1.2 = 300, should round up to 550
      expect(recommended).toBe(550)
    })

    it('should handle high TDP values', () => {
      const totalTdp = 800
      const recommended = calculateRecommendedPsu(totalTdp)
      // (800 + 200) * 1.2 = 1200, should round up to 1200
      expect(recommended).toBe(1200)
    })
  })

  describe('calculateFps', () => {
    it('should calculate FPS based on CPU and GPU', () => {
      const cpu = mockComponents[0]
      const gpu = mockComponents[1]
      const fps = calculateFps([cpu, gpu])

      expect(fps.fortnite).toBeGreaterThan(0)
      expect(fps.gta5).toBeGreaterThan(0)
      expect(fps.warzone).toBeGreaterThan(0)
    })

    it('should return zero FPS when CPU or GPU is missing', () => {
      const fps = calculateFps([mockComponents[2]]) // Only PSU
      expect(fps.fortnite).toBe(0)
      expect(fps.gta5).toBe(0)
      expect(fps.warzone).toBe(0)
    })

    it('should apply CPU modifier correctly', () => {
      const cpu = { ...mockComponents[0], fps_fortnite: 200 }
      const gpu = { ...mockComponents[1], fps_fortnite: 240 }
      const fps = calculateFps([cpu, gpu])

      // Should be GPU FPS * CPU modifier (200/200 = 1.0)
      expect(fps.fortnite).toBe(240)
    })
  })

  describe('checkCompatibility', () => {
    it('should detect socket incompatibility', () => {
      const cpu = { ...mockComponents[0], compatibility: { socket_type: 'AM4' } }
      const mb = { ...mockComponents[1], category_id: 2, compatibility: { socket_type: 'LGA1200' } }
      
      const issues = checkCompatibility([cpu, mb])
      expect(issues.length).toBeGreaterThan(0)
      expect(issues[0]).toContain('Несовместимость')
    })

    it('should detect PSU insufficiency', () => {
      const gpu = { ...mockComponents[1], compatibility: { min_psu: 800 } }
      const psu = { ...mockComponents[2], specs: { wattage: 550 } }
      
      const issues = checkCompatibility([gpu, psu])
      expect(issues.length).toBeGreaterThan(0)
      expect(issues[0]).toContain('недостаточен')
    })

    it('should return empty array for compatible components', () => {
      const issues = checkCompatibility([mockComponents[0], mockComponents[1]])
      expect(issues).toEqual([])
    })
  })

  describe('calculateBuild', () => {
    it('should calculate complete build information', () => {
      const build = calculateBuild(mockComponents)

      expect(build.totalTdp).toBe(305)
      expect(build.recommendedPsu).toBe(650)
      expect(build.totalPrice).toBe(78000)
      expect(build.compatibilityIssues).toBeDefined()
      expect(build.warnings).toBeDefined()
      expect(build.fpsData).toBeDefined()
    })

    it('should handle empty components array', () => {
      const build = calculateBuild([])

      expect(build.totalTdp).toBe(0)
      expect(build.recommendedPsu).toBe(550)
      expect(build.totalPrice).toBe(0)
      expect(build.compatibilityIssues).toEqual([])
      expect(build.warnings).toEqual([])
    })
  })

  describe('getPerformanceLevel', () => {
    it('should return ultra for high FPS', () => {
      const fpsData = { fortnite: 200, gta5: 150, warzone: 180 }
      const level = getPerformanceLevel(fpsData)
      expect(level).toBe('ultra')
    })

    it('should return high for medium-high FPS', () => {
      const fpsData = { fortnite: 150, gta5: 100, warzone: 120 }
      const level = getPerformanceLevel(fpsData)
      expect(level).toBe('high')
    })

    it('should return medium for moderate FPS', () => {
      const fpsData = { fortnite: 80, gta5: 60, warzone: 70 }
      const level = getPerformanceLevel(fpsData)
      expect(level).toBe('medium')
    })

    it('should return low for low FPS', () => {
      const fpsData = { fortnite: 30, gta5: 25, warzone: 35 }
      const level = getPerformanceLevel(fpsData)
      expect(level).toBe('low')
    })
  })

  describe('formatPrice', () => {
    it('should format price in Russian rubles', () => {
      const formatted = formatPrice(50000)
      expect(formatted).toContain('₽')
      expect(formatted).toContain('50')
    })

    it('should handle zero price', () => {
      const formatted = formatPrice(0)
      expect(formatted).toContain('₽')
      expect(formatted).toContain('0')
    })

    it('should handle large numbers', () => {
      const formatted = formatPrice(1000000)
      expect(formatted).toContain('₽')
      expect(formatted).toContain('1')
    })
  })

  describe('getFpsColor', () => {
    it('should return green for FPS above target', () => {
      const color = getFpsColor(120, 100)
      expect(color).toBe('text-green-400')
    })

    it('should return yellow for FPS at 80% of target', () => {
      const color = getFpsColor(80, 100)
      expect(color).toBe('text-yellow-400')
    })

    it('should return red for FPS below 80% of target', () => {
      const color = getFpsColor(70, 100)
      expect(color).toBe('text-red-400')
    })
  })

  describe('getRiskColor', () => {
    it('should return correct colors for risk levels', () => {
      expect(getRiskColor('none')).toBe('text-green-400')
      expect(getRiskColor('low')).toBe('text-yellow-400')
      expect(getRiskColor('medium')).toBe('text-orange-400')
      expect(getRiskColor('high')).toBe('text-red-400')
    })
  })

  describe('FPS_TARGETS', () => {
    it('should have correct target values', () => {
      expect(FPS_TARGETS.low.fortnite).toBe(60)
      expect(FPS_TARGETS.medium.fortnite).toBe(120)
      expect(FPS_TARGETS.high.fortnite).toBe(180)
      expect(FPS_TARGETS.ultra.fortnite).toBe(240)
    })

    it('should have targets for all games', () => {
      const games = ['fortnite', 'gta5', 'warzone']
      const levels = ['low', 'medium', 'high', 'ultra']

      levels.forEach(level => {
        games.forEach(game => {
          const levelTargets = FPS_TARGETS[level as keyof typeof FPS_TARGETS]
          expect(levelTargets[game as keyof typeof levelTargets]).toBeDefined()
          expect(typeof levelTargets[game as keyof typeof levelTargets]).toBe('number')
        })
      })
    })
  })
})
