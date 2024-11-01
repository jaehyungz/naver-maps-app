import React, { Suspense } from "react";

interface Props {}

function Loading(props: Props) {
  const {} = props;

  return (
    <div className="loading-container">
      <div className="bar">
        <span className="percent" />
      </div>
    </div>
  );
}

export default Loading;
