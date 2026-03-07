import SubscriptionPageWrapper from '../components/SubscriptionPageWrapper';

export function generateStaticParams() {
  return [{id: '_'}];
}

export default function SubscriptionDetailPage() {
  return <SubscriptionPageWrapper/>
}
