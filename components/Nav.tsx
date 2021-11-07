import { Navbar, Container, Button } from 'react-bootstrap';

function Nav() {
    return (
        <>

            <div className="w-100 py-5 px-5">

                <div className="d-flex justify-content-between">
                    <img
                        src={"logo.svg"}
                        style={{width:"40vw",maxWidth:"250px"}}
                        className="d-inline-block align-top"
                    />
                    <div className="login-btn">
                        <a href="/login">
                            <Button variant="info">Login</Button>
                        </a>
                    </div>
                </div>
            </div>
            <style jsx>
                {`
                .login-btn{
                    width: 100px !important;
                }
                `}
            </style>

        </>)
}

export default Nav