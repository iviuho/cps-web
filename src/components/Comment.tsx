import * as moment from "moment";

import * as api from "../interfaces/api";

interface CommentProps {
  data: api.Comment;
}

function Comment({ data }: CommentProps) {
  return (
    <div>
      <div>{moment.utc(data.createdAt).local().format("YYYY/MM/DD A HH:mm")}</div>
      <div>
        {data.to.nickname}: {data.content}
      </div>
    </div>
  );
}

export default Comment;
