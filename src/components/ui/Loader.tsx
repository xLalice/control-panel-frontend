import ClipLoader from "react-spinners/ClipLoader";
import { CSSProperties } from "react";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};

export const Loader = (isLoading: boolean) => {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <ClipLoader
        color={"#FFD700"}
        loading={isLoading}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      )
    </div>
  );
};
