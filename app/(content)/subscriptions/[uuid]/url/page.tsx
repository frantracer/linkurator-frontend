'use client';

import { useEffect, useState } from 'react';
import { getSubscription } from '../../../../../services/subscriptionService';
import { useTranslations } from 'next-intl';

type SubscriptionUrlPageParams = {
  params: { uuid: string }
};

export default function SubscriptionUrlPage({ params }: SubscriptionUrlPageParams) {
  const t = useTranslations('common');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { uuid } = params;

  useEffect(() => {
    if (!uuid) {
      setError(t('subscription_not_found'));
      setLoading(false);
      return;
    }

    const fetchAndRedirect = async () => {
      try {
        const subscription = await getSubscription(uuid);
        
        if (!subscription) {
          setError(t('subscription_not_found'));
          setLoading(false);
          return;
        }

        window.location.href = subscription.url;
      } catch (error) {
        console.error('Error fetching subscription for redirect:', error);
        setError(t('subscription_not_found'));
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