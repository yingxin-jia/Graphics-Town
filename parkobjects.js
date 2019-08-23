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

import {GrObject} from "./Framework/GrObject.js";
import * as InputHelpers from "./Libs/inputHelpers.js";
import * as SimpleObjects from "./Framework/SimpleObjects.js";
import {shaderMaterial} from "./Framework/shaderHelper.js";

let image_height = new T.TextureLoader().load("./Texture/Lava.jpg");
let loader = new T.OBJLoader();

export class GrFireBall extends GrObject {
    constructor(params={}) {
		let fireball = new T.Group();

		let fire_height = 0.4;
		let shaderMat = shaderMaterial("./Shaders/ex83-0.vs","./Shaders/ex83-01.fs",
        {
            side:T.DoubleSide,
            uniforms: {
                texture : {value: image_height},
                fire_height : {value: fire_height},
                radius : {value: 0.3},
                height : {value: 0.3},
                pointLightColor: {value: new T.Vector3(1,1,0) },
                pointLightPosition: {value: new T.Vector3(1,2,3) },
                light  : {value: new T.Vector3(0,1,0) },
                dark   : {value: new T.Vector3(1,0,0)}
            }
        });

		let geom = new T.SphereBufferGeometry(params.size ? (params.size / 2.0) : 1.0);
		let ball = new T.Mesh(geom, shaderMat);
		fireball.add(ball);

		let pillar = new T.Group();
		loader.load('OBJ/pillar.obj', function(pillar0)
		{
			pillar = pillar0;
			pillar0.position.set(-2, 1.5, -2);
			pillar0.scale.set(0.03,0.03,0.03);
			fireball.add(pillar);
			pillar.translateY(-1.2);
			pillar.translateX(2);
			pillar.translateZ(2);
		});
		super(`FireBall`,fireball);
		this.shaderMat = shaderMat;
		this.time = 0;
		let scale = 1;
		this.ball = ball;
		fireball.scale.set(scale, scale, scale);
		ball.translateY(12.5);

	}
	advance(delta,timeOfDay) {
		this.time += 0.002 * delta;
		this.ball.rotation.set(0,this.time,0);
		this.shaderMat.uniforms.fire_height.value = this.time % 2-0.5;
	}
}


let roundaboutObCtr = 0;
// A colorful merry-go-round, with handles and differently-colored sections.
/**
 * @typedef ColoredRoundaboutProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrColoredRoundabout extends GrObject {
    /**
     * @param {ColoredRoundaboutProperties} params 
     */
    constructor(params={}) {
		let roundabout = new T.Group();

		let base_geom = new T.CylinderGeometry(0.5, 1, 0.5, 16);
		let base_mat = new T.MeshStandardMaterial({color:"#888888", metalness:0.5, roughness:0.8});
		let base = new T.Mesh(base_geom, base_mat);
		base.translateY(0.25);
		roundabout.add(base);

		let platform_group = new T.Group();
		base.add(platform_group);
		platform_group.translateY(0.25);

		let section_geom = new T.CylinderGeometry(2, 1.8, 0.3, 8, 4, false, 0, Math.PI/2);
		let section_mat;
		let section;

		let handle_geom = buildHandle();
		let handle_mat = new T.MeshStandardMaterial({color:"#999999", metalness:0.8, roughness:0.2});
		let handle;

		// in the loop below, we add four differently-colored sections, with handles,
		// all as part of the platform group.
		let section_colors = ["red", "blue", "yellow", "green"];
		for (let i = 0; i < section_colors.length; i++)
		{
			section_mat = new T.MeshStandardMaterial({color:section_colors[i], metalness:0.3, roughness:0.6});
			section = new T.Mesh(section_geom, section_mat);
			handle = new T.Mesh(handle_geom, handle_mat);
			section.add(handle);
			handle.rotation.set(0, Math.PI/4, 0);
			handle.translateZ(1.5);
			platform_group.add(section);
			section.rotateY(i*Math.PI/2);
		}
		
        // note that we have to make the Object3D before we can call
        // super and we have to call super before we can use this
		super(`Roundabout-${roundaboutObCtr++}`,roundabout);
		this.whole_ob = roundabout;
		this.platform = platform_group;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
		this.whole_ob.position.z = params.z ? Number(params.z) : 0;
		let scale = params.size ? Number(params.size) : 1;
		roundabout.scale.set(scale, scale, scale);


		// This helper function defines a curve for the merry-go-round's handles,
		// then extrudes a tube along the curve to make the actual handle geometry.
		function buildHandle()
		{
			/**@type THREE.CurvePath */
			let handle_curve = new T.CurvePath();
			handle_curve.add(new T.LineCurve3(new T.Vector3(-0.5, 0, 0), new T.Vector3(-0.5, 0.8, 0)));
			handle_curve.add(new T.CubicBezierCurve3(new T.Vector3(-0.5, 0.8, 0), new T.Vector3(-0.5, 1, 0), new T.Vector3(0.5, 1, 0), new T.Vector3(0.5, 0.8, 0)));
			handle_curve.add(new T.LineCurve3(new T.Vector3(0.5, 0.8, 0), new T.Vector3(0.5, 0, 0)));
			return new T.TubeGeometry(handle_curve, 64, 0.1, 8);
		}
	}
	advance(delta,timeOfDay) {this.platform.rotateY(0.005*delta);}
}


let swingObCtr = 1;

// A more complicated, one-seat swingset.
// This one has actual chain links for its chains,
// and uses a nicer animation to give a more physically-plausible motion.
/**
 * @typedef AdvancedSwingProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrAdvancedSwing extends GrObject {
    /**
     * @param {AdvancedSwingProperties} params 
     */
    constructor(params={}) {
		let swing = new T.Group();
		addPosts(swing);

		let hanger = new T.Group();
		swing.add(hanger);
		hanger.translateY(1.8);
		let l_chain = new T.Group();
		let r_chain = new T.Group();
		hanger.add(l_chain);
		hanger.add(r_chain);
		// after creating chain groups, call the function to add chain links.
		growChain(l_chain, 20);
		growChain(r_chain, 20);
		l_chain.translateZ(0.4);
		r_chain.translateZ(-0.4);

		let seat_group = new T.Group();
		let seat_geom = new T.CubeGeometry(0.4, 0.1, 1);
		let seat_mat = new T.MeshStandardMaterial({color:"#554433", metalness:0.1, roughness:0.6});
		let seat = new T.Mesh(seat_geom, seat_mat);
		seat_group.add(seat);
		seat_group.position.set(0,-1.45,0);
		hanger.add(seat_group);
		
        // note that we have to make the Object3D before we can call
        // super and we have to call super before we can use this
		super(`Swing-${swingObCtr++}`,swing);
		this.whole_ob = swing;
		this.hanger = hanger;
		this.seat = seat_group;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
		this.whole_ob.position.z = params.z ? Number(params.z) : 0;
		let scale = params.size ? Number(params.size) : 1;
		swing.scale.set(scale, scale, scale);

		this.swing_angle = 0;

		// This helper function creates the 5 posts for a swingset frame,
		// and positions them appropriately.
		function addPosts(group)
		{
			let post_material = new T.MeshStandardMaterial({color:"red", metalness:0.6, roughness:0.5});
			let post_geom = new T.CylinderGeometry(0.1, 0.1, 2, 16);
			let flPost = new T.Mesh(post_geom, post_material);
			group.add(flPost);
			flPost.position.set(0.4,0.9,0.9);
			flPost.rotateZ(Math.PI/8);
			let blPost = new T.Mesh(post_geom, post_material);
			group.add(blPost);
			blPost.position.set(-0.4,0.9,0.9);
			blPost.rotateZ(-Math.PI/8);
			let frPost = new T.Mesh(post_geom, post_material);
			group.add(frPost);
			frPost.position.set(0.4,0.9,-0.9);
			frPost.rotateZ(Math.PI/8);
			let brPost = new T.Mesh(post_geom, post_material);
			group.add(brPost);
			brPost.position.set(-0.4,0.9,-0.9);
			brPost.rotateZ(-Math.PI/8);
			let topPost = new T.Mesh(post_geom, post_material);
			group.add(topPost);
			topPost.position.set(0,1.8,0);
			topPost.rotateX(-Math.PI/2);
		}

		// Helper function to add "length" number of links to a chain.
		function growChain(group, length)
		{
			let chain_geom = new T.TorusGeometry(0.05, 0.015);
			let chain_mat = new T.MeshStandardMaterial({color:"#777777", metalness:0.8, roughness:0.2});
			let link = new T.Mesh(chain_geom, chain_mat);
			group.add(link);
			for (let i = 0; i < length; i++)
			{
				let l_next = new T.Mesh(chain_geom, chain_mat);
				l_next.translateY(-0.07);
				link.add(l_next);
				l_next.rotation.set(0, Math.PI/3, 0);
				link = l_next;
			}
		}
	}
	advance(delta,timeOfDay) {
		this.swing_angle += 0.005*delta;
		this.hanger.rotation.z = Math.sin(this.swing_angle) * Math.PI/4;
		this.seat.rotation.z = Math.sin(this.swing_angle) * Math.PI/16;
	}

}


// A colorful merry-go-round, with handles and differently-colored sections.
/**
 * @typedef ColoredRoundabout2Properties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrTilt extends GrObject {
    /**
     * @param {ColoredRoundaboutProperties} params 
     */
    constructor(params={}) {
		let tilt = new T.Group();

		let base_geom = new T.CylinderGeometry(0.5, 1, 0.5, 16);
		let base_mat = new T.MeshStandardMaterial({color:"#888888", metalness:0.5, roughness:0.8});
		let base = new T.Mesh(base_geom, base_mat);
		base.translateY(0.25);
		tilt.add(base);

		let platform_group = new T.Group();
		base.add(platform_group);
		platform_group.translateY(0.25);

		let section_geom = new T.CylinderGeometry(2, 1.8, 0.3, 8, 4, false, 0, Math.PI/2);
		let section_mat,section_mat2;
		let section;

		let handle_geom = new T.SphereBufferGeometry(0.5, 0.5, 0.6, 5, 2*Math.PI, 0, 0.6 * Math.PI);
		let chair_geom = new T.BoxGeometry( 1.6, 0.1, 0.8 );
		let handle, chair;
		let sections = [], handles = [];
		let sections2 = [];
		// in the loop below, we add four differently-colored sections, with handles,
		// all as part of the platform group.
		let section_colors = ["red", "blue", "green", "yellow"];
		for (let i = 0; i < section_colors.length; i++)
		{
			section_mat = new T.MeshStandardMaterial({color:section_colors[i], metalness:0.3, roughness:0.6});
			section = new T.Mesh(section_geom, section_mat);
			section_mat2 = new T.MeshStandardMaterial({color:section_colors[(i+2)%4], metalness:0.1, roughness:0.6});
			
			handle = new T.Mesh(handle_geom, section_mat2);
			chair = new T.Mesh(chair_geom, section_mat2);
			handle.scale.set(0.85,0.85,0.85);
			section.add(handle);
			handle.add(chair);
			handle.translateY(0.5);
			chair.translateY(0.5);
			
			handle.rotation.set(0, 0, 0);
			handle.translateZ(1);
			platform_group.add(section);
			section.rotateY(i*Math.PI/2);
			handles.push(handle);
			sections.push(handle);
			sections2.push(section);
		}
		
        // note that we have to make the Object3D before we can call
        // super and we have to call super before we can use this
		super(`Tilt-a-Whirl`,tilt);
		this.whole_ob = tilt;
		this.platform = platform_group;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
		this.whole_ob.position.z = params.z ? Number(params.z) : 0;
		let scale = params.size ? Number(params.size) : 1;
		scale = scale*2;
		tilt.scale.set(scale, scale, scale);
		this.time = 0;
		this.sections = sections;
		this.sections2 = sections2;
		this.handles = handles;
	}
	advance(delta,timeOfDay) {
		this.sections.forEach(function(sec) {
			sec.rotation.y+=(0.005*delta); 
		});

		this.sections2.forEach(function(sec) {
			sec.rotateY(0.002*delta); 
		});
		let t = (this.time) % 1;           // where are we in the cycle?
		this.time += delta/1000;     // time in seconds
		let order = 0;
		this.handles.forEach(function(horse) {
			order += 0.2;
			let t1 = (t + order) % 1;
			t = t1;
			if (t<0.1 || t>0.9) horse.position.x = 0.8;
			else {
				horse.position.x = 2*(0.16-(0.5-t)*(0.5-t));
			}
		});
	}
}

// A Carousel.
/**
 * @typedef CarouselProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrCarousel extends GrObject {
    /**
     * @param {CarouselProperties} params 
     */
    constructor(params={}) {
		let width = 3;
		let carousel = new T.Group();
		
		let base_geom = new T.CylinderGeometry(width, width, 1, 32);
		let base_mat = new T.MeshStandardMaterial({color:"#ffae5d", metalness:0.3, roughness:0.8});
		let base = new T.Mesh(base_geom, base_mat);
		base.translateY(0.5);
		carousel.add(base);

		let platform_group = new T.Group();
		base.add(platform_group);
		platform_group.translateY(0.5);

		let platform_geom = new T.CylinderGeometry(0.95*width, 0.95*width, 0.2, 32);
		let platform_mat = new T.MeshStandardMaterial({color:"gold", metalness:0.3, roughness:0.8});
		let platform = new T.Mesh(platform_geom, platform_mat);
		platform_group.add(platform);

		let cpole_geom = new T.CylinderGeometry(0.3*width, 0.3*width, 3, 16);
		let cpole_mat = new T.MeshStandardMaterial({color:"gold", metalness:0.8, roughness:0.5});
		let cpole = new T.Mesh(cpole_geom, cpole_mat);
		platform_group.add(cpole);
		cpole.translateY(1.5);

		let top_trim = new T.Mesh(platform_geom, platform_mat);
		platform_group.add(top_trim);
		top_trim.translateY(3);

		let opole_geom = new T.CylinderGeometry(0.03*width, 0.03*width, 3, 16);
		let opole_mat = new T.MeshStandardMaterial({color:"#aaaaaa", metalness:0.8, roughness:0.5});
		let horse_geom = new T.CylinderGeometry(0.15*width, 0.15*width, 1, 3);
		let horse_mat = new T.MeshStandardMaterial({color:"#e5e1d6", metalness:0.8, roughness:0.5});
		let opole, horse;
		let num_poles = 10;
		let poles = [];
		let horses = [];

		//let loader = new T.OBJLoader();
		
		for (let i = 0; i < num_poles; i++)
		{
			horse = new T.Mesh(horse_geom, horse_mat);
			let deer;
			loader.load('OBJ/deer.obj', function(obj)
			{
				deer = obj;
				deer.position.set(0, 3.5, 0);
				deer.scale.set(0.2,0.2,0.2);
				deer.scale.set(0.0015, 0.0015, 0.0015);
				platform_group.add(deer);
				deer.translateY(1.0);
				deer.rotateY(2*i*Math.PI/num_poles);
				deer.translateX(0.8*width);
				horses.push(deer);

				deer.traverse(function(child) {
					if (child instanceof T.Mesh) {
					  child.material = horse_mat;
					}		  
				});
			});

			opole = new T.Mesh(opole_geom, opole_mat);
			platform_group.add(opole);
			opole.translateY(1.5);
			horse.translateY(1.0);
			opole.rotateY(2*i*Math.PI/num_poles);
			opole.translateX(0.8*width);
			poles.push(opole);
		}
		
		let roof_geom = new T.ConeGeometry(width, 0.5*width, 32, 4);
		let roof = new T.Mesh(roof_geom, base_mat);
		carousel.add(roof);
		roof.translateY(4.8);
		
        // note that we have to make the Object3D before we can call
        // super and we have to call super before we can use this
		super(`Carousel`,carousel);
		this.whole_ob = carousel;
		this.platform = platform;
		this.poles = poles;
		this.horses = horses;
		this.time = 0;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
		this.whole_ob.position.z = params.z ? Number(params.z) : 0;
		let scale = params.size ? Number(params.size) : 1;
		scale = scale*2;
		carousel.scale.set(scale, scale, scale);
		this.base = base;
		this.horse = horse;
	}
	advance(delta,timeOfDay) {
		delta = delta/2;
			this.time += delta/1000;     // time in seconds
			// set the y position based on the time
			let t = (this.time) % 1;           // where are we in the cycle?
		
			this.base.rotateY(0.005*delta); 
			let order = 0;
			this.horses.forEach(function(horse) {
				order += 0.2;
				let t1 = (t + order) % 1;
				t = t1;
				if (t<0.1 || t>0.9) horse.position.y = 0;
				else {
					horse.position.y =  7.0*(0.16-(0.5-t)*(0.5-t));
				}
			});
	}
}


export class GrGrass extends GrObject {
    /**
     * @param {CarouselProperties} params 
     */
    constructor(params={}) {
		let tree_loop = new T.Group();
		let redMat = new T.MeshStandardMaterial({color:"red", metalness:0.3, roughness:0.5});
		let orangeMat = new T.MeshStandardMaterial({color:"orange", metalness:0.3, roughness:0.5});


		let num_poles = 20;
		for (let i = 0; i < num_poles; i++)
		{
			let treeobj;
			loader.load('OBJ/trees.obj', function(object)
			{
				treeobj = object;
				object.position.y = 3;
				object.children[0].rotateY(2*i*Math.PI/num_poles);object.children[0].translateX(2);
				treeobj.traverse(function(child) {
					if (child instanceof T.Mesh) {
					  child.material = redMat;
					}		  
				});
				tree_loop.add(object.children[0]);

			});	
		}
		let num_poles2 = 20;
		for (let i = 0; i < num_poles2; i++)
		{
			let treeobj;
			loader.load('OBJ/trees.obj', function(object)
			{
				treeobj = object;
				object.position.y = 3;
				object.children[0].rotateY(2*i*Math.PI/num_poles2);
				object.children[0].translateX(1);
				treeobj.traverse(function(child) {
					if (child instanceof T.Mesh) {
					  child.material = orangeMat;
					}		  
				});
				tree_loop.add(object.children[0]);

			});	
		}
		
        // note that we have to make the Object3D before we can call
        // super and we have to call super before we can use this
		super(`Flowers`,tree_loop);
		this.whole_ob = tree_loop;
        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
		this.whole_ob.position.z = params.z ? Number(params.z) : 0;
		let scale = params.size ? Number(params.size) : 1;
		scale = scale*2;
		tree_loop.scale.set(scale, scale, scale);
	}
}
