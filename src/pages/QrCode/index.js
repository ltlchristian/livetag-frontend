import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import "./QrCode.css";
import QrCodegenerate from "../../components/QrCodeGenerate";

const QrCode = () => {

  let { idQrcode } = useParams();
  console.log(idQrcode);

  return (
    <Container>
        <QrCodegenerate idQrcode={idQrcode}/>
    </Container>
  );
};

export default QrCode;
