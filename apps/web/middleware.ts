import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Проксирование API запросов на внешний сервер
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Используем localhost для внешних запросов, server для внутренних
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? (process.env.API_URL || 'http://server:3001')
      : 'http://localhost:3001';
    
    const targetUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, apiUrl);
    
    // Копируем заголовки
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      headers.set(key, value);
    });
    
    // Устанавливаем правильный Host
    headers.set('Host', new URL(apiUrl).host);
    
    return NextResponse.rewrite(targetUrl, {
      headers,
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
};
