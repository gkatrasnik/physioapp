import { Spinner } from "react-bootstrap";
import "../../custom.scss";
function LoadingModal() {
  return <Spinner animation="border" className="spinner" />;
}

export default LoadingModal;