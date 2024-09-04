import React from "react";
import { Card, CardContent } from "@mui/material";

const CustomCard = ({
  children,
  maxWidth = "21.5625rem",
  padding = "1rem",
  textAlign = "center",
  ...props
}) => {
  return (
    <Card style={{ maxWidth, padding, textAlign }} {...props}>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default CustomCard;
