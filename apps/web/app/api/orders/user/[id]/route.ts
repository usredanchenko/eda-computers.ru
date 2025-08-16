import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json(
        { message: 'Неверный ID пользователя' },
        { status: 400 }
      );
    }

    // Получаем параметры пагинации
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    // Формируем URL для API запроса
    let apiUrl = `${process.env.API_URL || 'http://localhost:3001'}/api/orders/user/${userId}?page=${page}&limit=${limit}`;
    if (status) {
      apiUrl += `&status=${status}`;
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Ошибка получения заказов' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('User orders API error:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
