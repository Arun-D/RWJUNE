class UploadTest extends React.Component {
  constructor(props){
    super(props)
  
    this.state = {
      file: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.draw = this.draw.bind(this)

  }
  handleChange(event) {
    console.log('proper1',this.props)
    var formData = new FormData();
            formData.append("file", event.target.files[0]);
            formData.append("name", 'uploadimage');
            fetch("https://live.productimize.com/promizenode/"+ "uploadImageWithRemoveWhite/" + parseInt('500') + '/' + parseInt('500'), {
                method: "POST",
                body: formData
            })
                .then(res => res.json())
                .then(response => {console.log(response)
               let image_pathe = "https://live.productimize.com/promizenode/"+response["resized_image"]
              console.log('iamge', image_pathe)
              
    this.setState({
      file: image_pathe
    })
    this.props.testfun1(event,image_pathe)
console.log(this.props)    
    var img = new Image();
    // img.onload = this.draw;
    img.src = image_pathe;
console.log(img,"eeee")
   // img.src = URL.createObjectURL(this.files[0]);
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img, canvas.width / 2 - img.width / 2,
      canvas.height / 2 - img.height / 2);
  })
  }
  draw() {
    let ctx = document.getElementById('mycanvas').getContext('2d');
    img.src = URL.createObjectURL(event.target.files[0]);

    // let ctx = myCanvas.getContext('2d');
    let img = new Image();
    img.onload = function(){
      myCanvas.width = "500"
      myCanvas.height = "500"
        ctx.drawImage(img,canvas.width / 2 - event.target.files[0].width / 2,
          canvas.height / 2 - event.target.files[0].height / 2);
     
    };

    
  }
  render() {
    return (
      <div id="mypopup" className="testupload" >
        <input type="file" onChange={this.handleChange}>         
          </input>
  </div>
     
    );
  }
}
