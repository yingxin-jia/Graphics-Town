
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

let world_size = 40;
let height =0.2;
let z=0.5;
let u=0;
let thePoints = [ [-0.7*world_size,z,-0.7*world_size], [0.7*world_size,z,-0.7*world_size], [0.7*world_size,z,0.7*world_size], [-0.7*world_size,z,0.7*world_size]];
let Bezier_curves = [];
let pt_deriv = [];
let arc_table = [];
let segsnum = 30;
// let text = document.getElementById("text"); //print

export class GrTrain extends GrObject {
    constructor() {
		let train = new T.Group();
        
		let base_geom = new T.BoxGeometry( 2, 2.3, 4 );
		let base_mat = new T.MeshStandardMaterial({color:"red", metalness:0.5, roughness:0.7});
        let base = new T.Mesh(base_geom, base_mat);
        let head = new T.Group();
        let tail1 = new T.Group();
        let tail2 = new T.Group();

        head.add(base);
        base.translateZ(-1);
        let base2_geom = new T.CylinderGeometry( 0.9, 0.9, 2.5, 8 );
        let base2 = new T.Mesh(base2_geom, base_mat);
        base2.translateY(-0.3);
        base2.rotateX(Math.PI/2);
        base2.translateY(2);
        head.add(base2);

        let baseBlack_geom2 = new T.CylinderGeometry( 0.8, 0.8, 2.6, 15 );
        let baseBlack_geom = new T.CylinderGeometry( 0.5, 0.5, 2.2, 15 );
        let baseBlack_mat = new T.MeshStandardMaterial({color:"black", metalness:0.5, roughness:0.7});
        let baseBlack1 = new T.Mesh(baseBlack_geom, baseBlack_mat);
        let baseBlack2 = new T.Mesh(baseBlack_geom, baseBlack_mat);
        let baseBlack3 = new T.Mesh(baseBlack_geom2, baseBlack_mat);
        baseBlack1.rotateZ(Math.PI/2);
        baseBlack1.translateZ(2.5);
        baseBlack1.translateX(-.8);
        baseBlack2.rotateZ(Math.PI/2);
        baseBlack2.translateZ(1.3);
        baseBlack2.translateX(-.8);
        baseBlack3.rotateZ(Math.PI/2);
        baseBlack3.translateZ(0);
        baseBlack3.translateX(-.5);
        head.add(baseBlack1,baseBlack2,baseBlack3);
        head.rotateY(Math.PI/2);
        
        let baseBlack4 = new T.Mesh(baseBlack_geom2, baseBlack_mat);
        let baseBlack5 = new T.Mesh(baseBlack_geom2, baseBlack_mat);
        baseBlack4.rotateX(Math.PI/2);
        baseBlack4.translateZ(.6);
        baseBlack4.translateX(-2.7);

        let baseBlack42 = new T.Mesh(baseBlack_geom2, baseBlack_mat);
        baseBlack42.rotateX(Math.PI/2);
        baseBlack42.translateZ(.6);
        baseBlack42.translateX(-0.2);

        let baseBlack43 = new T.Mesh(baseBlack_geom2, baseBlack_mat);
        baseBlack43.rotateX(Math.PI/2);
        baseBlack43.translateZ(.6);
        baseBlack43.translateX(2.3);

        baseBlack5.rotateX(Math.PI/2);
        baseBlack5.translateZ(.6);
        let tail_geom = new T.BoxGeometry( 8, 2, 2);
        let tail_mat = new T.MeshStandardMaterial({color:"red", metalness:0.5, roughness:0.7});
        let tail11 = new T.Mesh(tail_geom, tail_mat);
        
        let hook_geom = new T.BoxGeometry( 3, 0.5, 0.5 );
		let hook_mat = new T.MeshStandardMaterial({color:"black", metalness:0.5, roughness:0.7});
        let hook1 = new T.Mesh(hook_geom, hook_mat);
        tail11.translateY(-0.2);
        hook1.translateY(-0.8);
        hook1.translateX(2);
        tail11.translateX(-0.7);
        tail1.add(baseBlack4, tail11,baseBlack42,baseBlack43);

        let tail21 = new T.Mesh(tail_geom, tail_mat);
        let hook2 = new T.Mesh(hook_geom, hook_mat);
        hook2.translateY(-0.8);
        tail21.translateY(-0.2);
        tail2.add(baseBlack5, tail21, hook2);
        tail2.translateX(-5.7);
        hook2.translateX(2.5);

        let horn_geom = new T.CylinderGeometry( 1, 0.5, 2 );
		let horn_mat = new T.MeshStandardMaterial({color:"black", metalness:0.5, roughness:0.7});
        let horn = new T.Mesh(horn_geom, horn_mat);
        horn.translateX(2.6);
        
        horn.translateY(2);
        tail1.add(horn);
        
        train.add( head,tail1,tail2);
        super(`Train`,tail1);
        tail1.position.y = 2;
        this.train = tail2;
        train.translateY(1.5);
        this.rideable = horn;
       
        this.head = head;
        this.tail1 = tail1;
        this.tail2 = tail2;
        this.horn = horn;
        let train_scale = 0.85;
        head.scale.set(train_scale,train_scale,train_scale);
        tail1.scale.set(train_scale,train_scale,train_scale);
        tail2.scale.set(train_scale,train_scale,train_scale);

    }
    advance(delta,timeOfDay) {
        let body_parts = [];
        body_parts.push(this.tail2);
        body_parts.push(this.tail1);
        // body_parts.push(this.head);
        for(let k=0; k<body_parts.length ; k++){
            let x1, z1, angle;
            u+=delta*0.0001;
            let part = body_parts[k];
            let param = (u)%(thePoints.length);
            let param1 = Math.floor(param) % Bezier_curves.length;
            let distance = 0.05;
            [x1, z1, angle] = arc(param1, param+distance*k, param+distance*k - param1);
            part.position.x = x1;
            part.position.z = z1;

            // text.innerHTML = this.horn.position.z.toString();
            
            if(k == 1 || k == 0){
                part.rotation.set(0,angle-Math.PI/2,0,"XYZ");
            }else{
                // part.rotation.set(0,angle,0,"XYZ");
            }

        }

    }

}

function arc(i, u, u2) { //u is total time

    let angle, flag=0, tempk=-1, tempj=-1, percent2=0, temp3x, temp3z;
    let [x, z, xd, zd] = xNz(i, u2);
    let percent = u/Bezier_curves.length;
    let temp0 = arc_table[arc_table.length-1].ten_segs[segsnum-1];
    let maxlen = temp0[2], x00 = thePoints[0][0], z00 = thePoints[0][2];
    let cur_len = percent*maxlen;
    
    if(cur_len>maxlen){
        flag=1;
        tempk = arc_table.length-1;
        tempj = segsnum-1;
        percent2 = (cur_len-maxlen)/Math.sqrt((temp0[0]-x00)*(temp0[0]-x00) + (temp0[1]-z00)*(temp0[1]-z00));
        temp3x = x00;
        temp3z = z00;
    }

    for(let k=0; k<arc_table.length && flag==0; k++){
        
        let temp = arc_table[k].ten_segs;
        for(let j=0; j<segsnum; j++){
            
            let low = temp[j][2], high;
            if(j<segsnum-1){
                high = temp[j+1];
            }else{
                high = arc_table[(k+1)%arc_table.length].ten_segs[0];
            }
             
            if(Math.floor(low) <= Math.floor(cur_len) && Math.floor(high[2]) >= Math.floor(cur_len)){
                
                percent2 = (cur_len-low)/(high[2]-low);
                flag = 1;
                tempk = k;
                tempj = j;
                temp3x = high[0];
                temp3z = high[1];
                break;
            }
        }
    }

    let temp2 = arc_table[tempk].ten_segs[tempj]; 

    // x = temp2[0] + percent2 * (temp3x - temp2[0]);
    // z = temp2[1] + percent2 * (temp3z - temp2[1]);
    angle = Math.atan2(xd, zd); 
    return [x, z, angle];
}

function toBezier(){
    Bezier_curves = [];
    pt_deriv = [];
    arc_table = [];
    let i, s = 0.5, u = 1/3;
    for (i = 0; i < thePoints.length; i++) {
        // p' = s*((p of i+1) - (p of i-1))
        let p0 = thePoints[i];
        let x, y;
        x = thePoints[(i+1)%thePoints.length][0] - thePoints[(i-1+thePoints.length)%thePoints.length][0];
        y = thePoints[(i+1)%thePoints.length][2] - thePoints[(i-1+thePoints.length)%thePoints.length][2];
        let p0d = [s*x, height,s*y];
        let p1 = [p0[0] + u*p0d[0], height, p0[2] + u*p0d[2]];
        let p3 = thePoints[(i+1)%thePoints.length];
        x = thePoints[(i+2)%thePoints.length][0] - thePoints[i][0];
        z = thePoints[(i+2)%thePoints.length][2] - thePoints[i][2];
        let p3d = [s*x, height, s*z];
        let p2 = [p3[0] - u*p3d[0], height, p3[2] - u*p3d[2]];
        Bezier_curves.push([p0,p1,p2,p3]);
        pt_deriv.push([p0,p3,p0d,p3d]);

        let j, angle1, xd, zd;
        let segs=[];

        for(j=0; j < 1; j += 1/segsnum){  
            [x, z, xd, zd] = xNz(i, j);    
            angle1 = Math.atan2(xd, zd);
            if(i==0 && j==0){
                segs.push([p0[0], p0[2], 0, angle1]);  
                continue;
            }
            let temp;
            if(j==0){
                temp = arc_table[(i-1+arc_table.length)%arc_table.length].ten_segs[9];
            }else{
                temp = segs.pop();
                segs.push(temp);
            }
            let dist = temp[2] + Math.sqrt((temp[0]-x)*(temp[0]-x) + (temp[1]-z)*(temp[1]-z));
            segs.push([x, z, dist, angle1]);
        }
        arc_table.push({
            "ten_segs": segs,
        });
    }
}

function createBezierCurve(cpList, steps) {
    // Using the given list of control points, returns a
    // THREE.Geometry comprising 'steps' vertices, suitable for
    // combining with a material and creating a THREE.Line out of.
    var N = Math.round(steps)+1 || 20; // number of vertices              
    var geometry = new T.Geometry();
 
    var cp = cpList[0];
    let v0 = new T.Vector3(cp[0], cp[1], cp[2]);
    cp = cpList[1];
    let v1 = new T.Vector3(cp[0], cp[1], cp[2]);
    cp = cpList[2];
    let v2 = new T.Vector3(cp[0], cp[1], cp[2]);
    cp = cpList[3];
    let v3 = new T.Vector3(cp[0], cp[1], cp[2]);

    var curve = new T.CubicBezierCurve3(v0,v1,v2,v3);

    var j, stepSize = 1/(N-1);
    for (j = 0; j < N; j++) {
        geometry.vertices.push( curve.getPoint(j * stepSize) );
    }
    return geometry;
}

function createPoint(P, radius, material) {
    // returns a mesh for a sphere of given radius and material at the
    // given location (a list of three coordinates), suitable for adding
    // to the scene. More for debugging than anything else.
    radius = radius || 0.1;
    material = material || new T.MeshNormalMaterial();
    var mesh = new T.Mesh( new T.SphereGeometry(radius), material);
    mesh.position.set(P[0],P[1],P[2]);
    return mesh;
}

function xNz(i, u){  //i is index of curve, u is time param 0~1
    let x, z, xd, zd;
    let p = pt_deriv[i];
    x = p[0][0] + p[2][0]*u + (-3*p[0][0]-2*p[2][0]+3*p[1][0]-p[3][0])*u*u + (2*p[0][0]+p[2][0]-2*p[1][0]+p[3][0])*u*u*u;
    z = p[0][2] + p[2][2]*u + (-3*p[0][2]-2*p[2][2]+3*p[1][2]-p[3][2])*u*u + (2*p[0][2]+p[2][2]-2*p[1][2]+p[3][2])*u*u*u;
    xd = p[2][0] + (-3*p[0][0]-2*p[2][0]+3*p[1][0]-p[3][0])*u*2 + (2*p[0][0]+p[2][0]-2*p[1][0]+p[3][0])*u*u*3;
    zd = p[2][2] + (-3*p[0][2]-2*p[2][2]+3*p[1][2]-p[3][2])*u*2 + (2*p[0][2]+p[2][2]-2*p[1][2]+p[3][2])*u*u*3;
    return [x, z, xd, zd];
}

function drawBeams(world){
    arc_table.forEach(function(pt) {
        let j;
        let segs1 = pt.ten_segs;
        let railgeom = new T.BoxGeometry( 0.3,0.3,1.5 );
        let railmesh = new T.MeshStandardMaterial({color:"black", metalness:0.5, roughness:0.5});
        
        for(j=0;j<segsnum;j++){
            let rail = new T.Mesh(railgeom,railmesh);
            rail.translateX(segs1[j][0]);
            rail.translateZ(segs1[j][1]);
            rail.rotation.set(0,segs1[j][3]+Math.PI/2,0);
            world.scene.add(rail);
        }
    });
}

export function draw(world) {

    toBezier();
    drawBeams(world);

    Bezier_curves.forEach(function(curves) {
        var curve = [ 
            curves[0],//begin point
            curves[1],//1st control point
            curves[2],//2nd control point
            curves[3] //end point
        ];
        var curveGeom = createBezierCurve(curve,20);
        var curveMat = new T.LineBasicMaterial( { color: "blue", linewidth: 3 } );
        var curve1 = new T.Line( curveGeom, curveMat );
        world.scene.add(curve1);
    });
  
   for( var i=0; i < Bezier_curves[0].length; i++ ) {
    world.scene.add(createPoint(Bezier_curves[0][i]));
    }

}
