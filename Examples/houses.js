
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


export class GrBuilding1 extends GrObject {
    constructor() {
        let geometry = new T.Geometry();
        let width = 2, height = 1;
        geometry.vertices.push(new T.Vector3( 0,0, 0));//0
        geometry.vertices.push(new T.Vector3( width,0, 0));//1
        geometry.vertices.push(new T.Vector3( width,0, width));//2
        geometry.vertices.push(new T.Vector3( 0,0, width));//3
        geometry.vertices.push(new T.Vector3( 0,height, width));//4
        geometry.vertices.push(new T.Vector3( 0,height, 0));//5
        geometry.vertices.push(new T.Vector3( width,height, 0));//6
        geometry.vertices.push(new T.Vector3( width,height, width));//7
        geometry.vertices.push(new T.Vector3( width,height*1.5, width/2));//8
        geometry.vertices.push(new T.Vector3( 0,height*1.5, width/2));//9
        //window
        height = height-0.5, width = width + 0.01;
        geometry.vertices.push(new T.Vector3( 1.2*width/3-0.5,height/1.5, width));//10
        geometry.vertices.push(new T.Vector3( 1.2*width*2/3-0.5,height/1.5, width));//11
        geometry.vertices.push(new T.Vector3( 1.2*width*2/3-0.5,height/1.5+1.5*width/6, width));//12
        geometry.vertices.push(new T.Vector3( 1.2*width/3-0.5,height/1.5+1.5*width/6, width));//13
        //door
        height = height;
        let door_width=0.4,width2 = width -0.3;
        geometry.vertices.push(new T.Vector3( width2-door_width,0, width));//14
        geometry.vertices.push(new T.Vector3( width2,0, width));//15
        geometry.vertices.push(new T.Vector3( width2,door_width*2, width));//16
        geometry.vertices.push(new T.Vector3( width2-door_width,door_width*2, width));//17
        
        //
        geometry.faceVertexUvs = [ [] ];
        let f1 = new T.Face3(3,2,7);
        geometry.faces.push(f1);
        geometry.faceVertexUvs[0].push([new T.Vector2(1/3,1/3), new T.Vector2(2/3,1/3), new T.Vector2(2/3,2/3)]);
        let f2 = new T.Face3(3,7,4);
        geometry.faces.push(f2);
        geometry.faceVertexUvs[0].push([new T.Vector2(1/3,1/3), new T.Vector2(2/3,2/3), new T.Vector2(1/3,2/3)]);
        let f3 = new T.Face3(2,1,6);
        geometry.faces.push(f3);
        geometry.faceVertexUvs[0].push([new T.Vector2(2/3,1/3), new T.Vector2(1,1/3), new T.Vector2(1,2/3)]);
        let f4 = new T.Face3(2,6,7);
        geometry.faces.push(f4);
        geometry.faceVertexUvs[0].push([new T.Vector2(2/3,1/3), new T.Vector2(1,2/3), new T.Vector2(2/3,2/3)]);
        let f5 = new T.Face3(4,7,6);
        geometry.faces.push(f5);
        geometry.faceVertexUvs[0].push([new T.Vector2(1/3,2/3), new T.Vector2(2/3,2/3), new T.Vector2(2/3,1)]);
        let f6 = new T.Face3(4,6,5);
        geometry.faces.push(f6);
        geometry.faceVertexUvs[0].push([new T.Vector2(1/3,2/3), new T.Vector2(2/3,1), new T.Vector2(1/3,1)]);
        let f7 = new T.Face3(0,3,4);
        geometry.faces.push(f7);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,1/3), new T.Vector2(1/3,1/3), new T.Vector2(1/3,2/3)]);
        let f8 = new T.Face3(0,4,5);
        geometry.faces.push(f8);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,1/3), new T.Vector2(1/3,2/3), new T.Vector2(0,2/3)]);
        let f9 = new T.Face3(0,1,2);
        geometry.faces.push(f9);
        geometry.faceVertexUvs[0].push([new T.Vector2(1/3,0), new T.Vector2(2/3,0), new T.Vector2(2/3,1/3)]);
        let f10 = new T.Face3(0,2,3);
        geometry.faces.push(f10);
        geometry.faceVertexUvs[0].push([new T.Vector2(1/3,0), new T.Vector2(2/3,1/3), new T.Vector2(1/3,1/3)]);
        
        let f11 = new T.Face3(1,0,5);
        geometry.faces.push(f11);
        geometry.faceVertexUvs[0].push([new T.Vector2(2/3,0), new T.Vector2(1,0), new T.Vector2(1,1/3)]);
        let f12 = new T.Face3(1,5,6);
        geometry.faces.push(f12);
        geometry.faceVertexUvs[0].push([new T.Vector2(2/3,0), new T.Vector2(1,1/3), new T.Vector2(2/3,1/3)]);
        
        geometry.computeFaceNormals();
        geometry.uvsNeedUpdate=true;
        //

        let tl=new T.TextureLoader().load("./Texture/wall32.jpg");
        let material = new T.MeshStandardMaterial({map:tl});
        
        //roof
        let f21 = new T.Face3(4,7,8);
        f21.materialIndex = 1;
        geometry.faces.push(f21);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1/4,0), new T.Vector2(1/4,1/4)]);
        let f22 = new T.Face3(4,8,9);
        f22.materialIndex = 1;
        geometry.faces.push(f22);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1/4,1/4), new T.Vector2(0,1/4)]);
        let f23 = new T.Face3(6,5,9);
        f23.materialIndex = 1;
        geometry.faces.push(f23);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,0), new T.Vector2(1,1)]);
        let f24 = new T.Face3(6,9,8);
        f24.materialIndex = 1;
        geometry.faces.push(f24);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,1), new T.Vector2(0,1)]);
        let f25 = new T.Face3(9,5,4);
        f25.materialIndex = 1;
        geometry.faces.push(f25);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,0), new T.Vector2(1,1)]);
        let f26 = new T.Face3(8,7,6);
        f26.materialIndex = 1;
        geometry.faces.push(f26);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,1), new T.Vector2(0,1)]);
        
        //window
        let f33 = new T.Face3(10,11,12);
        f33.materialIndex = 2;
        geometry.faces.push(f33);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,0), new T.Vector2(1,1)]);
        let f34 = new T.Face3(10,12,13);
        f34.materialIndex = 2;
        geometry.faces.push(f34);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,1), new T.Vector2(0,1)]);
       
        //door
        let f43 = new T.Face3(14,15,16);
        f43.materialIndex = 3;
        geometry.faces.push(f43);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,0), new T.Vector2(1,1)]);
        let f44 = new T.Face3(14,16,17);
        f44.materialIndex = 3;
        geometry.faces.push(f44);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,1), new T.Vector2(0,1)]);
       
        let t2=new T.TextureLoader().load("./Texture/roof1.jpg");
        let material2 = new T.MeshStandardMaterial({map:t2});
        let t3=new T.TextureLoader().load("./Texture/window2.jpg");
        let material3 = new T.MeshStandardMaterial({map:t3});
        let t4=new T.TextureLoader().load("./Texture/door1.jpg");
        let material4 = new T.MeshStandardMaterial({map:t4});
        let mesh = new T.Mesh(geometry,[material, material2,material3, material4]);

        super("TwoTriangles1",mesh);
    }
}




export class GrBuilding2 extends GrObject {
    constructor() {
        let geometry = new T.Geometry();
        let width = 2, height = 1;
        geometry.vertices.push(new T.Vector3( 0,0, 0));//0
        geometry.vertices.push(new T.Vector3( width,0, 0));//1
        geometry.vertices.push(new T.Vector3( width,0, width));//2
        geometry.vertices.push(new T.Vector3( 0,0, width));//3
        geometry.vertices.push(new T.Vector3( 0,height, width));//4
        geometry.vertices.push(new T.Vector3( 0,height, 0));//5
        geometry.vertices.push(new T.Vector3( width,height, 0));//6
        geometry.vertices.push(new T.Vector3( width,height, width));//7
        //roof
        geometry.vertices.push(new T.Vector3( width/2,height*1.8, width/2));//8
        //window
        height = height-0.5, width = width + 0.01;
        geometry.vertices.push(new T.Vector3( 1.2*width/3-0.5,height/1.5-0.1, width));//9
        geometry.vertices.push(new T.Vector3( 1.2*width*2/3-0.5,height/1.5-0.1, width));//10
        geometry.vertices.push(new T.Vector3( 1.2*width*2/3-0.5,height/1.5+1.5*width/6+0.1, width));//11
        geometry.vertices.push(new T.Vector3( 1.2*width/3-0.5,height/1.5+1.5*width/6+0.1, width));//12
        //door
        height = height;
        let door_width=0.4,width2 = width -0.3;
        geometry.vertices.push(new T.Vector3( width2-door_width,0, width));//13
        geometry.vertices.push(new T.Vector3( width2,0, width));//14
        geometry.vertices.push(new T.Vector3( width2,door_width*2, width));//15
        geometry.vertices.push(new T.Vector3( width2-door_width,door_width*2, width));//16
        
        //
        geometry.faceVertexUvs = [ [] ];
        let f1 = new T.Face3(3,2,7);
        geometry.faces.push(f1);
        geometry.faceVertexUvs[0].push([new T.Vector2(1/3,1/3), new T.Vector2(2/3,1/3), new T.Vector2(2/3,2/3)]);
        let f2 = new T.Face3(3,7,4);
        geometry.faces.push(f2);
        geometry.faceVertexUvs[0].push([new T.Vector2(1/3,1/3), new T.Vector2(2/3,2/3), new T.Vector2(1/3,2/3)]);
        let f3 = new T.Face3(2,1,6);
        geometry.faces.push(f3);
        geometry.faceVertexUvs[0].push([new T.Vector2(2/3,1/3), new T.Vector2(1,1/3), new T.Vector2(1,2/3)]);
        let f4 = new T.Face3(2,6,7);
        geometry.faces.push(f4);
        geometry.faceVertexUvs[0].push([new T.Vector2(2/3,1/3), new T.Vector2(1,2/3), new T.Vector2(2/3,2/3)]);
        let f5 = new T.Face3(4,7,6);
        geometry.faces.push(f5);
        geometry.faceVertexUvs[0].push([new T.Vector2(1/3,2/3), new T.Vector2(2/3,2/3), new T.Vector2(2/3,1)]);
        let f6 = new T.Face3(4,6,5);
        geometry.faces.push(f6);
        geometry.faceVertexUvs[0].push([new T.Vector2(1/3,2/3), new T.Vector2(2/3,1), new T.Vector2(1/3,1)]);
        let f7 = new T.Face3(0,3,4);
        geometry.faces.push(f7);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,1/3), new T.Vector2(1/3,1/3), new T.Vector2(1/3,2/3)]);
        let f8 = new T.Face3(0,4,5);
        geometry.faces.push(f8);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,1/3), new T.Vector2(1/3,2/3), new T.Vector2(0,2/3)]);
        let f9 = new T.Face3(0,1,2);
        geometry.faces.push(f9);
        geometry.faceVertexUvs[0].push([new T.Vector2(1/3,0), new T.Vector2(2/3,0), new T.Vector2(2/3,1/3)]);
        let f10 = new T.Face3(0,2,3);
        geometry.faces.push(f10);
        geometry.faceVertexUvs[0].push([new T.Vector2(1/3,0), new T.Vector2(2/3,1/3), new T.Vector2(1/3,1/3)]);
        
        let f11 = new T.Face3(1,0,5);
        geometry.faces.push(f11);
        geometry.faceVertexUvs[0].push([new T.Vector2(2/3,0), new T.Vector2(1,0), new T.Vector2(1,1/3)]);
        let f12 = new T.Face3(1,5,6);
        geometry.faces.push(f12);
        geometry.faceVertexUvs[0].push([new T.Vector2(2/3,0), new T.Vector2(1,1/3), new T.Vector2(2/3,1/3)]);
        
        geometry.computeFaceNormals();
        geometry.uvsNeedUpdate=true;
        //

        let tl=new T.TextureLoader().load("./Texture/wall2.jpg");
        let material = new T.MeshStandardMaterial({map:tl});
        
        //roof
        let f21 = new T.Face3(4,7,8);
        f21.materialIndex = 1;
        geometry.faces.push(f21);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,0), new T.Vector2(1,1)]);
        let f22 = new T.Face3(7,6,8);
        f22.materialIndex = 1;
        geometry.faces.push(f22);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,1), new T.Vector2(0,1)]);
        let f23 = new T.Face3(6,5,8);
        f23.materialIndex = 1;
        geometry.faces.push(f23);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,0), new T.Vector2(1,1)]);
        let f24 = new T.Face3(4,8,5);
        f24.materialIndex = 1;
        geometry.faces.push(f24);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,1), new T.Vector2(0,1)]);
        //window
        let f33 = new T.Face3(9,10,11);
        f33.materialIndex = 2;
        geometry.faces.push(f33);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,0), new T.Vector2(1,1)]);
        let f34 = new T.Face3(9,11,12);
        f34.materialIndex = 2;
        geometry.faces.push(f34);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,1), new T.Vector2(0,1)]);
       
        //door
        let f43 = new T.Face3(13,14,15);
        f43.materialIndex = 3;
        geometry.faces.push(f43);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,0), new T.Vector2(1,1)]);
        let f44 = new T.Face3(13,15,16);
        f44.materialIndex = 3;
        geometry.faces.push(f44);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,1), new T.Vector2(0,1)]);
       
        let t2=new T.TextureLoader().load("./Texture/roof4.jpg");
        let material2 = new T.MeshStandardMaterial({map:t2});
        let t3=new T.TextureLoader().load("./Texture/window3.jpg");
        let material3 = new T.MeshStandardMaterial({map:t3});
        let t4=new T.TextureLoader().load("./Texture/door2.jpeg");
        let material4 = new T.MeshStandardMaterial({map:t4});
        let mesh = new T.Mesh(geometry,[material, material2,material3, material4]);

        super("TwoTriangles1",mesh);
    }
}




export class GrBuilding3 extends GrObject {
    constructor() {
        let building = new T.Group();
        let geometry = new T.Geometry();
        let width = 2, height = 1;
        geometry.vertices.push(new T.Vector3( 0,0, 0));//0
        geometry.vertices.push(new T.Vector3( width,0, 0));//1
        geometry.vertices.push(new T.Vector3( width,0, width));//2
        geometry.vertices.push(new T.Vector3( 0,0, width));//3
        geometry.vertices.push(new T.Vector3( 0,height, width));//4
        geometry.vertices.push(new T.Vector3( 0,height, 0));//5
        geometry.vertices.push(new T.Vector3( width,height, 0));//6
        geometry.vertices.push(new T.Vector3( width,height, width));//7
        geometry.vertices.push(new T.Vector3( width,height*1.5, width/2));//8
        geometry.vertices.push(new T.Vector3( 0,height*1.5, width/2));//9
        //window
        height = height-0.5, width = width + 0.01;
        geometry.vertices.push(new T.Vector3( 1.2*width/3-0.5,height/1.5, width));//10
        geometry.vertices.push(new T.Vector3( 1.2*width*2/3-0.5,height/1.5, width));//11
        geometry.vertices.push(new T.Vector3( 1.2*width*2/3-0.5,height/1.5+1.5*width/6, width));//12
        geometry.vertices.push(new T.Vector3( 1.2*width/3-0.5,height/1.5+1.5*width/6, width));//13
        //door
        height = height;
        let door_width=0.4,width2 = width -0.3;
        geometry.vertices.push(new T.Vector3( width2-door_width,0, width));//14
        geometry.vertices.push(new T.Vector3( width2,0, width));//15
        geometry.vertices.push(new T.Vector3( width2,door_width*2, width));//16
        geometry.vertices.push(new T.Vector3( width2-door_width,door_width*2, width));//17
        
        //
        geometry.faceVertexUvs = [ [] ];
        let f1 = new T.Face3(3,2,7);
        geometry.faces.push(f1);
        geometry.faceVertexUvs[0].push([new T.Vector2(1/3,1/3), new T.Vector2(2/3,1/3), new T.Vector2(2/3,2/3)]);
        let f2 = new T.Face3(3,7,4);
        geometry.faces.push(f2);
        geometry.faceVertexUvs[0].push([new T.Vector2(1/3,1/3), new T.Vector2(2/3,2/3), new T.Vector2(1/3,2/3)]);
        let f3 = new T.Face3(2,1,6);
        geometry.faces.push(f3);
        geometry.faceVertexUvs[0].push([new T.Vector2(2/3,1/3), new T.Vector2(1,1/3), new T.Vector2(1,2/3)]);
        let f4 = new T.Face3(2,6,7);
        geometry.faces.push(f4);
        geometry.faceVertexUvs[0].push([new T.Vector2(2/3,1/3), new T.Vector2(1,2/3), new T.Vector2(2/3,2/3)]);
        let f5 = new T.Face3(4,7,6);
        geometry.faces.push(f5);
        geometry.faceVertexUvs[0].push([new T.Vector2(1/3,2/3), new T.Vector2(2/3,2/3), new T.Vector2(2/3,1)]);
        let f6 = new T.Face3(4,6,5);
        geometry.faces.push(f6);
        geometry.faceVertexUvs[0].push([new T.Vector2(1/3,2/3), new T.Vector2(2/3,1), new T.Vector2(1/3,1)]);
        let f7 = new T.Face3(0,3,4);
        geometry.faces.push(f7);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,1/3), new T.Vector2(1/3,1/3), new T.Vector2(1/3,2/3)]);
        let f8 = new T.Face3(0,4,5);
        geometry.faces.push(f8);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,1/3), new T.Vector2(1/3,2/3), new T.Vector2(0,2/3)]);
        let f9 = new T.Face3(0,1,2);
        geometry.faces.push(f9);
        geometry.faceVertexUvs[0].push([new T.Vector2(1/3,0), new T.Vector2(2/3,0), new T.Vector2(2/3,1/3)]);
        let f10 = new T.Face3(0,2,3);
        geometry.faces.push(f10);
        geometry.faceVertexUvs[0].push([new T.Vector2(1/3,0), new T.Vector2(2/3,1/3), new T.Vector2(1/3,1/3)]);
        
        let f11 = new T.Face3(1,0,5);
        geometry.faces.push(f11);
        geometry.faceVertexUvs[0].push([new T.Vector2(2/3,0), new T.Vector2(1,0), new T.Vector2(1,1/3)]);
        let f12 = new T.Face3(1,5,6);
        geometry.faces.push(f12);
        geometry.faceVertexUvs[0].push([new T.Vector2(2/3,0), new T.Vector2(1,1/3), new T.Vector2(2/3,1/3)]);
        
        geometry.computeFaceNormals();
        geometry.uvsNeedUpdate=true;
        //

        let tl=new T.TextureLoader().load("./Texture/wall4.jpg");
        let material = new T.MeshStandardMaterial({map:tl});
        
        //roof
        let f21 = new T.Face3(4,7,8);
        f21.materialIndex = 1;
        geometry.faces.push(f21);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1/4,0), new T.Vector2(1/4,1/4)]);
        let f22 = new T.Face3(4,8,9);
        f22.materialIndex = 1;
        geometry.faces.push(f22);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1/4,1/4), new T.Vector2(0,1/4)]);
        let f23 = new T.Face3(6,5,9);
        f23.materialIndex = 1;
        geometry.faces.push(f23);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,0), new T.Vector2(1,1)]);
        let f24 = new T.Face3(6,9,8);
        f24.materialIndex = 1;
        geometry.faces.push(f24);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,1), new T.Vector2(0,1)]);
        let f25 = new T.Face3(9,5,4);
        f25.materialIndex = 1;
        geometry.faces.push(f25);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,0), new T.Vector2(1,1)]);
        let f26 = new T.Face3(8,7,6);
        f26.materialIndex = 1;
        geometry.faces.push(f26);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,1), new T.Vector2(0,1)]);
        
        //window
        let f33 = new T.Face3(10,11,12);
        f33.materialIndex = 2;
        geometry.faces.push(f33);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,0), new T.Vector2(1,1)]);
        let f34 = new T.Face3(10,12,13);
        f34.materialIndex = 2;
        geometry.faces.push(f34);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,1), new T.Vector2(0,1)]);
       
        //door
        let f43 = new T.Face3(14,15,16);
        f43.materialIndex = 3;
        geometry.faces.push(f43);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,0), new T.Vector2(1,1)]);
        let f44 = new T.Face3(14,16,17);
        f44.materialIndex = 3;
        geometry.faces.push(f44);
        geometry.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(1,1), new T.Vector2(0,1)]);
       
        let t2=new T.TextureLoader().load("./Texture/roof2.jpg");
        let material2 = new T.MeshStandardMaterial({map:t2});
        let t3=new T.TextureLoader().load("./Texture/window1.jpg");
        let material3 = new T.MeshStandardMaterial({map:t3});
        let t4=new T.TextureLoader().load("./Texture/door3.jpg");
        let material4 = new T.MeshStandardMaterial({map:t4});
        let mesh = new T.Mesh(geometry,[material, material2,material3, material4]);

        let chimney_geom = new T.BoxGeometry( 0.3, 1, 0.3 );
		let chimney_mat = new T.MeshStandardMaterial({color:"white", metalness:0.5, roughness:0.2});
        let chimney = new T.Mesh(chimney_geom, chimney_mat);
        building.add(mesh,chimney);
        chimney.translateY(1.4);
        chimney.translateZ(1.3);
        chimney.translateX(0.5);
        super("TwoTriangles1",building);
    }
}

