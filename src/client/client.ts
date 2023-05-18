
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'
//import { Sky } from 'three/addons/objects/Sky.js';

let sky, sun;
const scene = new THREE.Scene()
const clock = new THREE.Clock()


scene.add(new THREE.AxesHelper(5))

const light = new THREE.PointLight()
light.position.set(2.5, 7.5, 15)
scene.add(light)


/*
function initSky() {

    // Add Sky
    sky = new Sky();
    sky.scale.setScalar( 450000 );
    scene.add( sky );

    sun = new THREE.Vector3();

    /// GUI

    const effectController = {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
        elevation: 2,
        azimuth: 180,
        exposure: renderer.toneMappingExposure
    };

    function guiChanged() {

        const uniforms = sky.material.uniforms;
        uniforms[ 'turbidity' ].value = effectController.turbidity;
        uniforms[ 'rayleigh' ].value = effectController.rayleigh;
        uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
        uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

        const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
        const theta = THREE.MathUtils.degToRad( effectController.azimuth );

        sun.setFromSphericalCoords( 1, phi, theta );

        uniforms[ 'sunPosition' ].value.copy( sun );

        renderer.toneMappingExposure = effectController.exposure;
        renderer.render( scene, camera );

    }

    const gui = new GUI();

    gui.add( effectController, 'turbidity', 0.0, 20.0, 0.1 ).onChange( guiChanged );
    gui.add( effectController, 'rayleigh', 0.0, 4, 0.001 ).onChange( guiChanged );
    gui.add( effectController, 'mieCoefficient', 0.0, 0.1, 0.001 ).onChange( guiChanged );
    gui.add( effectController, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( guiChanged );
    gui.add( effectController, 'elevation', 0, 90, 0.1 ).onChange( guiChanged );
    gui.add( effectController, 'azimuth', - 180, 180, 0.1 ).onChange( guiChanged );
    gui.add( effectController, 'exposure', 0, 1, 0.0001 ).onChange( guiChanged );

    guiChanged();

}
*/

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(0.8, 1.4, 1.0)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 1, 0)

let mixer: THREE.AnimationMixer
let modelReady = false
const animationActions: THREE.AnimationAction[] = []
let activeAction: THREE.AnimationAction
let lastAction: THREE.AnimationAction
const fbxLoader: FBXLoader = new FBXLoader()

const gui = new GUI()
const animationsFolder = gui.addFolder('Animations')
animationsFolder.open()
const groundFolder = gui.addFolder('GroundType')
groundFolder.open()

// Loadguy
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


//  Load car
/*
fbxLoader.load(
    'models/NeuroBrain.fbx',
    (car) => {
        car.scale.set(0.005, 0.005, 0.005)
        car.position.set(0.0,0.35,0.0)
        
        scene.add(car)  
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)
*/

// Load surface world
function createGround() {
 //   const groundGeo = new THREE.PlaneGeometry(1000,1000, sliders.widthSeg, sliders.heightSeg)
}


window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

//initSky();

const stats = Stats()
document.body.appendChild(stats.dom)

const animations = {
    default: function () {
        setAction(animationActions[0])
    },
    walking: function () {
        setAction(animationActions[1])
    },
    jumping: function () {
        setAction(animationActions[2])
    },
    sitting: function () {
        setAction(animationActions[3])
    }
}



const setAction = (toAction: THREE.AnimationAction) => {
    if (toAction != activeAction) {
        lastAction = activeAction
        activeAction = toAction
        //lastAction.stop()
        lastAction.fadeOut(1)
        activeAction.reset()
        activeAction.fadeIn(1)
        activeAction.play()
    }
}





function animate() {
    requestAnimationFrame(animate)

    controls.update()

    if (modelReady) mixer.update(clock.getDelta())

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()