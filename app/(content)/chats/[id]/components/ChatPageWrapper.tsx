'use client';

import {useParams} from 'next/navigation';
import ChatPageComponent from './ChatPage';

export default function ChatPageWrapper() {
  const params = useParams<{ id: string }>();
  return <ChatPageComponent conversationId={params.id}/>
}
