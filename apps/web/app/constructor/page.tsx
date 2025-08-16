'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PcConfigurator from '@/components/PcConfigurator';
import LoadingSpinner from '@/components/LoadingSpinner';
import { CartProvider } from '@/hooks/useCart';
import { api } from '@/lib/api';

export default function ConstructorPage() {
  const [components, setComponents] = useState<any[]>([]);
  const [builds, setBuilds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compRes, buildsRes] = await Promise.all([
          api.getComponents(),
          api.getPublicBuilds()
        ]);
        const comps = compRes?.data?.components || [];
        setComponents(comps);
        const b = buildsRes?.data?.builds || [];
        setBuilds(b);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <LoadingSpinner 
          size="lg" 
          text="Загружаем конструктор..." 
          className="text-center"
        />
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <PcConfigurator 
          components={components} 
          builds={builds as unknown as Record<string, unknown>[]} 
        />
      </div>
    </CartProvider>
  );
}
