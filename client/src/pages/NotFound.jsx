import { Link } from "react-router-dom";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

function NotFound() {
  return (
    <div className="auth-layout">
      <div className="auth-layout__card">
        <Card>
          <h2>404</h2>
          <p className="text-muted">
            Halaman yang kamu cari tidak ditemukan.
          </p>

          <Link to="/login">
            <Button variant="primary">
              Kembali ke Login
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

export default NotFound;