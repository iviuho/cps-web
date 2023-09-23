import { useEffect, useState } from "react";
import { ApiClient, HelixCustomReward } from "@twurple/api";
import { StaticAuthProvider } from "@twurple/auth";
import axios from "axios";
import Select from "react-select";
import type { Option, SingleValue } from "react-select";

import { UserAccessToken } from "../interfaces/api";
import { API, VERSION } from "../config";

interface ConfigFormProps {
  auth: Twitch.ext.Authorized;
  token: UserAccessToken;
}

function ConfigForm({ auth, token }: ConfigFormProps) {
  const [rewards, setRewards] = useState<HelixCustomReward[]>();
  const [value, setValue] = useState<SingleValue<Option>>(null);
  const [options, setOptions] = useState<Option[]>();

  useEffect(() => {
    setOptions(
      Array(3)
        .fill(null)
        .map((v, i) => ({ label: "test" + i, value: "test" + i } as Option))
    );
  }, []);

  useEffect(() => {
    if (rewards) {
      setOptions(
        rewards.map(
          reward => ({ label: `${reward.title}(${reward.cost})`, value: reward.id } as Option)
        )
      );
    }
  }, [rewards]);

  useEffect(() => {
    if (auth && token) {
      new ApiClient({
        authProvider: new StaticAuthProvider(auth.clientId, token.token)
      }).channelPoints
        .getCustomRewards(auth.channelId)
        .then(rewards => setRewards(rewards))
        .catch(err => console.error(err));
    }
  }, [auth, token]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    if (value) {
      console.log(value);
      Twitch.ext.configuration.set("broadcaster", VERSION, value.value);

      const data = {
        type: "channel.channel_points_custom_reward_redemption.add",
        condition: {
          broadcasterId: auth.channelId,
          rewardId: value.value
        }
      };

      axios
        .post(`${API}/eventsub`, data, {
          headers: { Authorization: `Bearer ${auth.token}` }
        })
        .then(v => {
          window.alert(`요청 성공`);
          console.log(v.data);
        })
        .catch(err => {
          window.alert(`요청 실패`);
          console.error(err);
        });
    }

    e.preventDefault();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Select options={options} value={value} onChange={setValue} />
        <button>제출</button>
      </form>
    </div>
  );
}

export default ConfigForm;
