import { User } from "@prisma/client";
import { signOut } from "next-auth/client";
import Image from 'next/image'
import Link from "next/link";
import { Navbar, NavDropdown, DropdownButton, Dropdown, Nav, Image as Img } from "react-bootstrap";
import { useRef } from "react";
export default function PageNavigation({ user }: { user: User }) {
    const dropDownRef = useRef(0)
    return (
        <>
            <Navbar variant="dark" className="p-0">
                <Navbar.Brand href="/dashboard" className="justify-content-between align-items-center d-flex p-0 m-0">
                    <Image
                        src="/icon.svg"
                        width={50}
                        height={50}
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
                        >
                            <Dropdown.Item href="#" onClick={() => signOut()}>Logout</Dropdown.Item>
                        </DropdownButton>

                    </div>
                </Navbar.Collapse>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

            </Navbar>
        </>
    )
}