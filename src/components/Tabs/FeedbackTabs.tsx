import { Tabs, TabsItem } from "@vkontakte/vkui";
import { useState } from "react";

type FeedbackTabsProps = {
  onTabChange: (selectedTab: string) => void;
};

const FeedbackTabs = ({ onTabChange }: FeedbackTabsProps) => {
  const [selected, setSelected] = useState("feedback");

  const handleTabChange = (newSelected: string) => {
    setSelected(newSelected);
    onTabChange(newSelected);
  };

  return (
    <Tabs layoutFillMode="stretched">
      <TabsItem
        selected={selected === "feedback"}
        onClick={() => handleTabChange("feedback")}
      >
        Отклики
      </TabsItem>
      <TabsItem
        selected={selected === "invitations"}
        onClick={() => handleTabChange("invitations")}
      >
        Приглашения
      </TabsItem>
      <TabsItem
        selected={selected === "favorites"}
        onClick={() => handleTabChange("favorites")}
      >
        Избранное
      </TabsItem>
    </Tabs>
  );
};

export default FeedbackTabs;