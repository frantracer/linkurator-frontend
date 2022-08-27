import {Topic} from "../entities/Topic";
import configuration from "../configuration";
import axios from "axios";
import {TopicItem} from "../entities/TopicItem";

export interface TopicResponse {
  elements: Topic[];
  next_page: string;
}

export async function getTopics(): Promise<Topic[]> {
  let topics: Topic[] = []
  let nextPage = configuration.TOPICS_URL;
  while (nextPage !== "") {
    const {data, status} = await axios.get<TopicResponse>(
      nextPage, {withCredentials: true});
    if (status === 200) {
      topics = topics.concat(data.elements);
      nextPage = data.next_page || "";
    } else {
      console.error("Error retrieving subscriptions", data);
      nextPage = "";
    }
  }
  return topics
}

export async function createTopic(uuid: string, name: string, subscriptions: string[]) {
  const {data, status} = await axios.post(
    configuration.TOPICS_URL,
    {uuid: uuid, name: name, subscriptions_ids: subscriptions},
    {withCredentials: true});
  if (status === 201) {
    return data;
  } else {
    console.error("Error creating topic", data);
  }
}

export async function updateTopic(uuid: string, name: string | undefined, subscriptions: string[] | undefined) {
  const {data, status} = await axios.patch(
    configuration.TOPICS_URL + uuid,
    {
      name: name,
      subscriptions_ids: subscriptions
    },
    {withCredentials: true});
  if (status !== 204) {
    console.error("Error updating topic", data);
  }
}

export async function deleteTopic(uuid: string) {
  const {data, status} = await axios.delete(
    configuration.TOPICS_URL + uuid, {withCredentials: true});
  if (status === 204) {
    return data;
  } else {
    console.error("Error deleting topic", data);
  }
}

export async function getTopicItems(uuid: string): Promise<TopicItem[]> {
  let items: TopicItem[] = []
  try {
    const url = configuration.TOPICS_URL + uuid + "/items";
    const response = await axios.get(url, {withCredentials: true});
    if (response.status === 200) {
      items = mapJsonToTopicItemsResponse(response.data).elements;
    }
  } catch (error: any) {
    console.error("Error retrieving topic items", error);
  }
  return items;
}

interface TopicItemsResponse {
  elements: TopicItem[];
}

const mapJsonToTopicItemsResponse = (json: Record<string, any>): TopicItemsResponse => {
  return {
    elements: json.elements.map((element: Record<string, any>) => {
      const published_at = new Date(element.published_at);
      if (isNaN(published_at.getTime())) {
        throw new Error("Published at is not a valid date");
      }
      return {
        uuid: element.uuid,
        name: element.name,
        url: element.url,
        thumbnail: element.thumbnail,
        published_at: new Date(element.published_at)
      };
    })
  };
}