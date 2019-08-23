
/*jshint esversion: 6 */
// @ts-check

// these four lines fake out TypeScript into thinking that THREE
// has the same type as the T.js module, so things work for type checking
// type inferencing figures out that THREE has the same type as T
// and then I have to use T (not THREE) to avoid the "UMD Module" warning
/**  @type typeof import("./THREE/threets/index"); */
let T;
// @ts-ignore
T = THREE;

// get things we need
import { GrObject } from "./Framework/GrObject.js";
import { GrWorld } from "./Framework/GrWorld.js";

let world_size = 70;

export class GrRoad extends GrObject {
    constructor() {
        let roads = new T.Group();
        
        let roadgeom1 = new T.BoxGeometry( world_size*0.8,0.02,4 );
        let roadgeom2 = new T.BoxGeometry( 3,0.05,world_size*0.8 );
        let roadmesh = new T.MeshStandardMaterial({color:"#A9A9A9", metalness:0.9, roughness:0.8});
        let road1 = new T.Mesh(roadgeom1, roadmesh);
        let road2 = new T.Mesh(roadgeom1, roadmesh);
        let road3 = new T.Mesh(roadgeom2, roadmesh);
        let road4 = new T.Mesh(roadgeom2, roadmesh);
        roads.add(shift(road1 ,0,world_size/5));
        roads.add(shift(road2 ,0,-world_size/5));
        roads.add(shift(road3 ,world_size/5,0));
        roads.add(shift(road4 ,-world_size/5,0));
        super("Roads",roads);
    }
}

export class GrHeli extends GrObject {
    constructor() {
        let chop1 = new T.Group();
        let part1_geom = new T.BoxGeometry( 1.5, 1.2, 1 );
        let part1_mat = new T.MeshStandardMaterial({color:"#4b5320", metalness:0.5, roughness:0.8});
        let part1 = new T.Mesh(part1_geom, part1_mat);
        let part2_geom = new T.BoxGeometry( 1, 0.7, 1 );
        let part2 = new T.Mesh(part2_geom, part1_mat);
        let part3_geom = new T.BoxGeometry( 1.8, 0.5, 1 );
        let part3 = new T.Mesh(part3_geom, part1_mat);
        let rear_geom = new T.TorusGeometry( 0.5, 0.125, 16, 10 );
        let rear = new T.Mesh(rear_geom, part1_mat);
        let wholerear = new T.Group();
        let propeller_geom = new T.BoxGeometry( 0.15, 1, 0.15 );
        let propeller = new T.Mesh(propeller_geom, part1_mat);
        let propeller2_geom = new T.BoxGeometry( 4, 0.1, 0.3 );
        let propeller2 = new T.Mesh(propeller2_geom, part1_mat);
        wholerear.add(rear,propeller);
        part2.translateX(0.8);
        part2.translateY(-0.15);
        part3.translateX(-1.4);
        part3.translateY(-0.1);
        rear.translateX(-2.75);
        rear.translateY(0);
        propeller.translateX(-2.75);
        wholerear.translateY(0.1);
        propeller2.translateY(0.6);
        propeller.rotateOnAxis(new T.Vector3(0, 0, 1), Math.PI/2);
        chop1.add(part1,part2,part3,wholerear,propeller2);
        chop1.translateY(15);
        let scale = 1;
        chop1.scale.set(scale,scale,scale);
        // chop1.rotateY(Math.PI/2);
        super("Helicopter",chop1);
        this.chop = chop1;
        this.propeller2 = propeller2;
        this.propeller1 = propeller;
        this.timeCumu = 0;
        this.rideable = chop1;

    }

    advance(delta,timeOfDay) {
        this.timeCumu += 0.002*delta;
        let theta = this.timeCumu;
        let x = 10 * Math.cos(theta);
        let z = 10 * Math.sin(theta);
        this.propeller1.rotateOnAxis(new T.Vector3(0, 0, 1), -10);
        this.propeller2.rotateOnAxis(new T.Vector3(0, 1, 0), 10);
        this.chop.lookAt(new T.Vector3(0, 15, 0));
        this.chop.position.x = x;
        this.chop.position.z = z;
    }
}

let flagObCtr = 1;
export class GrFlag extends GrObject {
    /**
     * @param {GrWorld} world
     */
    constructor(world,cam_x=0,cam_z=0) {

        let flag = new T.Group();
        let camera2 = new T.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        flag.add(camera2);
        
        camera2.position.set(0,1,0); 
        var bufferTexture = new T.WebGLRenderTarget( 256, 256, { minFilter: T.LinearFilter, magFilter: T.NearestFilter});
        let screen = new T.Mesh(new T.PlaneGeometry(2,2), new T.MeshStandardMaterial({map:bufferTexture.texture}));
        flag.add(screen);
        //screen.rotateY(Math.PI/2);
        screen.translateY(2);
        let base_geom = new T.BoxGeometry( 0.5, 2, 0.5 );
		let base_mat = new T.MeshStandardMaterial({color:"white", metalness:0.5, roughness:0.2});
        let pole = new T.Mesh(base_geom, base_mat);
        flag.add(pole);
        flag.position.set(cam_x, 1, cam_z);
        super(`Flag-${flagObCtr++}`,flag);
        this.screen = screen;
        this.world = world;
        this.camera2 = camera2;
        this.bufferTexture = bufferTexture;
        this.flag = flag;
        this.cam_x = cam_x;
        this.cam_z = cam_z;
          
    }
    advance(delta,timeOfDay) {
        this.camera2.lookAt(-this.cam_x,0,-this.cam_z);
        this.world.renderer.render(this.world.scene, this.camera2, this.bufferTexture);
        this.screen.lookAt(this.world.camera.position);
    }
}



function shift(grobj,x,z,s=1) {
    grobj.translateX(x);
    grobj.translateZ(z);
    grobj.scale.set(s,s,s);
    return grobj;
}

