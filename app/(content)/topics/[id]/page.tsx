import TopicPageWrapper from '../components/TopicPageWrapper';

export function generateStaticParams() {
  return [{id: '_'}];
}

export default function TopicDetailPage() {
  return <TopicPageWrapper/>
}
