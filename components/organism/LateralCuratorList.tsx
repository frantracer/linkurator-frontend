import {MenuItem} from "../atoms/MenuItem";
import React from "react";
import {Curator, curatorSorting} from "../../entities/Curators";
import {paths} from "../../configuration";
import {useRouter} from "next/navigation";
import {scrollToDrawerTop} from "../../utilities/scrollToDrawerTop";
import Menu from "../atoms/Menu";
import FlexRow from "../atoms/FlexRow";
import Miniature from "../atoms/Miniature";
import {InfoBanner} from "../atoms/InfoBanner";
import {useTranslations} from "next-intl";

type LateralCuratorListProps = {
  curators: Curator[];
  selectedCurator: Curator | undefined;
  closeMenu: () => void;
}

const LateralCuratorList = (props: LateralCuratorListProps) => {
  const t = useTranslations("common");
  const router = useRouter()
  const handleClick = (curatorId: string) => {
    const curator = props.curators.find((curator) => curator.id === curatorId);
    if (curator) {
      props.closeMenu();
      scrollToDrawerTop()
      router.push(paths.CURATORS + "/" + curator.username)
    }
  }

  const items = props.curators
    .sort(curatorSorting)
    .map((curator) => (
      <MenuItem
        key={curator.id}
        onClick={() => handleClick(curator.id)}
        selected={curator.id === props.selectedCurator?.id}
      >
        <FlexRow>
          <Miniature src={curator.avatar_url} alt={curator.username}/>
          <div className="whitespace-nowrap overflow-auto truncate w-full">{curator.username}</div>
        </FlexRow>
      </MenuItem>
    ))

  const noItems = (
    <InfoBanner>
      <span className={"text-sm"}>{t("no_curators_found")}</span>
    </InfoBanner>
  )

  return (
    <Menu>
      {items.length > 0 ? items : noItems}
    </Menu>
  )
}

export default LateralCuratorList;
