import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

const fbxLoader: FBXLoader = new FBXLoader()

// Load main character
function loadGuy(scene : any, mixer : any, animationActions : any, animationsFolder : any, animations : any, activeAction : any, modelReady : any) {
 
    fbxLoader.load(
    'models/kaya.fbx',
    (object) => {
        object.scale.set(0.01, 0.01, 0.01)
        mixer = new THREE.AnimationMixer(object)

        const animationAction = mixer.clipAction(
            (object as THREE.Object3D).animations[0]
        )
        animationActions.push(animationAction)
        animationsFolder.add(animations, 'default')
        activeAction = animationActions[0]

        scene.add(object)

        //add an animation from another file
        fbxLoader.load(
            'models/kayaWalkForward.fbx',
            (object) => {
                console.log('loaded walk forward')

                const animationAction = mixer.clipAction(
                    (object as THREE.Object3D).animations[0]
                )
                animationActions.push(animationAction)
                animationsFolder.add(animations, 'walking')

                //add an animation from another file
                fbxLoader.load(
                    'models/kayaJumping.fbx',
                    (object) => {
                        console.log('loaded jumping')
                        const animationAction = mixer.clipAction(
                            (object as THREE.Object3D).animations[0]
                        )
                        animationActions.push(animationAction)
                        animationsFolder.add(animations, 'jumping')

                        //add an animation from another file
                        fbxLoader.load(
                            'models/kayaSitting.fbx',
                            (object) => {
                                console.log('loaded sitting');
                                (object as THREE.Object3D).animations[0].tracks.shift() //delete the specific track that moves the object forward while running
                                //console.dir((object as THREE.Object3D).animations[0])
                                const animationAction = mixer.clipAction(
                                    (object as THREE.Object3D).animations[0]
                                )
                                animationActions.push(animationAction)
                                animationsFolder.add(animations, 'sitting')

                                modelReady = true
                            },
                            (xhr) => {
                                console.log(
                                    (xhr.loaded / xhr.total) * 100 + '% loaded'
                                )
                            },
                            (error) => {
                                console.log(error)
                            }
                        )
                    },
                    (xhr) => {
                        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                    },
                    (error) => {
                        console.log(error)
                    }
                )
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

}


export default loadGuy;