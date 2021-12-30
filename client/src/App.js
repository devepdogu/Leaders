import './App.css';
import io from "socket.io-client";
import React from 'react'
import { Container, Row, Col, Spinner } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import User from './components/user';


function App() {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    const socket = io("http://localhost:9000");
    socket.emit("fetchingTopLeader", { offset: 0, count: 100 });
    socket.on("fetchTopLeader", function (users) {
      setData(users);
    })
  }, []);


  window.onscroll = () => {
    if (document.getElementsByClassName("dataRow").length > 0) {
      var head = document.getElementById("dataHead");
      let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      let rowWidth = document.querySelector(".dataRow .row_item:nth-child(4)");
      if (rowWidth && typeof rowWidth.clientWidth !== "undefined") {
        if (winScroll >= head.offsetTop) {
          document.getElementById("dataHead").classList.add("fixedTop");
          head.setAttribute("style", `width:${rowWidth.clientWidth + 40}px`);
        }
        if (winScroll < 50) {
          document.getElementById("dataHead").classList.remove("fixedTop");
          head.removeAttribute("style")
        }
      }
    }
  }

  return (
    <Container >
      <Row>

        <Col className={typeof data.data === "undefined" || data.data.length === 0 ? 'notLoading' : ''}>
          {
            typeof data.data !== "undefined" && data.data.length > 0 ? (

              <div id="tableRow" className='dataParent'>
                <div className='dataHead' id="dataHead">
                  <span>Country</span>
                  <span>Username</span>
                  <span>Rank</span>
                  <span>Earn Money</span>
                  <span>Daily Diff</span>
                </div>

                <div className="dataRow">
                  {
                    data.data.length > 0 && data.data.map((item, i) => (
                      <User key={i} item={item} ></User>
                    ))
                  }
                </div>
              </div>
            ) : (
              <Spinner animation="grow" variant="danger" />
            )
          }
        </Col>
      </Row>
    </Container >
  );

}

export default App;
