import { Link } from "react-router-dom";

function Header() {
  return (
    <div>
      <Link to="index">
        <button>Index</button>
      </Link>

      <Link to="config">
        <button>Config</button>
      </Link>
    </div>
  );
}

export default Header;
