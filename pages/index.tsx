import { Suspense } from 'react'
import { signOut, useSession, getSession } from 'next-auth/client'
import { Canvas, extend } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Navbar, Container, Button } from 'react-bootstrap'
import { GetServerSideProps } from "next";

import Nav from '../components/Nav';
import { Footer } from '../components/Footer';
import Head from 'next/head'

extend({ OrbitControls });

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

  const session = await getSession({ req });
  if (session) {
    res.statusCode = 302
    res.setHeader('Location', `/dashboard`)
    return { props: {} }
  }

  return { props: {} }

};


function Home({ props }) {
  function Hero() {
    const gltf = useGLTF('./cellphone.glb', true);
    return (
      <primitive object={gltf.scene} scale={1.7} rotation={[0, Math.PI / -3, Math.PI / 20]} />
    )
  }
  return (
    <>
      <Head>
        <title>PlayistMigrate</title>
      </Head>
      <div className="container-fluid m-0 p-0">
        <Nav></Nav>
        <section className="p-5 section-1">
          <div className="row">
            <div className="col col-sm-12 col-md-6 d-none d-md-block">
              <div className="d-flex justify-content-center">
                <div className="hero-3d-container">
                  <Canvas>
                    <Suspense fallback={null}>
                      <ambientLight intensity={0.5} />
                      <directionalLight color="white" position={[0, 0, 5]} />
                      <OrbitControls enableZoom={false} addEventListener={undefined} hasEventListener={undefined} removeEventListener={undefined} dispatchEvent={undefined}></OrbitControls>
                      <Hero />
                    </Suspense>
                  </Canvas>
                </div>
                <img className="hero-ornament" src={"hero-ornaments.png"} width="500" />
              </div>
            </div>
            <div className="col d-flex align-items-center" >
              <div>
                <div className="d-flex flex-column migrate-text" style={{ position: "relative", zIndex: 1000 }}>
                  <h1>Migrate your
                    playlist<br />anywhere</h1>
                  <div className="get-started-btn">
                    <a href="/login">
                      <Button variant="primary">Get Started</Button>
                    </a>
                  </div>
                  <div className="d-block d-md-none p-0 m-0" style={{ height: "50vw" }}></div>
                </div>
                <img className="hero-ornament d-block d-md-none " style={{ top: "-73px", left: "-45px", width: "100vw" }} src={"hero-ornaments.png"} />
              </div>
            </div>
          </div>
        </section>
        <section className="p-5 section-2">
          <div className="row d-flex justify-content-center">
            <div className="col-md-6 col-12 d-flex align-items-center">
              <div className="d-flex align-items-end flex-column">
                <img src={"playlist.png"} className="d-block d-md-none" style={{ width: "100%" }} />
                <div className="d-flex flex-column text-right pl-3">
                  <h2>Have a playlist on other platform?</h2>
                  <p>Swithching from other music platforms is such a hassle, you either start fresh or recreate your playlist from scratch. <b>PlaylistMigrate</b> helps you solve that problem. </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-12">
              <img src={"playlist.png"} className="d-none d-md-block" style={{ width: "100%" }} />
            </div>
          </div>
        </section>
        <section className="p-5 section-3">
          <div className="row d-flex justify-content-center">
            <div className="col-md-6 col-12 d-flex justify-content-center">
              <img src={"spotify-youtube.png"} className="d-none d-md-block" style={{ height: "200px" }} />
            </div>
            <div className="col-md-4 col-12 d-flex align-items-center">
              <div className="d-flex align-items-start flex-column">
                <img src={"spotify-youtube-row.png"} className="d-block d-md-none pb-5" style={{ width: "200px" }} />
                <div className="d-flex flex-column pb-5">
                  <h2>Supports multiple streaming platforms.</h2>
                  <p>We keep our best to match exactly your playlist as we frequently update our song database as with our crowd-source approach of music discovery.</p>
                  <p>PlaylistMIgrate targets to support more streaming sites as much as possible to let you enjoy your playlist anywhere!</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="p-5 section-4">
          <div className="container">
            <div className="d-flex align-items-start flex-column">
              <div className="d-flex flex-column py-5">
                <h1>Try Now For Free</h1>
                <p>Enjoy hassle-free playlist migration from other streaming platform
                  for free. Discover and Share playlist from the community.</p>
                <div className="get-started-btn">
                  <a href="/login">
                    <Button variant="primary">Signup Now</Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
        <style jsx>{
          `
        .section-1{
          height:70vh;
        }
        .section-2{
          background: linear-gradient(104.42deg, #A9DBFF -1.44%, #7B61FF 67.75%);
          color:black;
        }
        .section-3{
          background: linear-gradient(269.77deg, rgba(19, 25, 19, 0) -3.81%, rgba(0, 0, 0, 0.53) 89.36%);
        }
        .section-4{
    
          background: linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url('listening.jpg');
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
          height: 60vh;
          
        }
        .migrate-text{
          position: relative;
          z-index: 1000;
        }
        .hero-ornament{
          position:absolute;
        }
        .hero-3d-container{
          height: 35vw;
          width: 50vw;
          position: relative;
          z-index: 1000;
        }
        h1{
          font-weight:900;
        }
        h2{
          font-weight:900;
        }
        .get-started-btn{
          width: 200px !important;
        }
        
        `
        }
        </style>
      </div>
    </>
  )

}


export default Home