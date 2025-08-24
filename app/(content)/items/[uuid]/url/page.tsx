'use client';

import { useEffect, useState } from 'react';
import { getItem } from '../../../../../services/subscriptionService';
import { useTranslations } from 'next-intl';

type ItemUrlPageParams = {
  params: { uuid: string }
};

export default function ItemUrlPage({ params }: ItemUrlPageParams) {
  const t = useTranslations('common');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { uuid } = params;

  useEffect(() => {
    if (!uuid) {
      setError(t('item_not_found'));
      setLoading(false);
      return;
    }

    const fetchAndRedirect = async () => {
      try {
        const item = await getItem(uuid);
        
        if (!item) {
          setError(t('item_not_found'));
          setLoading(false);
          return;
        }

        window.location.href = item.url;
      } catch (error) {
        console.error('Error fetching item for redirect:', error);
        setError(t('item_not_found'));
        setLoading(false);
      }
    };

    fetchAndRedirect().catch(console.error);
  }, [uuid, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-base-content mb-4">404</h1>
          <p className="text-xl text-base-content">{error}</p>
        </div>
      </div>
    );
  }

  return null;
}