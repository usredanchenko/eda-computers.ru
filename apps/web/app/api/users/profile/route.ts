import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Получение профиля пользователя
export async function GET(request: NextRequest) {
  try {
    // Получаем токен из заголовка
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Требуется авторизация' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    const response = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Ошибка получения профиля' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// Обновление профиля пользователя
export async function PUT(request: NextRequest) {
  try {
    // Получаем токен из заголовка
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Требуется авторизация' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const body = await request.json();

    const response = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Ошибка обновления профиля' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Profile update API error:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
