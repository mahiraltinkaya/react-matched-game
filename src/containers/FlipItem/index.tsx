import { Card } from "antd";

import { ICard } from "types";

interface IProps {
  item: ICard;
  selected?: ICard[];
  matches?: number[];
  onClick: (item: ICard) => void;
}
const FlipCardItem: React.FC<IProps> = ({
  item,
  selected = [],
  onClick,
  matches = [],
}) => {
  const exists = () => {
    if (matches.includes(item.id)) return true;

    if (selected.some((x) => x.id === item.id)) return true;

    return false;
  };

  return (
    <Card
      style={{
        cursor: "pointer",
        position: "relative",
        width: "100%",
        height: 90,
      }}
      onClick={() => {
        selected.length < 2 && onClick(item);
      }}
      bodyStyle={{ padding: 16 }}
    >
      <div className={`flip-container ${exists() ? "back" : "front"}`}>
        <img
          src={item.img}
          alt=""
          width={"100%"}
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className={`flip-container ${exists() ? "front" : "back"}`}>
        <img
          src={"/game.svg"}
          alt=""
          width={"100%"}
          style={{ objectFit: "contain" }}
        />
      </div>
    </Card>
  );
};

export default FlipCardItem;
