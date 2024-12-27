import React from "react";
import { Container, Row, Col } from "react-bootstrap";

// Footer Component
function Footer() {
  return (
    <footer
      style={{
        color: "white",
        padding: "20px 0",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center", // Distribute space around items
        alignContent: "center", 
      }}
    >
      <Container>
        <Row className="text-center">
          <Col>
            <p>&copy; {new Date().getFullYear()} Spotify Album Search. All rights reserved.</p>
            <p>
              <a href="https://www.spotify.com" style={{ color: "white", textDecoration: "none" }}>
                Visit Spotify
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
