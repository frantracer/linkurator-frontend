'use client';

import {useParams} from 'next/navigation';
import SubscriptionPageComponent from './SubscriptionPage';

export default function SubscriptionPageWrapper() {
  const params = useParams<{ id: string }>();
  const subscriptionId = params.id || '';
  return <SubscriptionPageComponent subscriptionId={subscriptionId}/>
}
