import "./App.css";
import FlipCardItem from "./containers/FlipItem";

import { cards } from "./assets/variables";
import { ICard } from "types";
import {
  Button,
  Col,
  Divider,
  Input,
  Layout,
  Popconfirm,
  Row,
  Space,
  Typography,
} from "antd";
import { useState } from "react";
import { ClearOutlined, GithubOutlined, UserOutlined } from "@ant-design/icons";
import ModalComponent from "./containers/ModalComponent";
import React, { useTransition } from "react";
import Confetti from "react-confetti";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const [isLoading, startTransition] = useTransition();
  const [cartList, setCartList] = useState<ICard[]>(cards);
  const [nickname, setNickname] = useState<string | null>(
    localStorage.getItem("player") || null
  );
  const [open, setOpen] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);
  const [selected, setSelected] = useState<ICard[]>([]);
  const [matches, setMatches] = useState<number[]>([]);

  React.useEffect(() => {
    if (!localStorage.getItem("player")) {
      setOpen(true);
    }
  }, []);

  const handelSelect = (item: ICard) => {
    if (selected.some((x) => x.id === item.id)) return;

    setCounter((prev) => prev + 1);
    setSelected((prev) => [...prev, item]);

    if (selected.length === 1) {
      if (selected.some((x) => x.title === item.title)) {
        setMatches([...matches, ...[item.id, selected[0].id]]);
        setSelected([]);
      }
      setTimeout(() => {
        setSelected([]);
      }, 500);
    }
  };

  const resetGame = () => {
    startTransition(() => {
      setMatches([]);
      setSelected([]);
      setCounter(0);
      setCartList(cards.sort((a, b) => 0.5 - Math.random()));
    });
  };

  const onClick = () => {
    localStorage.setItem("player", nickname || "");
    setOpen(false);
  };

  return (
    <div className="app">
      <Layout style={{ height: "100vh" }}>
        <Header
          style={{
            color: "#fff",
            height: 64,
            lineHeight: "64px",
            backgroundColor: "#1d96e8",
            padding: 12,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              maxWidth: 720,
            }}
          >
            <Button
              onClick={() => {
                setOpen(true);
              }}
              shape={"circle"}
            >
              {nickname ? nickname.substring(0, 2) : <UserOutlined />}
            </Button>

            <Title level={5} style={{ color: "white" }}>
              {counter} / {matches.length / 2}
            </Title>

            <Popconfirm
              title="Clean Game Score and Events?"
              description="Are you sure to delete game informations?"
              okText="Yes"
              cancelText="No"
              onConfirm={resetGame}
            >
              <Button
                shape="circle"
                type="default"
                icon={<ClearOutlined />}
              ></Button>
            </Popconfirm>
          </div>
        </Header>
        <Content
          style={{
            padding: 1,
            display: "flex",
            justifyContent: "center",
            height: "100% !important",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ maxWidth: 720, minHeight: 500, padding: 10 }}>
            {matches.length === 24 && <Confetti />}

            <Space size={"small"}>
              <Row gutter={[2, 2]}>
                {cartList.map((item: ICard, index: number) => (
                  <Col key={index} span={4} xs={6} sm={6} md={4}>
                    <FlipCardItem
                      item={item}
                      selected={selected}
                      matches={matches}
                      onClick={(e) => {
                        handelSelect(e);
                      }}
                    ></FlipCardItem>
                  </Col>
                ))}
              </Row>
            </Space>
          </div>
          <div style={{ textAlign: "left", width: "90%", maxWidth: 720 }}>
            <p>
              * <UserOutlined /> - Active Player.
            </p>

            <p>
              * <ClearOutlined /> - Clean all events and reset game.
            </p>
          </div>
        </Content>
        <Footer style={{ padding: 4 }}>
          <div>
            <Button
              type="text"
              href="https://github.com/mahiraltinkaya/react-matched-game"
              target="_blank"
              block
            >
              <GithubOutlined /> | @mahiraltinkaya
            </Button>
          </div>
        </Footer>
        <ModalComponent
          open={open}
          setOpen={setOpen}
          onSubmit={onClick}
          title="Please enter a nicnkame"
        >
          <>
            <Row>
              <Col span={24}>
                <Input
                  placeholder="Nicknane"
                  value={nickname || ""}
                  onChange={(e) => {
                    setNickname(e.target.value);
                  }}
                ></Input>
              </Col>
            </Row>
          </>
        </ModalComponent>
      </Layout>
    </div>
  );
};

export default App;
function forceRender() {
  throw new Error("Function not implemented.");
}
