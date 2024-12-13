import React, {useState} from "react";
import {assignSubscriptionToTopic, createTopic, unassignSubscriptionToTopic} from "../../services/topicService";
import {Topic, topicSorting} from "../../entities/Topic";
import {Subscription} from "../../entities/Subscription";
import {v4 as uuidv4} from 'uuid';
import Modal from "../atoms/Modal";
import InputText from "../atoms/InputText";
import FlexRow from "../atoms/FlexRow";
import Button from "../atoms/Button";
import Box from "../atoms/Box";
import FlexColumn from "../atoms/FlexColumn";
import {CheckCircleIcon, CircleIcon} from "../atoms/Icons";
import {closeModal} from "../../utilities/modalAction";
import {MenuItem} from "../atoms/MenuItem";
import FlexItem from "../atoms/FlexItem";
import Dropdown from "../atoms/Dropdown";
import Menu from "../atoms/Menu";
import Tag from "../atoms/Tag";
import ALink from "../atoms/ALink";
import {paths} from "../../configuration";
import SearchBar from "../molecules/SearchBar";

export const AssignTopicModalId = "assign-topic-modal";

type AssignTopicModalProps = {
  topics: Topic[];
  subscription: Subscription;
  refreshTopics: () => void;
}

const AssignTopicModal = (props: AssignTopicModalProps) => {
  const [topicName, setTopicName] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  function assignButtonAction(topicId: string) {
    assignSubscriptionToTopic(topicId, props.subscription.uuid)
      .then(() => props.refreshTopics())
      .catch(err => console.log(err));
  }

  function unassignButtonAction(topicId: string) {
    unassignSubscriptionToTopic(topicId, props.subscription.uuid)
      .then(() => props.refreshTopics())
      .catch(err => console.log(err));
  }

  function newTopicButtonAction(topic_name: string) {
    if (topic_name.length > 0) {
      const new_uuid = uuidv4();
      createTopic(new_uuid, topic_name, [])
        .then(async () => {
          await assignSubscriptionToTopic(new_uuid, props.subscription.uuid)
          props.refreshTopics();
        })
        .catch(err => console.log(err));
      setTopicName("");
    }
  }

  const topicsMenuItems = props.topics
    .filter(topic => topic.is_owner && topic.name.toLowerCase().includes(searchValue.toLowerCase()))
    .sort(topicSorting)
    .map(topic => {
      const isSelected = topic.subscriptions_ids.includes(props.subscription.uuid);
      const handleClick = () => {
        if (isSelected) {
          unassignButtonAction(topic.uuid);
        } else {
          assignButtonAction(topic.uuid);
        }
      }
      return (
        <MenuItem key={topic.uuid}
                  selected={false}
                  onClick={handleClick}>
          <FlexRow position={"start"}>
            {topic.name}
            <FlexItem grow={true}/>
            {isSelected && <FlexItem><CheckCircleIcon/></FlexItem>}
            {!isSelected && <FlexItem><CircleIcon/></FlexItem>}
          </FlexRow>
        </MenuItem>
      )
    })

  const topicTags = props.topics
    .filter(topic => topic.is_owner && topic.subscriptions_ids.includes(props.subscription.uuid))
    .map(topic => {
      return (
        <ALink href={paths.TOPICS + "/" + topic.uuid} key={topic.uuid}>
          <Tag>
            <span className={"whitespace-nowrap truncate"}>{topic.name}</span>
          </Tag>
        </ALink>
      )
    })

  return (
    <Modal id={AssignTopicModalId}>
      <FlexColumn>
        <h1 className="font-bold text-xl w-full text-center">{"Asignar subscripción"}</h1>
        <FlexRow>
          <InputText placeholder={"Nombre de la nueva categoría"}
                     value={topicName} onChange={(value) => setTopicName(value)}/>
          <Button clickAction={() => {
            newTopicButtonAction(topicName);
          }}>
            {"Crear"}
          </Button>
        </FlexRow>
        <Box title={"Categorías (" + topicTags.length + ")"}>
          <div className={"h-60 overflow-y-auto"}>
            <FlexRow wrap={true}>
              {topicTags.length === 0 &&
                  <p><b>{props.subscription.name}</b> no está asignada a ninguna categoría</p>
              }
              {topicTags.length > 0 &&
                topicTags
              }
            </FlexRow>
          </div>
        </Box>
        <FlexRow hideOverflow={false} position={"between"}>
          <Dropdown open={dropdownOpen} onChange={(open) => setDropdownOpen(open)}
                    start={true} bottom={false}
                    button={<FlexRow><span>{"Selecciona categorías existentes"}</span></FlexRow>}>
            <div className={"h-60"}>
              <Menu>
                {topicsMenuItems}
              </Menu>
            </div>
            <SearchBar value={searchValue} handleChange={(value) => setSearchValue(value)}/>
          </Dropdown>
          <Button clickAction={() => {
            closeModal(AssignTopicModalId);
          }}>
            <span>{"Aceptar"}</span>
          </Button>
        </FlexRow>
      </FlexColumn>
    </Modal>
  )
}

export default AssignTopicModal;
