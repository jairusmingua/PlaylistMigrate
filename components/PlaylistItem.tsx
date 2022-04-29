import { Row, Col, Container, Media, Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Account, Playlist } from '@prisma/client';
import { platformProviderMap, UIImg } from '../@client/types';

export default function PlaylistItem({ item, account }: { item: Playlist & { Playlist: Playlist, playlistOrigin: Playlist[] }, account: Account }) {

    return (
        <>
            <Link href={`/playlist/${account.providerId}/${item.external_id}`}>
                <div className="playlistCard" style={{ backgroundColor: "black", borderRadius: "20px", padding: "20px" }}>
                    <div className="d-flex flex-column">
                        <img src={item.image} key={item.id} style={{ borderRadius: "20px", padding: "2%", width: "100%", aspectRatio: "1", objectFit: 'cover' }} />
                        <div className="d-flex flex-column">
                            <b className="playlistCardText">{item.title}</b>
                            <div className="d-flex justify-content-end">
                                {
                                    item.playlistOrigin &&
                                    <>
                                        {
                                            item?.playlistOrigin.length != 0 ?
                                                <>
                                                    {

                                                        item.playlistOrigin.map((p) =>
                                                            <img src={UIImg[platformProviderMap[p.platform]]} alt={item.title} height={20} width={20} />

                                                        )
                                                    }
                                                </> :
                                                <>
                                                    <div style={{ height: "20px" }}>

                                                    </div>
                                                </>
                                        }
                                    </>
                                }
                                {
                                    item.Playlist ?

                                        <img src={UIImg[platformProviderMap[item.Playlist.platform]]} alt={item.Playlist.title} height={20} width={20} />
                                        :
                                        <div style={{ height: "20px" }}>

                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    )
}
