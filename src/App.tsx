import "./App.css";
import FlipCardItem from "./containers/FlipItem";
import { cards } from "./assets/variables";
import { ICard, ITopTen } from "types";
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
import { v4 as uuidv4 } from "uuid";

import axios from "axios";
import Top10 from "./containers/TopList";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const [list, setList] = useState<ITopTen[]>([]);
  const [g, setG] = useState<string>(uuidv4() || "");
  const [isLoading, startTransition] = useTransition();
  const [cartList, setCartList] = useState<ICard[]>(cards);
  const [nickname, setNickname] = useState<string | null>(
    localStorage.getItem("player") || null
  );
  const [open, setOpen] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);
  const [selected, setSelected] = useState<ICard[]>([]);
  const [matches, setMatches] = useState<number[]>([]);

  const topTen = async () => {
    await axios.get("https://api.apitopya.com/general/top10").then((res) => {
      if (res.data) {
        setList(res.data.top);
      }
    });
  };

  React.useEffect(() => {
    if (!localStorage.getItem("player")) {
      setOpen(true);
    }

    topTen();
  }, []);

  React.useEffect(() => {
    if (matches.length !== 0) {
      startTransition(() => {
        axios.post("https://api.apitopya.com/general/game", {
          nx: counter / matches.length,
          nc: counter,
          nm: matches.length / 2,
          gid: g,
          nn: nickname,
        });
      });
    }

    if (matches.length === 24) {
      topTen();
    }
  }, [matches]);

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
      setG(uuidv4());
      setCartList(cards.sort((a, b) => 0.5 - Math.random()));
    });

    topTen();
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
              description="Start a new game?"
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px 10px",
          }}
        >
          <Space
            style={{ maxWidth: 720, overflowX: "hidden", overflowY: "auto" }}
            wrap
          >
            {matches.length === 24 && <Confetti />}
            <Row gutter={[16, 0]}>
              <Col xs={24}>GID : {g}</Col>
            </Row>
            <Row gutter={[8, 0]}>
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
            <Row gutter={[16, 16]} style={{ maxWidth: 720 }}>
              <Col xl={24} sm={24}>
                <Top10 data={list}></Top10>
              </Col>
              <Col xl={24} sm={24}>
                <div style={{ textAlign: "left", width: "90%", maxWidth: 720 }}>
                  <p>
                    * <UserOutlined /> - Active Player.
                  </p>
                  <p>
                    * <ClearOutlined /> - Clean all events and reset game.
                  </p>
                  <p>
                    * <span style={{ color: "red" }}>0</span>/0 - Icon Click
                    Counter.
                  </p>
                  <p>
                    * 0/<span style={{ color: "red" }}>0</span> - Matching Icons
                    Count.
                  </p>
                </div>
              </Col>
            </Row>
          </Space>
        </Content>
        <Footer style={{ padding: 4 }}>
          <div>
            <Button
              type="text"
              href="https://github.com/mahiraltinkaya/react-matched-game"
              target="_blank"
              block
            >
              <GithubOutlined /> | mahiraltinkaya
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
