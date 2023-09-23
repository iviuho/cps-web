import qs from "qs";

// 추후에 백엔드에서 redirect uri 받아오기
const BASE_URL = "https://id.twitch.tv/oauth2/authorize";
const QUERY = qs.stringify(
  {
    client_id: "ydvoimm1fy8ps5h21oxx9hmocdaaey",
    force_verify: false,
    redirect_uri: "http://localhost:3001/redirect",
    response_type: "code",
    scope: "channel:read:redemptions"
  },
  { addQueryPrefix: true }
);

function AuthorizationButton() {
  const handler = () => {
    window.open(BASE_URL + QUERY, "redirect");
  };

  return (
    <div>
      <button onClick={handler}>Go to give permissions</button>
    </div>
  );
}

export default AuthorizationButton;
