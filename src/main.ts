import './style.scss'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import seaVertexShader from './shaders/sea/vertex.glsl'
import seaFragmentShader from './shaders/sea/fragment.glsl'


// Debug
const gui = new dat.GUI({ width: 340 })

// Canvas
const canvas : any = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.PlaneBufferGeometry(4, 4, 512, 512)


// Materials
const material = new THREE.ShaderMaterial({
    vertexShader : seaVertexShader,
    fragmentShader : seaFragmentShader,
    uniforms: {
        uTime : {value : 0},

        uBigWaveElevation : {value : 0.4},
        uBigWaveFrequency : {value : new THREE.Vector3(3,0,1.5)},
        uBigWaveSpeed : {value : 0.8},

        uSmallWaveElevation : { value : 0.2},
        uSmallWaveFrequency : { value : 6},
        uSmallWaveSpeed     : { value : 0.6},
        uSmallWaveIterations : { value : 4},

        uColorSurface : { value : new THREE.Color('#ffffff')},
        uColorDepth : { value : new THREE.Color('#11aac7')},
        uColorOffset : {value: 0.8},
        uColorMultiplier : {value : 5.0}
    }
})

// Color 
const debugObject = {
    surfaceColor : '#ff00d8',
    depthColor   : '#22fdc9',
}

gui.add(material.uniforms.uBigWaveElevation, 'value').min(0).max(1).step(0.001).name('Big Wave Elevation')
gui.add(material.uniforms.uBigWaveFrequency.value, 'x').min(0).max(10).step(0.001).name('Big Wave Frequency X')
gui.add(material.uniforms.uBigWaveFrequency.value, 'z').min(0).max(10).step(0.001).name('Big Wave Frequency Z')
gui.add(material.uniforms.uBigWaveSpeed, 'value').min(0).max(4).step(0.1).name('Big Wave Speed')

gui.add(material.uniforms.uSmallWaveElevation, 'value').min(0).max(1).step(0.001).name('Small Wave Elevation')
gui.add(material.uniforms.uSmallWaveFrequency, 'value').min(0).max(30).step(0.001).name('Small Wave Frequency')
gui.add(material.uniforms.uSmallWaveSpeed, 'value').min(0).max(4).step(0.001).name('Small Wave Speed')
gui.add(material.uniforms.uSmallWaveIterations, 'value').min(0).max(8).step(1).name('Small Wave Iterations')


gui.addColor(debugObject,'surfaceColor').name("Surface Color").onChange(() => material.uniforms.uColorSurface.value.set(debugObject.surfaceColor))
gui.addColor(debugObject,'depthColor').name("Depth Color").onChange(() => material.uniforms.uColorDepth.value.set(debugObject.depthColor))
// gui.add(material.uniforms.uColorOffset,'value').min(0).max(2.0).step(0.01).name('Color Offset')
// gui.add(material.uniforms.uColorMultiplier,'value').min(1).max(20).step(0.1).name('Color Multiplier')


// Mesh
const mesh = new THREE.Mesh(geometry, material)
mesh.rotation.x = - Math.PI * 0.5
scene.add(mesh)

/**
 * Dat GUI
 */
// Set wireframe : true on material first

// let planeSegments = {
//     widthSegments  : geometry.parameters.widthSegments,
//     heightSegments : geometry.parameters.heightSegments,
// }
// function regeneratePlaneGeometry() {
//     let newGeometry = new THREE.PlaneBufferGeometry(2, 2, planeSegments.widthSegments, planeSegments.heightSegments)
//     mesh.geometry.dispose()
//     mesh.geometry = newGeometry
// }
// gui.add(planeSegments, 'widthSegments').min(0).max(512).step(2).onChange(regeneratePlaneGeometry)
// gui.add(planeSegments, 'heightSegments').min(0).max(512).step(2).onChange(regeneratePlaneGeometry)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 3, 2.2)
scene.add(camera)

// gui.add(camera.position, 'x').min(0).max(10).step(0.01)
// gui.add(camera.position, 'y').min(0).max(10).step(0.01)
// gui.add(camera.position, 'z').min(0).max(10).step(0.01)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update sea waves 
    material.uniforms.uTime.value = elapsedTime
    

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()