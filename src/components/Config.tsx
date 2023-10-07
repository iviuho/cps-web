import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { AuthCode, Configuration, UserAccessToken } from "../interfaces/api";
import { API } from "../config";
import AuthorizationButton from "./AuthorizationButton";
import ConfigForm from "./ConfigForm";
import Loading from "./Loading";

function configToString(config?: Configuration) {
  return `v${config?.version}: ${config?.content}`;
}

function Config() {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Twitch.ext.Authorized>();
  const [viewer, setViewer] = useState<Twitch.ext.Viewer>();
  const [code, setCode] = useState<string>();
  const [token, setToken] = useState<UserAccessToken>();
  const [broadcasterConfig, setBroadcasterConfig] = useState<Configuration>();

  const redirectListener = useCallback((e: MessageEvent<AuthCode>) => {
    if (e.isTrusted === false) {
      return;
    }

    if (e.data.code) {
      console.log(e.data);
      setCode(e.data.code);
    }
  }, []);

  useEffect(() => {
    setLoading(true);

    Twitch.ext.onAuthorized(auth => {
      if (Twitch.ext.viewer.isLinked === false) {
        Twitch.ext.actions.requestIdShare();
      }

      console.log(auth);

      setAuth(auth);
      setViewer(Twitch.ext.viewer);
      setBroadcasterConfig(Twitch.ext.configuration.broadcaster);
      setLoading(false);
    });

    Twitch.ext.viewer.onChanged(() => {
      console.log("viewer changed");
      setViewer(Twitch.ext.viewer);
    });

    Twitch.ext.configuration.onChanged(() => {
      console.log("configuration changed");
      setBroadcasterConfig(Twitch.ext.configuration.broadcaster);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("message", redirectListener);

    return () => {
      window.removeEventListener("message", redirectListener);
    };
  }, [redirectListener]);

  useEffect(() => {
    if (auth) {
      setLoading(true);
      axios
        .get<UserAccessToken>(`${API}/auth`, {
          headers: { Authorization: `Bearer ${auth.token}` },
          params: { code }
        })
        .then(v => setToken(v.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [auth, code]);

  return loading ? (
    <Loading />
  ) : (
    <div>
      <div>{auth ? `Logged in ✅` : `Not logged in ❎`}</div>
      <div>{viewer?.isLinked ? `Linked ✅` : `Not linked ❎`}</div>
      <div>{token ? `Authorization ✅` : <AuthorizationButton />}</div>
      <div>{`code: ${code}`}</div>
      <div>{configToString(broadcasterConfig)}</div>

      <br />

      <div>{auth && token ? <ConfigForm auth={auth} token={token} /> : `token is not found`}</div>
    </div>
  );
}

export default Config;
