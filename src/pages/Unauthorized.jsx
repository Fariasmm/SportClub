import { Link } from "react-router-dom";
import {Alert, Button, Container} from "react-bootstrap";

function Unauthorized() {
    return (
        <Container className="mt-5">
            <Alert variant="danger">
                <Alert.Heading>Acceso Denegado</Alert.Heading>
                <p>tu no puede entrar aqui</p>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button variant="outline-danger" as={link} to="/">devuelvete</Button>
                </div>
            </Alert>
        </Container>
    );
}

export default Unauthorized;