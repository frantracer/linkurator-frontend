import axios from "axios";
import {useEffect, useState} from "react";
import configuration from "../configuration";
import {Profile} from "./useProfile";
import {Subscription, subscriptionSorting} from "../entities/Subscription";

export interface SubscriptionResponse {
  elements: Subscription[];
  next_page: string;
}

const useSubscriptions = (profile: Profile) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        if (profile) {
          let subscriptions: Subscription[] = []
          let nextPage = configuration.SUBSCRIPTIONS_URL;
          while (nextPage !== "") {
            const {data, status} = await axios.get<SubscriptionResponse>(
              nextPage, {withCredentials: true});
            if (status === 200) {
              subscriptions = subscriptions.concat(data.elements);
              nextPage = data.next_page || "";
            } else {
              console.error("Error retrieving subscriptions", data);
              nextPage = "";
            }
          }
          subscriptions.sort(subscriptionSorting)
          setSubscriptions(subscriptions);
        } else {
          setSubscriptions([]);
        }
      } catch (error: any) {
        console.error("Error retrieving subscriptions", error);
      }
    };

    fetchSubscriptions();
  }, [profile]);

  return subscriptions;
};

export default useSubscriptions;
