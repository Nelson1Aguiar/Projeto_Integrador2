import { useEffect, useRef } from 'react';
import './STLViewer.css';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai';
import PropTypes from 'prop-types';

const STLViewer = ({ stlData }) => {
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const rendererRef = useRef(null);
    const meshRef = useRef(null);
    const mountedRef = useRef(true);

    const initializeScene = () => {
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        scene.background = new THREE.Color(0xffffff);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        rendererRef.current = renderer;

        // Configuração de iluminação
        [5, -5].forEach(x => {
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(x, 5, 5);
            scene.add(light);
        });
        scene.add(new THREE.AmbientLight(0x404040, 1));

        // Controles de órbita
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controlsRef.current = controls;

        // Loop de animação controlado por mountedRef
        const animate = () => {
            if (!mountedRef.current) return;
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();
    };

    const loadSTLModel = (stlData) => {
        if (meshRef.current) {
            sceneRef.current.remove(meshRef.current);
            disposeMesh(meshRef.current);
        }

        const geometry = new STLLoader().parse(atob(stlData));
        geometry.computeBoundingBox();

        const center = new THREE.Vector3();
        geometry.boundingBox.getCenter(center);
        geometry.translate(-center.x, -center.y, -center.z);

        const mesh = new THREE.Mesh(
            geometry,
            new THREE.MeshStandardMaterial({ color: 0x777777 })
        );
        sceneRef.current.add(mesh);
        meshRef.current = mesh;

        adjustCameraPosition(geometry);
    };

    const adjustCameraPosition = (geometry) => {
        const size = new THREE.Vector3();
        geometry.boundingBox.getSize(size);
        const fov = THREE.MathUtils.degToRad(cameraRef.current.fov);
        const distance = Math.max(...size.toArray()) / (2 * Math.tan(fov / 2));
        cameraRef.current.position.set(0, 0, distance * 1.5);
        cameraRef.current.lookAt(0, 0, 0);
    };

    const disposeMesh = (mesh) => {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => m.dispose());
        } else {
            mesh.material.dispose();
        }
    };

    const cleanUpResources = () => {
        if (sceneRef.current) {
            sceneRef.current.traverse(child => {
                if (child.isMesh) disposeMesh(child);
            });
            sceneRef.current.clear();
        }
        if (controlsRef.current) controlsRef.current.dispose();
        if (rendererRef.current) rendererRef.current.dispose();
    };

    useEffect(() => {
        mountedRef.current = true;
        if (!rendererRef.current) initializeScene();
        if (stlData) loadSTLModel(stlData);

        return () => {
            mountedRef.current = false;
            cleanUpResources();
            sceneRef.current = null;
            cameraRef.current = null;
            controlsRef.current = null;
            rendererRef.current = null;
            meshRef.current = null;
        };
    }, [stlData]);

    const handleZoom = (factor) => () => {
        if (cameraRef.current) {
            cameraRef.current.zoom = THREE.MathUtils.clamp(
                cameraRef.current.zoom * factor,
                0.5,
                2.5
            );
            cameraRef.current.updateProjectionMatrix();
        }
    };

    return (
        <div className="mainContainerStl">
            <canvas className="renderElement" ref={canvasRef} />
            <div className="containerButtonsZoomStl">
                <button onClick={handleZoom(1.1)}>
                    <AiOutlineZoomIn size={20} color="#fff" />
                </button>
                <button onClick={handleZoom(1 / 1.1)}>
                    <AiOutlineZoomOut size={20} color="#fff" />
                </button>
            </div>
        </div>
    );
};

STLViewer.propTypes = {
    stlData: PropTypes.string.isRequired,
};

export default STLViewer;