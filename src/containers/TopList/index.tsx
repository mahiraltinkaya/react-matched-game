import React from "react";
import { Space, Table, Tag } from "antd";
import { ITopTen } from "types";

const { Column, ColumnGroup } = Table;

interface IProps {
  data: ITopTen[];
}
const columns = [
  {
    title: "Name",
    dataIndex: "nickname",
    key: "id",
  },
  {
    title: "Game Id",
    dataIndex: "gameId",
    key: "gameId",
  },
  {
    title: "Min Click",
    dataIndex: "score",
    key: "score",
  },
];

const Top10: React.FC<IProps> = ({ data }) => (
  <Table dataSource={data} columns={columns} rowKey={"id"}></Table>
);

export default Top10;
