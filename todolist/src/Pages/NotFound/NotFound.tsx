import React from "react";
import { Link } from "react-router-dom";
import { Container, Message, StyledLink } from "./NotFound.styled";

function NotFound() {
  return (
    <Container>
      <Message>Page Not Found</Message>
      <StyledLink to="/projects">Go to Projects</StyledLink>
    </Container>
  );
}

export default NotFound;
