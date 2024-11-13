'use client';

import type {NextPage} from "next";
import React, {useEffect, useState} from "react";
import useSubscriptions from "../../../../hooks/useSubscriptions";
import useSubscriptionItems from "../../../../hooks/useSubscriptionItems";
import useProfile from "../../../../hooks/useProfile";
import SubscriptionVideoCardGrid from "../../../../components/organism/SubscriptionVideoCardGrid";
import {useTopics} from "../../../../hooks/useTopics";
import useFilters from "../../../../hooks/useFilters";
import {useParams, useRouter} from "next/navigation";
import {paths} from "../../../../configuration";
import Drawer from "../../../../components/molecules/Drawer";
import TopTitle from "../../../../components/molecules/TopTitle";
import Button from "../../../../components/atoms/Button";
import {
  AddIcon,
  CrossIcon,
  FunnelIcon,
  MenuIcon,
  MinusIcon,
  OptionsIcon,
  PencilIcon,
  RefreshIcon
} from "../../../../components/atoms/Icons";
import SubscriptionDetails, {SUBSCRIPTION_DETAILS_ID} from "../../../../components/organism/SubscriptionDetails";
import {followSubscription, refreshSubscription, unfollowSubscription} from "../../../../services/subscriptionService";
import AssignTopicModal, {AssignTopicModalId} from "../../../../components/organism/AssignTopicModal";
import {showLateralMenu} from "../../../../utilities/lateralMenuAction";
import {LATERAL_NAVIGATION_MENU_ID} from "../../../../components/organism/LateralNavigationMenu";
import useSubscription from "../../../../hooks/useSubscription";
import Tag from "../../../../components/atoms/Tag";
import {ErrorBanner} from "../../../../components/atoms/ErrorBanner";
import FlexRow from "../../../../components/atoms/FlexRow";
import FlexItem from "../../../../components/atoms/FlexItem";
import Dropdown from "../../../../components/atoms/Dropdown";
import {openModal} from "../../../../utilities/modalAction";
import FlexColumn from "../../../../components/atoms/FlexColumn";
import Miniature from "../../../../components/atoms/Miniature";

const REFRESH_SUBSCRIPTIONS_INTERVAL = 10000;

const SubscriptionsPage: NextPage = () => {
  const router = useRouter()
  const pathParams = useParams<{ id: string[] | string }>();

  const selectedSubscriptionId: string | undefined = pathParams.id ? (Array.isArray(pathParams.id) ? pathParams.id[0] : pathParams.id) : undefined;

  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const {filters, setFilters, resetFilters} = useFilters();
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const {profile, profileIsLoading} = useProfile();
  const {subscriptions, refreshSubscriptions} = useSubscriptions(profile);
  const {topics, refreshTopics} = useTopics(profile, profileIsLoading);
  const {
    subscription: selectedSubscription,
    isSubscriptionError
  } = useSubscription(selectedSubscriptionId, subscriptions);

  const subscriptionUrl = selectedSubscription ? selectedSubscription.url : "";
  const subscriptionName = selectedSubscription ? selectedSubscription.name : "";

  const isUserLogged = !!(profile)

  const openSubscriptionUrl = () => {
    if (subscriptionUrl) window.open(subscriptionUrl, "_blank");
  }

  const {
    subscriptionsItems,
    refreshSubscriptionItem,
    fetchMoreItems,
    isLoading,
    isFinished
  } = useSubscriptionItems(selectedSubscription, debouncedFilters);

  const handleGridScroll = (event: React.UIEvent<HTMLElement>) => {
    const element = event.currentTarget
    if (isFinished || isLoading) {
      return
    }
    if ((element.scrollTop + element.clientHeight) / element.scrollHeight >= 0.90) {
      fetchMoreItems()
    }
  }

  const handleShowFilters = () => {
    showLateralMenu(SUBSCRIPTION_DETAILS_ID);
    setDropdownOpen(false);
  }

  const handleAssignSubscription = () => {
    if (selectedSubscription && !selectedSubscription.followed) {
      setError("Dale a Seguir antes de asignar la subscripción");
    } else {
      openModal(AssignTopicModalId);
      setDropdownOpen(false);
      setError(null);
    }
  }

  const handleRefreshSubscription = (subscriptionId: string) => {
    refreshSubscription(subscriptionId).then(() => {
      refreshSubscriptions();
    });
    setDropdownOpen(false);
  }

  const handleFollowSubscription = (subscriptionId: string) => {
    followSubscription(subscriptionId).then(() => {
      refreshSubscriptions();
    });
  }

  const handleUnfollowSubscription = (subscriptionId: string) => {
    unfollowSubscription(subscriptionId).then((resultOk) => {
      if (resultOk) {
        refreshSubscriptions();
        setError(null);
      } else {
        setError("No puedes dejar de seguir una subscripción asociada a una categoría");
      }
    })
  }

  useEffect(() => {
    if (!profileIsLoading) {
      if (profile && subscriptions.length > 0 && selectedSubscription === undefined) {
        router.push(paths.SUBSCRIPTIONS + "/" + subscriptions[0].uuid)
      }
    }
  }, [profile, profileIsLoading, router, selectedSubscription, subscriptions]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedSubscription && selectedSubscription.isBeingScanned) {
        refreshSubscriptions();
      } else {
        clearInterval(interval);
      }
    }, REFRESH_SUBSCRIPTIONS_INTERVAL)
    return () => clearInterval(interval)
  }, [refreshSubscriptions, selectedSubscription]);

  useEffect(() => {
    if (filters.textSearch === debouncedFilters.textSearch) {
      setDebouncedFilters(filters)
    } else {
      const timer = setTimeout(() => {
        setDebouncedFilters(filters)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [debouncedFilters.textSearch, filters]);

  const dropdownButtons = []
  dropdownButtons.push(
    <Button key={"subscriptions-show-filters"}
            fitContent={false} clickAction={handleShowFilters}>
      <FunnelIcon/>
      Filtrar
    </Button>
  )
  if (selectedSubscription && isUserLogged) {
    dropdownButtons.push(
      <Button key={"subscriptions-assign"}
              fitContent={false} clickAction={handleAssignSubscription}>
        <PencilIcon/>
        Asignar
      </Button>
    )
    dropdownButtons.push(
      <Button key={"subscriptions-refresh"}
              fitContent={false} clickAction={() => handleRefreshSubscription(selectedSubscription.uuid)}>
        <RefreshIcon/>
        Actualizar
      </Button>
    )
  }
  if (selectedSubscription && selectedSubscription.followed && isUserLogged) {
    dropdownButtons.push(
      <Button key={"subscriptions-unfollow"}
              fitContent={false} clickAction={() => handleUnfollowSubscription(selectedSubscription.uuid)}>
        <MinusIcon/>
        Dejar de seguir
      </Button>
    )
  }
  if (selectedSubscription && !selectedSubscription.followed && isUserLogged) {
    dropdownButtons.push(
      <Button key={"subscriptions-follow"}
              fitContent={false} clickAction={() => handleFollowSubscription(selectedSubscription.uuid)}>
        <AddIcon/>
        Seguir
      </Button>
    )
  }

  return (
    <Drawer id={SUBSCRIPTION_DETAILS_ID} right={true} alwaysOpenOnDesktop={false}>
      <SubscriptionDetails subscription={selectedSubscription}
                           filters={filters}
                           showInteractions={isUserLogged}
                           setFilters={setFilters}
                           resetFilters={resetFilters}/>
      <TopTitle>
        <Button clickAction={() => showLateralMenu(LATERAL_NAVIGATION_MENU_ID)} showOnlyOnMobile={true}>
          <MenuIcon/>
        </Button>
        <FlexRow hideOverflow={true}>
          <FlexItem grow={true}/>
          <FlexRow>
            <FlexItem>
              <FlexColumn gap={0} position={"center"}>
                <FlexRow>
                  {selectedSubscription &&
                      <Miniature src={selectedSubscription.thumbnail} alt={selectedSubscription.name}/>
                  }
                  <h1 className="text-xl font-bold whitespace-nowrap truncate hover:cursor-pointer"
                      onClick={openSubscriptionUrl}>
                    {subscriptionName}
                  </h1>
                </FlexRow>
                {selectedSubscription && selectedSubscription.followed &&
                    <Tag>
                        <span>
                          {"Siguiendo"}
                        </span>
                        <div className="hover:cursor-pointer"
                             onClick={() => handleUnfollowSubscription(selectedSubscription.uuid)}>
                            <CrossIcon/>
                        </div>
                    </Tag>
                }
                {selectedSubscription && !selectedSubscription.followed && isUserLogged &&
                    <Button primary={false} clickAction={() => handleFollowSubscription(selectedSubscription.uuid)}>
                      {"Seguir"}
                    </Button>
                }
                {selectedSubscription && !selectedSubscription.followed && !isUserLogged &&
                    <Button primary={false} href={paths.LOGIN}>
                      {"Seguir"}
                    </Button>
                }
              </FlexColumn>
            </FlexItem>
          </FlexRow>
          <FlexItem grow={true}/>
        </FlexRow>
        <Dropdown open={dropdownOpen} onChange={setDropdownOpen} button={<OptionsIcon/>} start={false} bottom={true}>
          {dropdownButtons}
        </Dropdown>
      </TopTitle>
      {error &&
          <FlexRow position={"center"}>
              <ErrorBanner>
                  <span>{error}</span>
                  <div className={"hover:cursor-pointer"} onClick={() => setError(null)}>
                      <CrossIcon/>
                  </div>
              </ErrorBanner>
          </FlexRow>
      }
      {isSubscriptionError &&
          <div className="flex items-center justify-center h-screen">
              <span>{"La subscripción no existe"}</span>
          </div>
      }
      <SubscriptionVideoCardGrid
        refreshItem={refreshSubscriptionItem}
        fetchMoreItems={fetchMoreItems}
        topics={topics}
        subscription={selectedSubscription}
        items={subscriptionsItems}
        filters={debouncedFilters}
        showInteractions={isUserLogged}
        isLoading={isLoading}
        isFinished={isFinished}
        handleScroll={handleGridScroll}
      />
      {selectedSubscription &&
          <AssignTopicModal topics={topics}
                            subscription={selectedSubscription}
                            refreshTopics={refreshTopics}/>
      }
    </Drawer>
  );
};

export default SubscriptionsPage;
