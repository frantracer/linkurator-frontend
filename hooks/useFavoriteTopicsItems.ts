import { useQuery } from '@tanstack/react-query';
import { Topic } from '../entities/Topic';
import { SubscriptionItem } from '../entities/SubscriptionItem';
import { getTopicItems } from '../services/topicService';

type UseFavoriteTopicsItemsState = {
  items: SubscriptionItem[];
  isLoading: boolean;
  error: string | null;
}

export const useFavoriteTopicsItems = (topics: Topic[]): UseFavoriteTopicsItemsState => {
  const favoriteTopics = topics.filter(topic => topic.is_favorite);

  const fetchFavoriteTopicsItems = async (): Promise<SubscriptionItem[]> => {
    if (favoriteTopics.length === 0) {
      return [];
    }

    const allItems: SubscriptionItem[] = [];

    // Fetch items from each favorite topic
    for (const topic of favoriteTopics) {
      try {
        const response = await getTopicItems(topic.uuid, 0, 10800, "", [], []);
        // Take only the first 5 items from each topic to avoid overwhelming the grid
        allItems.push(...response.elements.slice(0, 5));
      } catch (error) {
        console.error(`Error fetching items for topic ${topic.name}:`, error);
      }
    }

    // Sort by published date (newest first) and limit to 20 items total
    return allItems
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, 20);
  };

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['favorite-topics-items', favoriteTopics.map(t => t.uuid).sort()],
    queryFn: fetchFavoriteTopicsItems,
    staleTime: 300000, // 5 minutes
    enabled: favoriteTopics.length > 0,
  });

  return {
    items,
    isLoading,
    error: error ? String(error) : null,
  };
};