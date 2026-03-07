import CuratorPageWrapper from '../components/CuratorPageWrapper';

export function generateStaticParams() {
  return [{id: '_'}];
}

export default function CuratorDetailPage() {
  return <CuratorPageWrapper/>
}
