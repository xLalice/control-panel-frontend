import ClipLoader from "react-spinners/ClipLoader";
import { CSSProperties } from "react";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};

export const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen w-screen background-black">
      <ClipLoader
        color={"#FFD700"}
        loading={true}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      )
    </div>
  );
};
