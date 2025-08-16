import { api } from '@/lib/api'

describe('API Client', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('makes successful API request', async () => {
    const mockResponse = { data: 'test' }
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const result = await api.getComponents()

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/components'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      })
    )
    expect(result).toEqual(mockResponse)
  })

  it('handles API errors', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Bad Request' })
    })

    await expect(api.getComponents()).rejects.toThrow('Bad Request')
  })

  it('includes auth token in requests when available', async () => {
    localStorage.setItem('auth_token', 'test-token')
    
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'test' })
    })

    await api.getComponents()

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-token'
        })
      })
    )
  })

  it('creates order successfully', async () => {
    const orderData = {
      components: [{ id: 1, name: 'Test Component', price: 1000 }],
      total_price: 1000,
      customer_name: 'Test User',
      customer_email: 'test@example.com',
      customer_phone: '+1234567890',
      delivery_address: 'Test Address',
      notes: 'Test notes',
      order_type: 'guest' as const
    };
    const mockResponse = { id: 1, ...orderData };
    
    const mockFetchResponse = {
      ok: true,
      json: async () => mockResponse
    };
    global.fetch = jest.fn().mockResolvedValueOnce(mockFetchResponse);

    const result = await api.createOrder(orderData);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/orders'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(orderData)
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it('updates order status', async () => {
    const mockFetchResponse = {
      ok: true,
      json: async () => ({ success: true })
    };
    global.fetch = jest.fn().mockResolvedValueOnce(mockFetchResponse);

    await api.updateOrderStatus(1, 'delivered');

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/orders/1/status'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ status: 'delivered' })
      })
    );
  });
})
