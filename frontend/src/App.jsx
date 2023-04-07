import { useMediaQuery } from "react-responsive";

import DesktopRoute from "./DesktopRoute";
import MobileRotue from "./MobileRotue";

function App() {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  return (
    <>
      {isDesktopOrLaptop && <DesktopRoute />}
      {isTabletOrMobile && <MobileRotue />}
    </>
  );
}

export default App;
