console.log("raw.js starts. >>>>>>>>");

import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.8.5/+esm'
import normals from 'https://cdn.jsdelivr.net/npm/angle-normals@1.0.0/+esm'


{
    const container = document.getElementById('brain-container') || document.body.appendChild(document.createElement('div'));

    let cube, camera, renderer, brainMesh, scene, stats, aparcSpheres, texts;
    let meter2centimeter = d3.scaleLinear().domain([0, 1]).range([0, 100])

    d3.csv('asset/fsaverage/glass-cells.csv').then((cells) => {
        d3.csv('asset/fsaverage/glass-vertices.csv').then((vertices) => {
            main(cells, vertices)

            d3.json('asset/fsaverage/aparc.json').then((aparcRaw) => {

                let name, color, xyz, buffer = [];

                for (let i in aparcRaw.name) {
                    name = aparcRaw.name[i]
                    color = aparcRaw.color[i]
                    xyz = aparcRaw.xyz[i]

                    // ! The xyz map is correct, x:0, y:2, z:1
                    buffer.push({ i, name, color, x: meter2centimeter(xyz[0]), y: meter2centimeter(xyz[2]), z: meter2centimeter(xyz[1]) })
                }

                appendSpheres(buffer)
            })

            d3.csv('asset/montage/sensor.csv').then((sensors) => {
                sensors.map(sensor => {
                    Object.assign(sensor, { color: '#ffffff', x: meter2centimeter(sensor.x), y: meter2centimeter(sensor.z), z: meter2centimeter(sensor.y) })
                })
                appendSpheres(sensors)
                console.log(sensors)

                let loader = new FontLoader();

                loader.load(
                    // resource URL
                    'https://unpkg.com/three@0.158.0/examples/fonts/helvetiker_regular.typeface.json',

                    // onLoad callback
                    function (font) {
                        // do something with the font
                        console.log(font);
                        appendTexts(sensors, font)
                    },

                    // onProgress callback
                    function (xhr) {
                        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                    },

                    // onError callback
                    function (err) {
                        console.log('An error happened');
                    }
                );

            })


        })
    })

    /**
     * Append spheres to the scene based on the buffer.
     * @param {Array} buffer The buffer of {name, color, x, y, z}
     */
    let appendSpheres = (buffer) => {

        let geometry, material, mesh, opacity = 0.8, size = 0.1, transparent = true, flatShading = true;
        aparcSpheres = buffer.map(({ name, color, x, y, z }) => {
            material = new THREE.MeshPhongMaterial({
                color, opacity, transparent, flatShading
            })
            geometry = new THREE.SphereGeometry(size, 20)
            mesh = new THREE.Mesh(geometry, material)

            Object.assign(mesh.position, { x, y, z })
            return mesh
        })

        aparcSpheres.map(mesh => {
            scene.add(mesh)
        })

    }

    let appendTexts = (buffer, font) => {
        let geometry, material, mesh;
        texts = buffer.map(({ name, color, x, y, z }) => {
            geometry = new TextGeometry(name, {
                font,
                size: 0.5,
                height: 0.1,
            }),
                material = new THREE.MeshPhongMaterial({ color }),
                mesh = new THREE.Mesh(geometry, material);

            Object.assign(mesh.position, { x, y, z })
            scene.add(mesh)
            return mesh
        })
    }


    let main = (cells, vertices) => {
        let brainModel = mkBrainModel(cells, vertices),
            geometry = mkGeometry(mkVertices(brainModel));

        brainMesh = mkBrainMesh(geometry);

        init();

        scene.add(brainMesh);

        stats = new Stats();
        Object.assign(stats.dom.style, { position: 'relative' });
        container.appendChild(stats.dom);

        container.appendChild(renderer.domElement)

        let render = () => {
            if (texts) {
                texts.map(text => { text ? text.lookAt(camera.position) : false })
            }
            renderer.render(scene, camera)
        }

        let animate = () => {
            requestAnimationFrame(animate)
            cube.rotation.z += 0.01;
            cube.rotation.y += 0.01;
            render()
            stats.update()
        }

        animate()

        window.addEventListener("resize", onWindowResize);
        onWindowResize();
    }

    let getContainerSize = () => {
        const w = container.clientWidth,
            h = container.clientHeight;
        return { w, h }
    }

    let onWindowResize = () => {
        const { w, h } = getContainerSize();

        renderer.setSize(w, h);

        camera.left = w / -2;
        camera.right = w / 2;
        camera.top = h / 2;
        camera.bottom = h / -2;
        camera.aspect = w / h;

        camera.updateProjectionMatrix();
    }

    let init = () => {
        {
            let material = new THREE.MeshNormalMaterial(),
                geometry = new THREE.BoxGeometry(1, 1, 1);
            cube = new THREE.Mesh(geometry, material);
            cube.position.y = 0; // -10;
            cube.position.x = 0; // 20;
            cube.position.z = 0; // 20;
        }

        {
            let { w, h } = getContainerSize(),
                fov = 45,
                aspect = w / h,
                near = 0.1,
                far = 200;
            camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
            camera.position.set(25, 25, -25);
            camera.lookAt(new THREE.Vector3(0, 0, 0));
        }

        {
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
            let { w, h } = getContainerSize(),
                controls = new OrbitControls(camera, renderer.domElement);
            renderer.setSize(w, h);
            renderer.setPixelRatio(devicePixelRatio);
            // controls.addEventListener("change", () => renderer.render(scene, camera));
        }

        {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x001b42);
            scene.add(cube);

            let color = 0xffffff,
                intensity = 1,
                light = new THREE.AmbientLight(color, intensity);
            scene.add(light);

            let size = 40,
                divisions = 2,
                helper = new THREE.GridHelper(size, divisions, 0xa4cab6, 0x7a7374);
            helper.position.y = -10;
            scene.add(helper);

        }
    }


    let mkBrainMesh = (brainGeometry) => {
        let material = new THREE.MeshPhongMaterial({
            color: "hsl(0,100%,100%)",
            opacity: 0.1,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        return new THREE.Mesh(brainGeometry, material);
    }


    let mkBrainModel = (cells, vertices) => {
        let scaler = 0.19;

        const _cells = cells.map((e) => [
            parseInt(e.v2),
            parseInt(e.v1),
            parseInt(e.v0)
        ]);

        const positions = vertices.map((e) => [
            parseFloat(e.z * scaler - 8.5),
            parseFloat(e.x * scaler - 6.8),
            parseFloat(e.y * scaler - 12)
        ]);

        const colors = cells.map(() => [0.4, 0.4, 0.4, 0.5]);

        return { cells: _cells, positions, colors };
    }

    let mkVertices = (meshModel) => {
        const vertices = [];

        let { positions, cells } = meshModel,
            norms = normals(cells, positions),
            uv3 = [
                [0, 0],
                [0, 1],
                [1, 0]
            ];

        let pos, norm, uv;
        for (let cell of cells) {
            for (let i = 0; i < 3; i++) {
                pos = positions[cell[i]];
                norm = norms[cell[i]];
                uv = uv3[i];
                vertices.push({ pos, norm, uv });
            }
        }

        return vertices;
    }

    let mkGeometry = (vertices) => {
        const geometry = new THREE.BufferGeometry();

        var positions = [],
            normals = [],
            uvs = [],
            positionNumComponents = 3,
            normalNumComponents = 3,
            uvNumComponents = 2;

        for (let vertex of vertices) {
            positions.push(...vertex.pos);
            normals.push(...vertex.norm);
            uvs.push(...vertex.uv);
        }

        const positionAttr = new THREE.BufferAttribute(
            new Float32Array(positions),
            positionNumComponents
        );
        const normalAttr = new THREE.BufferAttribute(
            new Float32Array(normals),
            normalNumComponents
        );
        const uvAttr = new THREE.BufferAttribute(
            new Float32Array(uvs),
            uvNumComponents
        );

        geometry.setAttribute("position", positionAttr);
        geometry.setAttribute("normal", normalAttr);
        geometry.setAttribute("uv", uvAttr);

        return geometry;
    }
}

console.log("<<<<<<<< raw.js finishes.");
