import { Row, Col, Container, Media, Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Playlist } from '@prisma/client';

export default function PlaylistItem({ item }: { item: Playlist }) {

    return (
        <div style={{ backgroundColor: "black", borderRadius: "20px", padding: "20px" }}>
            <div className="d-flex flex-column">
                <img src={item.image} key={item.id} style={{ borderRadius: "20px", padding: "2%", width: "100%", aspectRatio: "1" }} />
                <div className="d-flex flex-column">
                    <b>{item.title}</b>
                </div>
            </div>
        </div>
    )
}
