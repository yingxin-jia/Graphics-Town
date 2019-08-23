/*jshint esversion: 6 */
// @ts-check

/**
 * Graphics Town Framework - "Main" File
 * 
 * This is the main file - it creates the world, populates it with 
 * objects and behaviors, and starts things running
 * 
 * The initial distributed version has a pretty empty world.
 * There are a few simple objects thrown in as examples.
 * 
 * It is the students job to extend this by defining new object types
 * (in other files), then loading those files as modules, and using this
 * file to instantiate those objects in the world.
 */

// these four lines fake out TypeScript into thinking that THREE
// has the same type as the T.js module, so things work for type checking
// type inferencing figures out that THREE has the same type as T
// and then I have to use T (not THREE) to avoid the "UMD Module" warning
/**  @type typeof import("./THREE/threets/index"); */
let T;
// @ts-ignore
T = THREE;

import { GrWorld } from "./Framework/GrWorld.js";
import {GrObject } from "./Framework/GrObject.js";  // only for typing
import * as Helpers from "./Libs/helpers.js";
import { WorldUI } from "./Framework/WorldUI.js";
import {shaderMaterial} from "./Framework/shaderHelper.js";
import * as SimpleObjects from "./Framework/SimpleObjects.js";

/** These imports are for the examples - feel free to remove them */
import {GrBuilding1, GrBuilding2, GrBuilding3,GrBuilding4} from "./houses.js";
import {GrRoad, GrHeli, GrFlag} from "./traffic.js";
import {GrFireBall, GrCarousel, GrTilt, GrAdvancedSwing, GrGrass} from "./parkobjects.js";
import {GrTrain,draw} from "./train.js";
import {GrTruck, GrBus1, GrBus2, GrCar1, GrCar2} from "./cars.js";
import {CircularTrack, TrackCube, TrackCar} from "./Examples/track.js";
import {Helicopter, Helipad} from "./Examples/helicopter.js";

/**
 * The Graphics Town Main - 
 * This builds up the world and makes it go...
 */

let world_size = 40;
// let text = document.getElementById("text"); //print
//let text2 = document.getElementById("text2"); //print
//text.innerHTML = Bezier_curves.length.toString();


function grtown() {
    // make the world
    
    let world = new GrWorld({
        lightBrightness:1,ambient:1,
        width:1000, height:600,         // make the window reasonably large
        groundplanesize:world_size              // make the ground plane big enough for a world of stuff
        //lookfrom:new T.Vector3(1000,1000,2000)
    });

    world.scene.background = new T.CubeTextureLoader()
	.setPath( './Texture/sky1/' )
	.load( [
		'iceflats_rt.png',
		'iceflats_lf.png',
		'iceflats_up.png',
		'iceflats_dn.png',
		'iceflats_bk.png',
		'iceflats_ft.png'
    ] );
    
    draw(world);
    world.add(new GrTruck());
    world.add(new GrCar1());
    world.add(new GrCar2());
    world.add(new GrBus1());
    world.add(new GrBus2());

    world.add(new GrHeli());
    world.add(new GrFlag(world,-17,-17.5));
    world.add(new GrFlag(world,17,17.5));
    world.add(new GrFlag(world,17,-17.5));
    world.add(new GrFlag(world,-17,17.5));
    world.add(new GrRoad());

    world.add(new GrFireBall({size:2}));
    world.add(new GrCarousel({x:0,z:27,size:0.4}));
    world.add(new GrTilt({x:-6,z:25,size:0.4}));
    world.add(new GrAdvancedSwing({x:6,z:25,size:0.7}));
    world.add(new GrAdvancedSwing({x:8,z:28,size:0.7}));
    
    world.add(new GrGrass({x:0,z:0,size:0.7,}));

    world.add(new GrTrain());
    
    let building_indx;
    for(building_indx = -1; building_indx < 2; building_indx ++){
        world.add(new GrBuilding1({z:building_indx*7 + 2,x:-22, size:2.3, rotate:1}));
        world.add(new GrBuilding1({z:building_indx*7 + 2,x:-30, size:2.3, rotate:1}));
    }
    for(building_indx = -1; building_indx < 2; building_indx ++){
        world.add(new GrBuilding2({z:building_indx*7 - 2,x:22, size:2.3, rotate:2}));
        world.add(new GrBuilding2({z:building_indx*7 - 2,x:30, size:2.3, rotate:2}));
    }
    for(building_indx = -1; building_indx < 2; building_indx ++){
        world.add(new GrBuilding3({x:building_indx*7 - 2,z: -23, size:2.6, rotate:0}));
        world.add(new GrBuilding3({x:building_indx*7 - 2,z: -31, size:2.6, rotate:0}));
    }
    world.add(new GrBuilding4({x:-28,z: -20, size:0.02, rotate:0}));
    world.add(new GrBuilding4({x:26,z: -20, size:0.02, rotate:0}));
    makePillar(world);


    world.add(new Helipad(-22,0,-22));
    world.add(new Helipad(22,0,-22));
    let copter = new Helicopter();
    world.add(copter);
    copter.getPads(world.objects);


    // build and run the UI
    // only after all the objects exist can we build the UI
    // @ts-ignore       // we're sticking a new thing into the world
    world.ui = new WorldUI(world);
    // now make it go!
    world.go();
}
Helpers.onWindowOnload(grtown);

function makePillar(world){
    let shaderMat = shaderMaterial("./Shaders/proc.vs","./Shaders/proc.fs",
    {
        side:T.DoubleSide,
        uniforms: {
            light  : {value: new T.Vector3(1,0,0) },
            dark   : {value: new T.Vector3(0,0,1)}
        }
    });

    let board1 = new SimpleObjects.GrSquareSign({x:1,y:2,size:2,material:shaderMat});
    let board2 = new SimpleObjects.GrSquareSign({x:1,y:2,size:2,material:shaderMat});
    let board3 = new SimpleObjects.GrSquareSign({x:2,y:2,size:2,material:shaderMat});
    let board4 = new SimpleObjects.GrSquareSign({x:2,y:2,size:2,material:shaderMat});
    world.add(board1);
    world.add(board2);
    world.add(board3);
    world.add(board4);
    board1.objects[0].position.z = 20;
    board1.objects[0].rotation.y = Math.PI/2;
    board1.objects[0].position.x = -4;
    board2.objects[0].position.z = 20;
    board2.objects[0].rotation.y = Math.PI/2;
    board2.objects[0].position.x = 4;
    board3.objects[0].position.z = 20;
    board3.objects[0].rotation.x = Math.PI/2;
    board3.objects[0].position.y = 4;
    board4.objects[0].position.z = 20;
    board4.objects[0].rotation.x = Math.PI/2;
    board4.objects[0].position.x = -2;
    board4.objects[0].position.y = 4;


}









