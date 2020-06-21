const PZUploadImage = (props) => {
    const pzTabAttribute = props.pzUploadImage;
    const pzAttrImageValue = props.pzUploadImage.promize_attribute_image_value;
    const images = props.pzActiveImages[pzTabAttribute.promize_tab_image_attribute_values_id] ? props.pzActiveImages[pzTabAttribute.promize_tab_image_attribute_values_id] : []
    let { pzSettings } = props

    return (
        <div className ="pz-upload-cover-section">
            <div className ="pz-upld-container">
                <ul className ="pz-upld-list">
                    {
                        images.length > 0 && images.map((image, index) => {
                            return (
                                <li key={index}><img src={images[0][2] ? image[1] : image[0]} /><button className ="pz-delete-upload" onClick={(e) => props.pzRemoveImage(image[3], pzTabAttribute)}><i className ="fa fa-trash"></i><span>Delete</span></button></li>)
                        })
                    }
                </ul>
                {(props.pzSettings[4] == 1) && images.length > 0 && <div className ="pz-rm-wt">
                    <label className="pz-checkbox">
                        <input type="checkbox" value={images[0][2]} checked={images[0][2]} onChange={e => { props.pzRemoveWhite(e, pzTabAttribute) }} /> Remove white
                        <span></span>
                    </label>
                </div>
                }
            </div>
            {pzTabAttribute.max_image_limit !== images.length && <div className ="pz-upload-wrapper">

                <div className ="pz-upload-control">
                    {
                        (props.pzUploadImageLoader) &&
                        <div className="pz-loader-cover">
                            <div className="pz-loader"></div>
                        </div>
                    }
                    <div className ="pz-upload-content">
                        <svg xmlns="http://www.w3.org/2000/svg" width="38.432" height="35.729"
                             viewBox="0 0 38.432 35.729">
                            <path
                                d="M32.427,0H6.005A6.012,6.012,0,0,0,0,6.005V27.023a6.012,6.012,0,0,0,6.005,6.005H26.5a1.5,1.5,0,1,0,0-3H20.968l-3.452-4.478L28.454,11.634l7.363,8.138a1.5,1.5,0,0,0,2.614-1.007V6.005A6.012,6.012,0,0,0,32.427,0Zm3,14.869L29.487,8.3a1.5,1.5,0,0,0-2.294.079L15.625,23.094,11.7,18a1.5,1.5,0,0,0-1.189-.585h0A1.5,1.5,0,0,0,9.319,18L6.015,22.3a1.5,1.5,0,0,0,2.38,1.831l2.115-2.75,6.667,8.649H6.005a3.006,3.006,0,0,1-3-3V6.005a3.006,3.006,0,0,1,3-3H32.427a3.006,3.006,0,0,1,3,3Zm0,0" />
                            <path
                                d="M84.5,72a4.5,4.5,0,1,0,4.5,4.5A4.509,4.509,0,0,0,84.5,72Zm0,6.005a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,84.5,78.005Zm0,0"
                                transform="translate(-73.995 -66.595)" />
                            <path
                                d="M361.667,289.122l-.013-.014a3.742,3.742,0,0,0-5.309-.006l-2.9,2.859a1.5,1.5,0,0,0,2.108,2.138l1.94-1.914v8.426a1.5,1.5,0,0,0,3,0v-8.38l1.857,1.918a1.5,1.5,0,1,0,2.157-2.088Zm0,0"
                                transform="translate(-326.502 -266.382)" /></svg>
                        <p className ="pz-upload-text"><span className ="sm-hide"> Drag & Drop Or <br /></span><span
                            className ="pz-text-hglt">Browse</span> <span className ="sm-hide"> Your Computer</span>
                        </p>
                    </div>
                    <input type="file" className ="pz-upload-file" onChange={(e) => props.pzUpload(event, pzTabAttribute, pzSettings)} />
                </div>
                {
                    <div className ="pz-upload-description">
                        <p className ="pz-upload-title">Supported Formats {(pzAttrImageValue.max_upload_size) ? `( Max size: ${pzAttrImageValue.max_upload_size} mb )` : ``}</p>
                        <ul className ="pz-upload-formats">
                            {pzAttrImageValue.image_format.split(',').map((format, index) => {
                                return <li key={index}>.{format}</li>
                            })}
                        </ul>
                        <p className ="error-msg-img-upload">{props.img_error_msg}</p>
                    </div>
                }
            </div>
            }
        </div>
    );
}
