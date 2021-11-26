import { MenuItem } from "./MenuItem";
import useTopics from "../hooks/useTopics";
import { useState } from "react";

type LateralMenuProps = {
  onClickTopic: (topicId: string) => void;
};

const Title = () => (
  <div className="flex flex-row items-center justify-between flex-shrink-0 px-8 py-4">
    <a
      href="#"
      className="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg focus:outline-none focus:shadow-outline"
    >
      Linkurator
    </a>
    <button className="rounded-lg md:hidden focus:outline-none focus:shadow-outline">
      Linkurator
    </button>
  </div>
);

const LateralMenu = (props: LateralMenuProps) => {
  const topics = useTopics();
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  const handleClick = (topicId: string) => {
    setSelectedTopic(topicId);
    props.onClickTopic(topicId);
  };

  const items = topics.map((topic) => (
    <MenuItem
      title={topic.name}
      key={topic.id}
      onClick={() => handleClick(topic.id)}
      selected={topic.id === selectedTopic}
    />
  ));

  return (
    <div className="flex-col w-full bg-white md:flex md:flex-row md:min-h-screen">
      <div className="flex flex-col flex-shrink-0 w-full text-gray-700 bg-blue-300 md:w-64">
        <Title />
        <nav className="flex-grow px-4 pb-4 md:block md:pb-0 md:overflow-y-auto">
          {items}
        </nav>
      </div>
    </div>
  );
};

export default LateralMenu;
