import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import qs from "qs";

function Redirection() {
  const location = useLocation();

  useEffect(() => {
    const params = qs.parse(location.search, { ignoreQueryPrefix: true });

    const opener: Window = window.opener;
    opener.postMessage(params, "http://127.0.0.1:3001");
    window.close();
  }, [location]);

  return <div>Redirect</div>;
}

export default Redirection;
