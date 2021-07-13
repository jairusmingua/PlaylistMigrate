import { User } from "@prisma/client";
import { signOut } from "next-auth/client";
import Link from "next/link";
import { Navbar, NavDropdown, Nav, Image } from "react-bootstrap";

export default function PageNavigation({ user }: { user: User }) {
    return (<Navbar variant="dark">
        <Navbar.Brand href="/dashboard">
            <img
                alt=""
                src="/logo.svg"
                width="50"
                height="50"
                className="d-inline-block align-middle"
            />{' '}
            PlaylistMigrate
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
            <Image src={user.image} onClick={()=>signOut()} fluid roundedCircle className="profilePic"></Image>
        </Navbar.Collapse>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        {/* <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="me-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#link">Link</Nav.Link>
                <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                </NavDropdown>
            </Nav>
        </Navbar.Collapse> */}
    </Navbar>)
}