'use client';

import {useParams} from 'next/navigation';
import CuratorPageComponent from './CuratorPage';

export default function CuratorPageWrapper() {
  const params = useParams<{ id: string }>();
  const curatorName = params.id || '';
  return <CuratorPageComponent curatorName={curatorName}/>
}
