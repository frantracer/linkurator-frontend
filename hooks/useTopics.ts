import {useQuery} from '@tanstack/react-query';
import {Topic, topicSorting} from '../entities/Topic';
import {getTopics} from '../services/topicService';
import {Profile} from "../services/profileService";

type UseTopics = {
  topics: Topic[];
  topicsAreLoading: boolean;
  refreshTopics: () => void;
}

const fetchTopics = async (profile: Profile | undefined) => {
  if (profile) {
    const topics = await getTopics();
    topics.sort(topicSorting);
    return topics;
  }
  return [];
};

export function useTopics(profile: Profile | undefined, profileIsLoading: boolean): UseTopics {
  const {data: topics = [], isLoading, refetch: refreshTopics} = useQuery({
    queryKey: ['topics', profile, profileIsLoading],
    queryFn: () => fetchTopics(profile),
    staleTime: 60000,
  });

  const topicsAreLoading = profileIsLoading || isLoading;

  return {
    topics,
    topicsAreLoading,
    refreshTopics,
  };
}
