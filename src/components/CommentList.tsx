import { useEffect, useState } from "react";
import axios from "axios";

import { API } from "../config";
import { Comment as CommentResponse } from "../interfaces/api";
import Comment from "./Comment";
import Loading from "./Loading";

function CommentList() {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Twitch.ext.Authorized>();
  const [comments, setComments] = useState<CommentResponse[]>();

  useEffect(() => {
    window.Twitch.ext.onAuthorized(auth => setAuth(auth));
  }, []);

  useEffect(() => {
    if (auth) {
      setLoading(true);
      axios
        .get<CommentResponse[]>(`${API}/comment`, {
          params: { to: auth.channelId }
        })
        .then(v => setComments(v.data))
        .then(() => setLoading(false))
        .catch(err => console.error(err));
    }
  }, [auth]);

  return loading ? (
    <Loading />
  ) : (
    <div>
      {comments
        ? comments.map((comment, index) => <Comment data={comment} key={index} />)
        : "아직 코멘트가 하나도 없습니다!"}
    </div>
  );
}

export default CommentList;
