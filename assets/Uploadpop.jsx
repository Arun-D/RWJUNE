class Popup extends React.Component {

  
    
    
    testfun1(event,image_pathe){
        const getMeta = (url)=>{
            var w; var h;
            var imgx=new Image;
            imgx.src=url;
            imgx.onload=function(){w=this.width; h=this.height;};
            return {w:w,h:h}    
           }
        event.preventDefault()
        let metdata =  getMeta(image_pathe)
      let checknum =   document.getElementsByClassName('customupload-canvas')
      console.log("checknum", checknum)
        
        var main_canvas = document.getElementById('pz_preview_image');
        let dataUrl = main_canvas.toDataURL();
        var controls = [];
        var image;
  var backgroundImage;
  var uploadedhouseimage = image_pathe;
  var canvas;
  var context;
  const triangles = [];
  var dirtyTriangles = true;
  const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('door_inputs');
var myobject = JSON.parse(myParam)
var doorcount = Object.keys(myobject).length
  var  urls = new Array(doorcount).fill(dataUrl)

  var urls =  Array(doorcount).fill(dataUrl)
  
  var rand = function(s,e) {
      return Math.random() * (e-s) + s;
  }
  
  const downloadImage = url => {
      return new Promise((resolve, reject) => {
          let img = new Image()
          img.crossOrigin = 'anonymous'
          img.addEventListener('load', e => resolve(img))
          img.addEventListener('error', () => {
              reject(new Error(`Failed to load image from URL: ${url}`))
          })
          img.src = url
      })
  }

 
  
  const createControls = (index) => {
      var  count = index
       
       console.log(count)
      let controlGroup = []
      for (var i = 0; i < 4; ++i) {
          var control = document.createElement('div')
          control.className = 'node'
          document.getElementsByClassName('customupload-canvas')[0].appendChild(control)
          controlGroup.push(control)
      }
      
      // controlGroup[0].style.left = `${rand(25, 225)}px`
      // controlGroup[0].style.top = `${rand(25, 225)}px`
  
      // controlGroup[1].style.left = `${rand(250, 475)}px`
      // controlGroup[1].style.top = `${rand(25, 225)}px`
  
      // controlGroup[2].style.left = `${rand(250, 475)}px`
      // controlGroup[2].style.top = `${rand(250, 475)}px`
  
      // controlGroup[3].style.left = `${rand(25, 225)}px`
      // controlGroup[3].style.top = `${rand(250, 475)}px`
  if (count == 0){
      controlGroup[0].style.left = `125px`
      controlGroup[0].style.top = `125px`
  
      controlGroup[1].style.left = `150px`
      controlGroup[1].style.top = `125px`
  
      controlGroup[2].style.left = `150px`
      controlGroup[2].style.top = `150px`
  
      controlGroup[3].style.left = `125px`
      controlGroup[3].style.top = `150px`
  }
  else if(count == 1){
  
          controlGroup[0].style.left = `125px`
          controlGroup[0].style.top = `200px`
      
          controlGroup[1].style.left = `150px`
          controlGroup[1].style.top = `200px`
      
          controlGroup[2].style.left = `150px`
          controlGroup[2].style.top = `225px`
      
          controlGroup[3].style.left = `125px`
          controlGroup[3].style.top = `225px`
      
  
  }
  else if(count == 2){
      controlGroup[0].style.left = `125px`
      controlGroup[0].style.top = `275px`
  
      controlGroup[1].style.left = `150px`
      controlGroup[1].style.top = `275px`
  
      controlGroup[2].style.left = `150px`
      controlGroup[2].style.top = `300px`
  
      controlGroup[3].style.left = `125px`
      controlGroup[3].style.top = `300px`
  
  }
  else if(count == 3){
      controlGroup[0].style.left = `125px`
      controlGroup[0].style.top = `350px`
  
      controlGroup[1].style.left = `150px`
      controlGroup[1].style.top = `350px`
  
      controlGroup[2].style.left = `150px`
      controlGroup[2].style.top = `375px`
  
      controlGroup[3].style.left = `125px`
      controlGroup[3].style.top = `375px`
  
  }
            // $(controls[0]).css('left', canvas.width/2 - 50 );
            // $(controls[0]).css('top', canvas.height/2 - 50 );

            // $(controls[1]).css('left', canvas.width/2 + 100);
            // $(controls[1]).css('top', canvas.height/2 - 50);

            // $(controls[2]).css('left', canvas.width/2 + 100);
            // $(controls[2]).css('top', canvas.height/2 + 100);

            // $(controls[3]).css('left', canvas.width/2 - 50);
            // $(controls[3]).css('top',  canvas.height/2 + 100);

  
      return controlGroup
  }
  
  const init = async () => {
    
    let childrens_for_canvas = document.getElementsByClassName('customupload-canvas')[0]
    childrens_for_canvas.querySelectorAll('*').forEach(n => n.remove());
    canvas = document.createElement('canvas')
      canvas.width = 1000
      canvas.height = 500
      document.getElementsByClassName('customupload-canvas')[0].appendChild(canvas)
      context = canvas.getContext('2d')
      
      let node = null

      const getMeta = (url)=>{
        var w; var h;
        var imgx=new Image;
        imgx.src=url;
        imgx.onload=function(){w=this.width; h=this.height;};
        return {w:w,h:h}    
       }
  
   const moveControl = e => {
        const rect = document.getElementsByClassName('customupload-canvas')[0].getBoundingClientRect()
        let x = e.clientX - rect.left
        let y = e.clientY - rect.top
        node.style.left = `${x}px`
        node.style.top = `${y}px`
        dirtyTriangles = true
      }
  
      const removeListner = () => {
          document.getElementsByClassName('popup-body')[0].removeEventListener('mousemove', moveControl)
          document.getElementsByClassName('popup-body')[0].removeEventListener('mouseup', removeListner)
      }
  
      document.getElementsByClassName('popup-body')[0].addEventListener('mousedown', e => {
          if(e.target.className === 'node') {
              node = e.target
              document.getElementsByClassName('popup-body')[0].addEventListener('mousemove', moveControl)
              document.getElementsByClassName('popup-body')[0].addEventListener('mouseup', removeListner)
          }
      })
  
      const images = []
      for(const [index , url] of urls.entries()) {
          controls.push(createControls(index))
          const image = await downloadImage(url)
          images.push(image)
      }
      const animate = () => {
          context.clearRect(0,0,1000,500)
          backgroundImage = new Image();
          backgroundImage.src=uploadedhouseimage;
let temp_height
if(backgroundImage.height/2 > canvas.height/2){
    temp_height = 0
}
else{
    temp_height = canvas.height/2 - backgroundImage.height/2
}
          context.drawImage(backgroundImage, canvas.width/2 - backgroundImage.width/2, temp_height);
          for (const [i, image] of images.entries()) {
              draw(image, controls[i], i)
          }
          requestAnimationFrame(animate)
      }
      animate()
  }
  init()
  
  var draw = function(image, control, index) {
      var render = function(wireframe, image, tri) {
          
          if (!wireframe) {
            //   context.strokeStyle = "black";
              context.beginPath();
              context.moveTo(tri.p0.x, tri.p0.y);
              context.lineTo(tri.p1.x, tri.p1.y);
              context.lineTo(tri.p2.x, tri.p2.y);
              context.lineTo(tri.p0.x, tri.p0.y);
            //   context.stroke();
              context.closePath();
          }
  
          if (image) {
              drawTriangle(context, image,
                           tri.p0.x, tri.p0.y,
                           tri.p1.x, tri.p1.y,
                           tri.p2.x, tri.p2.y,
                           tri.t0.u, tri.t0.v,
                           tri.t1.u, tri.t1.v,
                           tri.t2.u, tri.t2.v);
          }
      }
  
      triangles[index] = calculateGeometry(image, control)
  
      for (triangle of triangles[index]) {
          render(true, image, triangle);
      }
  }
  
  var calculateGeometry = function(image, control) {
      // clear triangles out
      const triangleGroup = [];
  
      // generate subdivision
      var subs = 7; // vertical subdivisions
      var divs = 7; // horizontal subdivisions
  
      var p1 = new Point(parseInt(control[0].style.left) , parseInt(control[0].style.top) );
      var p2 = new Point(parseInt(control[1].style.left) , parseInt(control[1].style.top) );
      var p3 = new Point(parseInt(control[2].style.left) , parseInt(control[2].style.top) );
      var p4 = new Point(parseInt(control[3].style.left) , parseInt(control[3].style.top) );
  
      var dx1 = p4.x - p1.x;
      var dy1 = p4.y - p1.y;
      var dx2 = p3.x - p2.x;
      var dy2 = p3.y - p2.y;
  
      var imgW = image.naturalWidth;
      var imgH = image.naturalHeight;
  
      for (var sub = 0; sub < subs; ++sub) {
          var curRow = sub / subs;
          var nextRow = (sub + 1) / subs;
  
          var curRowX1 = p1.x + dx1 * curRow;
          var curRowY1 = p1.y + dy1 * curRow;
          
          var curRowX2 = p2.x + dx2 * curRow;
          var curRowY2 = p2.y + dy2 * curRow;
  
          var nextRowX1 = p1.x + dx1 * nextRow;
          var nextRowY1 = p1.y + dy1 * nextRow;
          
          var nextRowX2 = p2.x + dx2 * nextRow;
          var nextRowY2 = p2.y + dy2 * nextRow;
  
          for (var div = 0; div < divs; ++div) {
              var curCol = div / divs;
              var nextCol = (div + 1) / divs;
  
              var dCurX = curRowX2 - curRowX1;
              var dCurY = curRowY2 - curRowY1;
              var dNextX = nextRowX2 - nextRowX1;
              var dNextY = nextRowY2 - nextRowY1;
  
              var p1x = curRowX1 + dCurX * curCol;
              var p1y = curRowY1 + dCurY * curCol;
  
              var p2x = curRowX1 + (curRowX2 - curRowX1) * nextCol;
              var p2y = curRowY1 + (curRowY2 - curRowY1) * nextCol;
  
              var p3x = nextRowX1 + dNextX * nextCol;
              var p3y = nextRowY1 + dNextY * nextCol;
  
              var p4x = nextRowX1 + dNextX * curCol;
              var p4y = nextRowY1 + dNextY * curCol;
  
              var u1 = curCol * imgW;
              var u2 = nextCol * imgW;
              var v1 = curRow * imgH;
              var v2 = nextRow * imgH;
  
              var triangle1 = new Triangle(
                  new Point(p1x, p1y),
                  new Point(p3x, p3y),
                  new Point(p4x, p4y),
                  new TextCoord(u1, v1),
                  new TextCoord(u2, v2),
                  new TextCoord(u1, v2)
              );
  
              var triangle2 = new Triangle(
                  new Point(p1x, p1y),
                  new Point(p2x, p2y),
                  new Point(p3x, p3y),
                  new TextCoord(u1, v1),
                  new TextCoord(u2, v1),
                  new TextCoord(u2, v2)
              );
  
              triangleGroup.push(triangle1);
              triangleGroup.push(triangle2);
          }
      }
      
      return triangleGroup
  }
  var drawQuad = function(ctx, im, x0, y0, x1, y1, x2, y2, x3, y3, sx0, sy0, sx1, sy1, sx2, sy2) {
    ctx.lineWidth = "0.000000000000000000000000000000000000000001"

    ctx.strokeWidth = "0";

    ctx.save();

    // Clip the output to the on-screen triangle boundaries.
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    //ctx.stroke();//xxxxxxx for wireframe
    ctx.clip();

    /*
      ctx.transform(m11, m12, m21, m22, dx, dy) sets the context transform matrix.

      The context matrix is:

      [ m11 m21 dx ]
      [ m12 m22 dy ]
      [  0   0   1 ]

      Coords are column vectors with a 1 in the z coord, so the transform is:
      x_out = m11 * x + m21 * y + dx;
      y_out = m12 * x + m22 * y + dy;

      From Maxima, these are the transform values that map the source
      coords to the dest coords:

      sy0 (x2 - x1) - sy1 x2 + sy2 x1 + (sy1 - sy2) x0
      [m11 = - -----------------------------------------------------,
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

      sy1 y2 + sy0 (y1 - y2) - sy2 y1 + (sy2 - sy1) y0
      m12 = -----------------------------------------------------,
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

      sx0 (x2 - x1) - sx1 x2 + sx2 x1 + (sx1 - sx2) x0
      m21 = -----------------------------------------------------,
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

      sx1 y2 + sx0 (y1 - y2) - sx2 y1 + (sx2 - sx1) y0
      m22 = - -----------------------------------------------------,
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

      sx0 (sy2 x1 - sy1 x2) + sy0 (sx1 x2 - sx2 x1) + (sx2 sy1 - sx1 sy2) x0
      dx = ----------------------------------------------------------------------,
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0

      sx0 (sy2 y1 - sy1 y2) + sy0 (sx1 y2 - sx2 y1) + (sx2 sy1 - sx1 sy2) y0
      dy = ----------------------------------------------------------------------]
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0
    */

    // TODO: eliminate common subexpressions.
    var denom = sx0 * (sy2 - sy1) - sx1 * sy2 + sx2 * sy1 + (sx1 - sx2) * sy0;
    if (denom == 0) {
      return;
    }
    var m11 = - (sy0 * (x2 - x1) - sy1 * x2 + sy2 * x1 + (sy1 - sy2) * x0) / denom;
    var m12 = (sy1 * y2 + sy0 * (y1 - y2) - sy2 * y1 + (sy2 - sy1) * y0) / denom;
    var m21 = (sx0 * (x2 - x1) - sx1 * x2 + sx2 * x1 + (sx1 - sx2) * x0) / denom;
    var m22 = - (sx1 * y2 + sx0 * (y1 - y2) - sx2 * y1 + (sx2 - sx1) * y0) / denom;
    var dx = (sx0 * (sy2 * x1 - sy1 * x2) + sy0 * (sx1 * x2 - sx2 * x1) + (sx2 * sy1 - sx1 * sy2) * x0) / denom;
    var dy = (sx0 * (sy2 * y1 - sy1 * y2) + sy0 * (sx1 * y2 - sx2 * y1) + (sx2 * sy1 - sx1 * sy2) * y0) / denom;

    ctx.transform(m11, m12, m21, m22, dx, dy);

    // Draw the whole image.  Transform and clip will map it onto the
    // correct output triangle.
    //
    // TODO: figure out if drawImage goes faster if we specify the rectangle that
    // bounds the source coords.
    ctx.drawImage(im, 0, 0);
    ctx.restore();
  };
  // from http://tulrich.com/geekstuff/canvas/jsgl.js
  var drawTriangle = function(ctx, im, x0, y0, x1, y1, x2, y2,
      sx0, sy0, sx1, sy1, sx2, sy2) {
       drawQuad(ctx, im, x0, y0, x1, y1, x2, y2, x2, y2, sx0, sy0, sx1, sy1, sx2, sy2);

        ctx.save();

        ctx.strokeWidth = "0";


      // Clip the output to the on-screen triangle boundaries.
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.closePath();
      ctx.clip();
  
      /*
      ctx.transform(m11, m12, m21, m22, dx, dy) sets the context transform matrix.
  
      The context matrix is:
  
      [ m11 m21 dx ]
      [ m12 m22 dy ]
      [  0   0   1 ]
  
      Coords are column vectors with a 1 in the z coord, so the transform is:
      x_out = m11 * x + m21 * y + dx;
      y_out = m12 * x + m22 * y + dy;
  
      From Maxima, these are the transform values that map the source
      coords to the dest coords:
  
      sy0 (x2 - x1) - sy1 x2 + sy2 x1 + (sy1 - sy2) x0
      [m11 = - -----------------------------------------------------,
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0
  
      sy1 y2 + sy0 (y1 - y2) - sy2 y1 + (sy2 - sy1) y0
      m12 = -----------------------------------------------------,
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0
  
      sx0 (x2 - x1) - sx1 x2 + sx2 x1 + (sx1 - sx2) x0
      m21 = -----------------------------------------------------,
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0
  
      sx1 y2 + sx0 (y1 - y2) - sx2 y1 + (sx2 - sx1) y0
      m22 = - -----------------------------------------------------,
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0
  
      sx0 (sy2 x1 - sy1 x2) + sy0 (sx1 x2 - sx2 x1) + (sx2 sy1 - sx1 sy2) x0
      dx = ----------------------------------------------------------------------,
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0
  
      sx0 (sy2 y1 - sy1 y2) + sy0 (sx1 y2 - sx2 y1) + (sx2 sy1 - sx1 sy2) y0
      dy = ----------------------------------------------------------------------]
      sx0 (sy2 - sy1) - sx1 sy2 + sx2 sy1 + (sx1 - sx2) sy0
    */
  
      // TODO: eliminate common subexpressions.
      var denom = sx0 * (sy2 - sy1) - sx1 * sy2 + sx2 * sy1 + (sx1 - sx2) * sy0;
      if (denom == 0) {
          return;
      }
      var m11 = -(sy0 * (x2 - x1) - sy1 * x2 + sy2 * x1 + (sy1 - sy2) * x0) / denom;
      var m12 = (sy1 * y2 + sy0 * (y1 - y2) - sy2 * y1 + (sy2 - sy1) * y0) / denom;
      var m21 = (sx0 * (x2 - x1) - sx1 * x2 + sx2 * x1 + (sx1 - sx2) * x0) / denom;
      var m22 = -(sx1 * y2 + sx0 * (y1 - y2) - sx2 * y1 + (sx2 - sx1) * y0) / denom;
      var dx = (sx0 * (sy2 * x1 - sy1 * x2) + sy0 * (sx1 * x2 - sx2 * x1) + (sx2 * sy1 - sx1 * sy2) * x0) / denom;
      var dy = (sx0 * (sy2 * y1 - sy1 * y2) + sy0 * (sx1 * y2 - sx2 * y1) + (sx2 * sy1 - sx1 * sy2) * y0) / denom;
  
      ctx.transform(m11, m12, m21, m22, dx, dy);
  
      // Draw the whole image.  Transform and clip will map it onto the
      // correct output triangle.
      //
      // TODO: figure out if drawImage goes faster if we specify the rectangle that
      // bounds the source coords.
      ctx.drawImage(im, 0, 0);
      ctx.restore();
      drawQuad(ctx, im, x0, y0, x1, y1, x2, y2, x2, y2, sx0, sy0, sx1, sy1, sx2, sy2);

  };
  
  
  // point class
  
  var Point = function(x,y) {
      this.x = x?x:0;
      this.y = y?y:0;
  }
  
  var p = Point.prototype;
  
  p.length = function(point) {
      point = point?point:new Point();
      var xs =0, ys =0;
      xs = point.x - this.x;
      xs = xs * xs;
  
      ys = point.y - this.y;
      ys = ys * ys;
      return Math.sqrt( xs + ys );
  }
  
  var TextCoord = function(u,v) {
      this.u = u?u:0;
      this.v = v?v:0;
  }
  
  var Triangle = function(p0, p1, p2, t0, t1, t2) {
      this.p0 = p0;
      this.p1 = p1;
      this.p2 = p2;
  
      this.t0 = t0;
      this.t1 = t1;
      this.t2 = t2;
  }
      }

    render() {
        return (
            <div className='popup'>
                <div className='popup_inner'>
                   <div className='popup-header'>
                       <h1 className='popup-title'>{this.props.text}</h1>
                       <button className='close-btn' onClick={this.props.closePopup}>x</button>
                   </div>
                   <div className='popup-body'>
                       
                       <UploadTest testfun1={this.testfun1}/>
                       <div className="customupload-canvas">

                       </div>
                   </div>
                </div>
            </div>
        );
    }
}

class Apppop extends React.Component {
    constructor() {
        super();
        this.state = {
            showPopup: false,
        };
       let StaticContent = true;

       console.log('hell',StaticContent)

    }

    togglePopup() {
        this.setState({
            showPopup: !this.state.showPopup
        });
        testfun1()
    }

    testfun() {
        alert();
//         $('.box').click(function(){
// 			console.log('helo')
// 		image = new Image();
// 	$(image).on('load',function() {
// 		setInterval(draw, 1000 / 60);
// 	});
// 	$(image).attr('src', 'https://homepages.cae.wisc.edu/~ece533/images/cat.png');
// 	canvas = document.createElement('canvas');
// 	$(canvas).attr('width', 500);
// 	$(canvas).attr('height', 500);
// 	$('.box').append(canvas);

// 	context = canvas.getContext('2d');
// console.log('context', context)
// 	//
// 	for (var i = 0; i < 4; ++i) {
// 		var control = document.createElement('div');
// 		$(control).addClass('node');
// 		$('.box').append(control);
// 		controls.push(control);
// 	}

// 	$(controls[0]).css('left', rand(25, 225));
// 	$(controls[0]).css('top', rand(25, 225));

// 	$(controls[1]).css('left', rand(250, 475));
// 	$(controls[1]).css('top', rand(25, 225));

// 	$(controls[2]).css('left', rand(250, 475));
// 	$(controls[2]).css('top', rand(250, 475));

// 	$(controls[3]).css('left', rand(25, 225));
// 	$(controls[3]).css('top', rand(250, 475));

// 	$('body').mousedown(function(e) {
// 		if ($(e.target).hasClass('node')) {
// 			var node = e.target;

// 			$('body').mousemove(function(e) {
// 				var x = e.pageX;
// 				var y = e.pageY;
// 				$(node).css('left', x);
// 				$(node).css('top', y);
// 				dirtyTriangles = true;
// 			});

// 			$('body').mouseup(function(e) {
// 				$('body').off( "mousemove" );
// 				$('body').off( "mouseup" );
// 			});
// 		}
// 	});
//     })
    }

    render() {
        return (
            <div className='app pz-btn-home-container'>
                <button className={ this.props.StaticContent ?'pz-btn-home': 'pz-btn-home hide'}   onClick={this.togglePopup.bind(this)}>Upload your Home</button>
                {this.state.showPopup ?
                    <Popup
                        text='Show in My Home'
                        closePopup={this.togglePopup.bind(this)}
                    />
                    : null
                }
            </div>
        );
    }
};
  
  
  
