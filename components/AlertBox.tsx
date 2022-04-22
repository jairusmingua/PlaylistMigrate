import { useRouter } from "next/router";
import { FunctionComponent, useState } from "react";
import { Alert } from "react-bootstrap";

const AlertBox: FunctionComponent = () => {
    const { query } = useRouter()
    const { status } = query
    let { message } = query
    const [show, setShow] = useState(message != null ? true : false);
    message = message == 'null'? 'Something Wen\'t Wrong' : message
    return (
        <>
            {
                show &&
                <Alert variant={status == 'SUCCESS' ? 'success' : 'warning'} onClose={() => setShow(false)} dismissible>
                    <strong>{status == 'SUCCESS' ? 'Great!' : 'Oh No!'}</strong> {message}
                </Alert>
            }
        </>
    );
}

export default AlertBox;