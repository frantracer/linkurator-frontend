'use client';

import {useParams} from 'next/navigation';
import TopicPageComponent from './TopicPage';

export default function TopicPageWrapper() {
  const params = useParams<{ id: string }>();
  const topicId = params.id || '';
  return <TopicPageComponent topicId={topicId}/>
}
