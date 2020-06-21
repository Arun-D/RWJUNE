class PromizeUploadImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pzSettings: {
                1: 0, //scale (1-Yes, 0.-No)
                2: 0, //rotate (1-Yes, 0-No)
                3: 0, //remove (1-Yes, 0-No)
                4: 0, // enableRemoveWhite (1-Yes, 0-No)
                5: [], //color option (1-code, 2.pallete)
                6: 0,  //have default controls (1-Yes, 0-No)
                7: 1, //Show boundary (1-Yes, 0-No)
                9: 0, //showimageOutsideBoundary (1-Yes, 0-No)
                8: 0, //selectable (1-Yes, 0.-No)
                10: 0, //merge image with product  (1-Yes, 0.-No)
            },
            img_error_msg: '',
            imageSelectable: true,
            showboundary: 0,
            pzUploadImageLoader: false,
            //pzSettings: { enableRemoveWhite: false }
        }
    }

    pzUpload = (event, imageDetail, pzSettings) => {
        this.setState({pzUploadImageLoader: true});
        let { pzCanvasObject, pzCanvas, pzCurrentView, pzApiUrl, pzImgUrl, pzActiveImages, pzReplaceImg, pzCrossOrigin, pzProductPrice, pzQuantity } = this.props
        event.preventDefault();
        const imageBoundary = (imageDetail.boundary_position) ? JSON.parse(imageDetail.boundary_position) : '';
        let tabData = this.props.pzSubTab ? this.props.pzSubTab : this.props.pzTab
        const { width = 1000, height = 1000 } = (imageBoundary && this.props.pzCurrentView in imageBoundary) ? imageBoundary[pzCurrentView][0] : '';
        if (this.state.img_error_msg != '') {
            this.setState({ img_error_msg: "" });
        }
        var imgUploadStatus = this.pzUploadValidation(event, imageDetail);
        if (imgUploadStatus['imgStatus']) {
            var formData = new FormData();
            formData.append("file", event.target.files[0]);
            formData.append("name", 'uploadimage');
            fetch(pzApiUrl + "uploadImageWithRemoveWhite/" + parseInt(width) + '/' + parseInt(height), {
                method: "POST",
                body: formData
            })
                .then(res => res.json())
                .then(response => {
                    if(imageDetail.promize_attribute_image_value.image_price){
                        pzProductPrice = pzProductPrice + (parseFloat(imageDetail.promize_attribute_image_value.image_price) * pzQuantity)
                    }
                    // console.log(pzImgUrl + response.resized_image);
                    // console.log(pzImgUrl + response.resized_image.slice(1))
                    let resizedImage = pzImgUrl + response.resized_image.replace(pzReplaceImg, '')
                    let removedWhiteImage = pzImgUrl + response.removed_white_image.replace(pzReplaceImg, '')
                    if (pzActiveImages[imageDetail.promize_tab_image_attribute_values_id] == undefined) {
                        pzActiveImages[imageDetail.promize_tab_image_attribute_values_id] = []
                    }
                    let img_index = pzActiveImages[imageDetail.promize_tab_image_attribute_values_id].length
                    let removeWhite = pzActiveImages[imageDetail.promize_tab_image_attribute_values_id][0] ? pzActiveImages[imageDetail.promize_tab_image_attribute_values_id][0][2] : false
                    let img_url = removeWhite ? removedWhiteImage : resizedImage

                    pzActiveImages[imageDetail.promize_tab_image_attribute_values_id].push([resizedImage, removedWhiteImage, removeWhite, img_index])

                    if (Object.keys(imageBoundary).length > 0) {
                        // pzActiveImages[imageDetail.promize_tab_image_attribute_values_id].length > 0 && pzActiveImages[imageDetail.promize_tab_image_attribute_values_id].map((img, img_index) => {
                        imageBoundary[pzCurrentView].map((boundary, index) => {
                            const primaryImage = new Image()
                            primaryImage.src = img_url
                            primaryImage.onload = (imgSrc) => {
                                let pzImageProperty = { ...imageDetail, ...tabData, boundary: boundary, index: index, imageIndex: img_index, removedWhiteImage: removedWhiteImage, resizedImage: resizedImage, removeWhite: removeWhite, pzSettings: pzSettings };
                                pzImageProperty['src'] = img_url;
                                pzImageProperty['originalWidth'] = (imgSrc && imgSrc.path && imgSrc.path[0] && imgSrc.path[0].width) ? imgSrc.path[0].width : imgSrc.width ? imgSrc.width : (imgSrc.explicitOriginalTarget.width ? imgSrc.explicitOriginalTarget.width : 200);
                                pzImageProperty['originalHeight'] = (imgSrc && imgSrc.path && imgSrc.path[0] && imgSrc.path[0].height) ? imgSrc.path[0].height : imgSrc.height ? imgSrc.height : (imgSrc.explicitOriginalTarget.height ? imgSrc.explicitOriginalTarget.height : 200);
                                let pzObject = pzCreateCanvasObject(pzCurrentView, 'uploadimage', pzImageProperty, pzCanvas, pzCurrentView, pzCrossOrigin, this.props.HomeComponent)
                                if (pzImageProperty['src']) {
                                    pzAddObjectToCanvas(pzCanvas, pzObject, pzCrossOrigin, this.props.HomeComponent)
                                }
                                pzCanvasObject[pzCurrentView][pzObject.name] = pzObject;
                                this.props.HomeComponent.pzUpdateHistoryStack(pzObject);

                                this.setState({ pzUploadImageLoader: false});

                                this.props.HomeComponent.setState({ pzCanvasObject, pzActiveImages, pzProductPrice }, () => {
                                    event.target.value = "";
                                });
                            }
                        })

                        // })
                        //}
                    }
                })
        } else {
            this.setState({ img_error_msg: imgUploadStatus['imgErrorMsg'], pzUploadImageLoader: false});
        }
    }

    pzUploadValidation = (event, imageDetail) => {
        var files = event.target.files[0];
        const pzAttrImageValue = imageDetail.promize_attribute_image_value;
        const pzMaxUploadSize = (pzAttrImageValue.max_upload_size) ? pzAttrImageValue.max_upload_size : 1;
        const pzMinUploadSize = (pzAttrImageValue.min_upload_size) ? pzAttrImageValue.min_upload_size : 0;
        var imgStatus = true;
        var imgErrorMsg = '';
        var imgStatusArray = [];
        var fileExtension = (files.name).split('.').pop().toLowerCase();
        var fileExtensionArray = pzAttrImageValue.image_format.split(',');
        fileExtensionArray.length > 0 && fileExtensionArray.map((extension, index)=>{
            fileExtensionArray[index] = extension.toLowerCase().trim(); 
        })
        if (fileExtensionArray.length > 0 && !fileExtensionArray.includes(fileExtension)) {
            imgStatus = false;
            imgErrorMsg = 'File extension is Invalid!';
        }
        var fileSize = (files.size) / (1024 * 1024);
        if (fileSize > pzMaxUploadSize && fileSize < pzMinUploadSize) {
            imgStatus = false;
            imgErrorMsg = `File size is greater than ${pzMaxUploadSize} mb! and lesser than ${pzMinUploadSize} MB!`;
        }else if(parseInt(fileSize) >= 10){
            imgStatus = false;
            imgErrorMsg = `File size is greater than 10 MB!`;
        }
        let imageArray = this.props.pzActiveImages[imageDetail.promize_tab_image_attribute_values_id];
        if (imageDetail.max_image_limit != null && imageArray && imageDetail.max_image_limit < (imageArray.length + 1)) {
            imgStatus = false;
            imgErrorMsg = `Sorry! you can upload maximum of ${imageDetail.max_image_limit} file(s)`;
        }
        imgStatusArray['imgStatus'] = imgStatus;
        imgStatusArray['imgErrorMsg'] = imgErrorMsg;
        return imgStatusArray;
    }

    pzRemoveImage = (image_index, imageDetail) => {
        let { pzActiveImages,pzProductPrice, pzQuantity } = this.props
        const imageBoundary = (imageDetail.boundary_position) ? JSON.parse(imageDetail.boundary_position) : '';
        let { pzCanvasObject, pzCanvas, pzCurrentView } = this.props
        if (Object.keys(imageBoundary).length > 0) {
            imageBoundary[pzCurrentView].map((boundary, index) => {
                let objName = "FObject_image_" + imageDetail.promize_tab_attribute_id + '_' + index + '_' + image_index;
                delete pzCanvasObject[pzCurrentView][objName];
                let canvasObj = pzCanvas.getItemByName(objName);
                pzRemoveObjectFromCanvas(pzCanvas, canvasObj)
            })
            if(imageDetail.promize_attribute_image_value.image_price){
                pzProductPrice = pzProductPrice - (parseFloat(imageDetail.promize_attribute_image_value.image_price) * pzQuantity)
            }
            this.props.HomeComponent.setState({ pzCanvasObject, pzProductPrice });
        }
        let imageArray = pzActiveImages[imageDetail.promize_tab_image_attribute_values_id]
        const slicedArray = imageArray.filter((img, index) => img[3] !== image_index);
        pzActiveImages[imageDetail.promize_tab_image_attribute_values_id] = slicedArray
        this.props.HomeComponent.setState({ pzActiveImages })
    }

    pzRemoveWhite = (e, imageDetail) => {
        let { pzActiveImages, pzCrossOrigin } = this.props
        pzActiveImages[imageDetail.promize_tab_image_attribute_values_id][0][2] = e.target.checked;
        const imageBoundary = (imageDetail.boundary_position) ? JSON.parse(imageDetail.boundary_position) : '';
        let { pzCanvasObject, pzCanvas, pzCurrentView } = this.props
        if (Object.keys(imageBoundary).length > 0) {
            pzActiveImages[imageDetail.promize_tab_image_attribute_values_id].map((img, img_index) => {
                imageBoundary[pzCurrentView].map((boundary, index) => {
                    let objName = "FObject_image_" + imageDetail.promize_tab_attribute_id + '_' + index + '_' + img_index;
                    let canvasObj = pzCanvas.getItemByName(objName);
                    canvasObj['src'] = e.target.checked ? canvasObj.removedWhiteImage : canvasObj.resizedImage;
                    canvasObj['removeWhite'] = e.target.checked
                    pzCanvasObject[pzCurrentView][objName].src = e.target.checked ? canvasObj.removedWhiteImage : canvasObj.resizedImage;
                    pzCanvasObject[pzCurrentView][objName].removeWhite = e.target.checked
                    pzAddObjectToCanvas(pzCanvas, canvasObj, pzCrossOrigin, this.props.HomeComponent)
                })
            })
        }
        this.props.HomeComponent.setState({ pzActiveImages, pzCanvasObject })
    }

    render() {
        let pzAttributeSettings = this.props.pzAttribute.promize_attribute.promize_attribute_settings;
        let { pzSettings } = this.state;
        if (pzAttributeSettings.length > 0) {
            Object.keys(pzSettings).map((ref_id, setting_index) => {
                if (ref_id == 5) {
                    let selectedObject = pzAttributeSettings.filter((val) => {
                        return val.promize_setting.reference_id == ref_id
                    })
                    selectedObject.length > 0 && selectedObject.map((data) => {
                        if (!pzSettings[ref_id].includes(data.promize_setting.reference_value)) {
                            pzSettings[ref_id].push(data.promize_setting.reference_value)
                        }
                    })
                } else {
                    let selectedObject = pzAttributeSettings.find((val) => {
                        return val.promize_setting.reference_id == ref_id
                    })
                    pzSettings[ref_id] = selectedObject ? selectedObject.promize_setting.reference_value : pzSettings[ref_id]
                }
            })
        }
        return (
            <React.Fragment>
            {<PZUploadImage pzRemoveImage={this.pzRemoveImage} pzRemoveWhite={this.pzRemoveWhite} pzSettings={pzSettings} pzUpload={this.pzUpload} {...this.props} {...this.state} />}
            </React.Fragment>
        );
    }
}