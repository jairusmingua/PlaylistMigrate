import { Row, Col, Container, Media, Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Account, Playlist } from '@prisma/client';
import { platformProviderMap, UIImg } from '../@client/types';

export default function PlaylistItem({ item }: { item: Playlist & { Playlist: Playlist, playlistOrigin: Playlist[] } }) {

    return (
        <>
            <Link href={`/playlist/${platformProviderMap[item.platform]}/${item.external_id}`}>
                <div className="playlistCard" style={{ backgroundColor: "black", borderRadius: "20px", padding: "20px" }}>
                    <div className="d-flex flex-column">
                        {
                            (item.image == 'https://i.ytimg.com/img/no_thumbnail.jpg' || item.image == null) ?
                            <img src={'/icon.png'} key={item.id} style={{ borderRadius: "20px", padding: "30%", width: "100%", aspectRatio: "1", objectFit: 'cover' }} />:
                            <img src={item.image} key={item.id} style={{ borderRadius: "20px", padding: "2%", width: "100%", aspectRatio: "1", objectFit: 'cover' }} />
                        }
                        <div className="d-flex flex-column">
                            <b className="playlistCardText">{item.title}</b>
                            <div className="d-flex justify-content-end gap-3">
                                {
                                    item.playlistOrigin &&
                                    <>
                                        {
                                            item?.playlistOrigin.length != 0 &&
                                            <>
                                                {

                                                    item.playlistOrigin.map((p) =>
                                                        <img src={UIImg[platformProviderMap[p.platform]]} alt={item.title} height={20} width={20} />

                                                    )
                                                }
                                            </>
                                        }
                                    </>
                                }
                                <img src={UIImg[platformProviderMap[item.platform]]} alt={item.title} height={20} width={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    )
}
