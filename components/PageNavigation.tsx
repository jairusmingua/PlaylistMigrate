import { User } from "@prisma/client";
import { signOut } from "next-auth/client";
import Image from 'next/image'
import { Navbar, NavDropdown, DropdownButton, Dropdown, Nav, Image as Img } from "react-bootstrap";

export default function PageNavigation({ user }: { user: User }) {
    return (
        <>
            <Navbar variant="dark" className="px-2 py-0">
                <Navbar.Brand href="/dashboard" className="justify-content-between align-items-center d-flex p-0 m-0">
                    <Image
                        src="/icon.svg"
                        width={20}
                        height={20}
                    />
                    <span className="p-2">
                        PlaylistMigrate
                    </span>
                </Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    <div className="d-flex justify-content-end gap-3 align-items-center">

                        {/* <Img src={user.image} fluid roundedCircle className="profilePic"></Img> */}

                        <DropdownButton
                            className="p-2"
                            title={user.name}
                            variant="secondary"
                            id="input-group-dropdown-1"
                            menuAlign="right"
                        >
                            <Dropdown.Item href="/settings">Settings</Dropdown.Item>
                            <Dropdown.Item href="#" onClick={() => signOut({
                                callbackUrl: process.env.NEXT_PUBLIC_BASE_URL
                            })}>Logout</Dropdown.Item>
                        </DropdownButton>

                    </div>
                </Navbar.Collapse>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

            </Navbar>
        </>
    )
}