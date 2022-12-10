import { Spinner } from "react-bootstrap";
import "../../custom.scss";
function LoadingModal() {
  return <Spinner animation="grow" className="spinner" />;
}

export default LoadingModal;