import { useGSAP } from '@gsap/react'
import ModelView from './ModelView'
import { useRef, useState } from 'react';
import { yellowImg } from '../utils';
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';
import { models, sizes } from '../constants';
import gsap from 'gsap';



const defaultModel = {
    title: "iPhone 15 Pro in Natural Titanium",
    color: ["#8F8A81", "#ffe7b9", "#6f6c64"],
    img: yellowImg,
}

const Model = () => {

    const [size, setSize] = useState("small")
    const [model, setModel] = useState(defaultModel)


    // Camera control for the model view
    const cameraControlSmall = useRef()
    const cameraControlLarge = useRef()

    //NModels
    const small = useRef(new THREE.Group())
    const large = useRef(new THREE.Group())

    //rotation for the model

    const [smallRotation, setSmallRotation] = useState();
    const [largeRotation, setLargeRotation] = useState();


    useGSAP(() => {
        gsap.to("#heading", {
            y: 0,
            opacity: 1,
        })
    }, [])
    return (
        <section className='common-padding'>
            <div className="screen-max-width">
                <h1 id="heading" className="section-heading">Take a closer look.</h1>
                <div className="flex flex-col items-center mt-5">
                    <div className="w-full h-[75vh] md:h-[90vh] overflow-hidden relative">
                        <ModelView
                            index={1}
                            groupRef={small}
                            gsapType="view1"
                            controlRef={cameraControlSmall}
                            setRotationState={setSmallRotation}
                            item={model}
                            size={size}
                        />
                        <ModelView
                            index={2}
                            groupRef={large}
                            gsapType="view2"
                            controlRef={cameraControlLarge}
                            setRotationState={setLargeRotation}
                            item={model}
                            size={size}
                        />

                        <Canvas
                            className='size-full'
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                overflow: 'hidden',
                            }}
                            eventSource={document.getElementById('root') || undefined}
                        >
                            <View.Port>

                            </View.Port>
                        </Canvas>
                    </div>
                    <div className='mx-auto w-full'>
                        <p className='text-sm text-center font-light mb-5'>{model.title}</p>
                        <div className="flex-center">
                            <ul className="color-container">
                                {models.map((item, i) => (
                                    <li
                                        key={i}
                                        onClick={() => setModel(item)}
                                        className={`size-6 rounded-full mx-2 cursor-pointer`}
                                        style={{
                                            backgroundColor: item.color[0],
                                        }}
                                        />
                                ))}
                            </ul>
                            <button className="size-btn-container">
                                {sizes.map(({ label, value }) => (
                                    <span
                                        key={label}
                                        className='size-btn'
                                        onClick={() => setSize(value)}
                                        style={{
                                            backgroundColor: value === size ? 'white' : 'transparent',
                                            color: value === size ? 'black' : 'white',
                                        }}
                                    >
                                        {label}
                                    </span>
                                ))}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Model
