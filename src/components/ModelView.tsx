import { Html, OrbitControls, PerspectiveCamera, View } from "@react-three/drei"
import Lights from "./Lights"
import { Suspense } from "react"
import { Iphone } from "./Iphone"
import * as THREE from 'three'

type Props = {
  index: number,
  groupRef: any,
  gsapType: string,
  controlRef: any,
  setRotationState: any,
  item: any,
  size: string,
}

const ModelView = (props: Props) => {
  const { index, groupRef, gsapType, controlRef, setRotationState, item, size } = props

  return (
    <View id={gsapType} index={index} ref={groupRef} className={`"model-view size-full ${index === 2 ? 'right-[-100%]' : ''}`}>
      <ambientLight intensity={0.3} />
      <PerspectiveCamera makeDefault position={[0, 0, 4]} />
      <Lights />

      <OrbitControls
        makeDefault
        ref={controlRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        target={new THREE.Vector3(0, 0, 0)}
        onEnd={()=> setRotationState(controlRef.current.getAzimuthAngle())}
      />

      <group ref={groupRef} name={`${index === 1 ? 'small' : 'large'}`} position={[0, 0, 0]}>

        <Suspense fallback={<Html><div>Loading...</div></Html>}>
          <Iphone
            scale={index === 1 ? [15,15,15] : [17,17,17]}
            item={item}
            size={size}
          />
        </Suspense>
      </group>


    </View>
  )
}

export default ModelView
