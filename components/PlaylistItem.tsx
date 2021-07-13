import { Row, Col, Container, Media, Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Playlist } from '@prisma/client';

export default function PlaylistItem({ item }: {item:Playlist}) {

    return (
        <div className="m-2" style={{backgroundColor:"black",borderRadius:"20px",padding:"5px" }}>

        <div className="d-flex flex-column m-3" style={{ width: "150px"}}>
            <img src={item.image} key={item.id} height="150vw" width="150vw" style={{ borderRadius: "20px" }} />
            <div className="d-flex flex-column">
                <b>{item.title}</b>
                {/* <span>{item.description}</span> */}
            </div>
        </div>
        </div>
        // <Card style={{width:"20vw"}}>
        //     <Card.Img src={item.image}/>
        //     <Card.Body>
        //         <Card.Title>{item.title}</Card.Title>
        //     </Card.Body>
        // </Card>
    )
}
