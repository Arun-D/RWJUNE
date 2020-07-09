var headTag = document.getElementsByTagName("head")[0];
var jqTag = document.createElement('script');
jqTag.type = 'text/javascript';
jqTag.src = 'https://www.googletagmanager.com/gtag/js?id=UA-69105563-2';
headTag.appendChild(jqTag);
window.mobileCheck = function () {
    let check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

window.dataLayer = window.dataLayer || [];

function gtag() {
    dataLayer.push(arguments);
}
gtag('js', new Date());

gtag('config', 'UA-69105563-2');

const pzInitializeFCanvas = (pzHomeComponent) => {
    let {
        pzCanvas
    } = pzHomeComponent.state;
    fabric.Canvas.prototype.getItemByName = function (name) {
        objects = this.getObjects();
        let object = objects.find(function (obj) {
            return obj.name === name
        })
        return object;
    };

    fabric.Canvas.prototype.getItemByField = function (field, value) {
        objects = this.getObjects();
        let object = objects.find(function (obj) {
            return parseInt(obj[field]) === parseInt(value)
        })
        return object;
    };
}

const pzInitializeFCanvasCoords = (pzHomeComponent) => {
    let {
        pzCanvas
    } = pzHomeComponent.state;

    pzCanvas.on('object:moving', e => pzCanvasCallback(e, "moving", pzHomeComponent))
        .on('object:scaling', e => pzCanvasCallback(e, "scaling", pzHomeComponent))
        .on('object:rotating', e => pzCanvasCallback(e, "rotating", pzHomeComponent))
        .on('object:selected', e => pzCanvasCallback(e, "selected", pzHomeComponent))
        .on("selection:updated", e => pzCanvasCallback(e, "selected", pzHomeComponent))


    //.on('object:added', e => pzCanvasCallback(e, "added", pzHomeComponent))
    pzCanvas.on('mouse:up', e => pzCanvasCallbackMouseUp(e, "mouseup", pzHomeComponent))

    if (pzHomeComponent.state.pzDomainSettings[24]) {
        fabric.Canvas.prototype.customiseControls({
            tl: {
                action: 'rotate',
                cursor: 'pointer'
            },
            br: {
                action: function (e, target) {
                    deleteCanvasObject(target, pzHomeComponent)
                },
                cursor: 'pointer',
            },
        }, function () {
            pzCanvas.renderAll();
        });


        // fabric.Canvas.prototype._getActionFromCorner = function (target, corner, e) {
        //     console.log(corner)
        //     if (!corner) {
        //         return 'drag';
        //     }
        //     switch (corner) {
        //         case 'mtr':
        //             return 'rotate';
        //         default:
        //             return 'scale';
        //     }
        // }

        let removeIcon = pzHomeComponent.state.pzDomainSettings[11] ? 'remove_icon_' + pzHomeComponent.state.pzDomainSettings[11] : 'remove_icon';
        let resize90Icon = pzHomeComponent.state.pzDomainSettings[11] ? 'resize_90_' + pzHomeComponent.state.pzDomainSettings[11] : 'resize_90';
        let resize901Icon = pzHomeComponent.state.pzDomainSettings[11] ? 'resize_90_1_' + pzHomeComponent.state.pzDomainSettings[11] : 'resize_90_1';
        let refreshIcon = pzHomeComponent.state.pzDomainSettings[11] ? 'refresh_' + pzHomeComponent.state.pzDomainSettings[11] : 'refresh';
        let refreshTopIcon = pzHomeComponent.state.pzDomainSettings[11] ? 'refresh_top_' + pzHomeComponent.state.pzDomainSettings[11] : 'refresh_top';

        fabric.Object.prototype.customiseCornerIcons({
            settings: {
                borderColor: 'black',
                cornerSize: 54,
            },
            br: {
                icon: 'https://live.productimize.com/promizetemplate/images/' + removeIcon + '.png'
            },
            bl: {
                icon: 'https://live.productimize.com/promizetemplate/images/' + resize90Icon + '.png'
            },
            tr: {
                icon: 'https://live.productimize.com/promizetemplate/images/' + resize901Icon + '.png'
            },
            tl: {
                icon: 'https://live.productimize.com/promizetemplate/images/' + refreshIcon + '.png'
            },
            mtr: {
                icon: 'https://live.productimize.com/promizetemplate/images/' + refreshTopIcon + '.png'
            }
        }, function () {
            pzCanvas.renderAll();
        });
    } else {
        fabric.Object.prototype.customiseCornerIcons({
            settings: {
                borderColor: 'black',
                cornerSize: 34,
            },
            br: {
                icon: 'https://live.productimize.com/promizetemplate/images/resize.png'
            },
            bl: {
                icon: 'https://live.productimize.com/promizetemplate/images/resize_90.png'
            },
            tr: {
                icon: 'https://live.productimize.com/promizetemplate/images/resize_90.png'
            },
            tl: {
                icon: 'https://live.productimize.com/promizetemplate/images/resize.png'
            },
            mtr: {
                icon: 'https://live.productimize.com/promizetemplate/images/refresh.png'
            }
        }, function () {
            pzCanvas.renderAll();
        });

    }
}


const deleteCanvasObject = (obj, pzHomeComponent) => {
    let objName = obj.name;
    console.log(obj)
    let tabAtteId = obj.tabAttrValueId;
    let {
        pzCanvas,
        pzCanvasObject,
        pzCurrentView,
        pzActiveTexts
    } = pzHomeComponent.state;


    if (objName.includes('text')) {
        let activeObject = pzActiveTexts[tabAtteId];
        delete pzActiveTexts[tabAtteId][obj.textIndex]
        let arrloop = 0;
        Object.keys(pzActiveTexts[tabAtteId]).forEach(function (key) {
            if (pzActiveTexts[tabAtteId][key]) {
                arrloop++;
                pzActiveTexts[tabAtteId][key].showText = true;
            }
        });
        if (arrloop == 0) {
            delete pzActiveTexts[tabAtteId];
        }
        delete pzCanvasObject[pzCurrentView][objName];
        let canvasObj = pzCanvas.getItemByName(objName);
        pzRemoveObjectFromCanvas(pzCanvas, canvasObj)

        pzHomeComponent.setState({
            pzActiveTexts,
            pzCanvasObject
        });


    } else {
        // let activeObject = pzActiveTexts[tabAtteId];
        // delete pzActiveTexts[tabAtteId][obj.textIndex]
        // let arrloop = 0;
        // Object.keys(pzActiveTexts[tabAtteId]).forEach(function (key) {
        //     if (pzActiveTexts[tabAtteId][key]) {
        //         arrloop++;
        //         pzActiveTexts[tabAtteId][key].showText = true;
        //     }
        // });
        // if (arrloop == 0) {
        //     delete pzActiveTexts[tabAtteId];
        // }

        pzRemoveUploadImage(obj, pzHomeComponent)
    }


}


const pzRemoveUploadImage = (obj, pzHomeComponent) => {
    let {
        pzActiveImages,
        pzProductPrice,
        pzQuantity,
        pzCanvasObject,
        pzCanvas,
        pzCurrentView,
        pzCustomizer
    } = pzHomeComponent.state;
    let image_index = obj.name.split('_')[4];
    if (pzCustomizer.attributeImages[obj.tabAttrId]) {
        let imageDetail = pzCustomizer.attributeImages[obj.tabAttrId];
        const imageBoundary = (imageDetail.boundary_position) ? JSON.parse(imageDetail.boundary_position) : '';
        if (Object.keys(imageBoundary).length > 0) {
            imageBoundary[pzCurrentView].map((boundary, index) => {
                let objName = "FObject_image_" + imageDetail.promize_tab_attribute_id + '_' + index + '_' + image_index;
                delete pzCanvasObject[pzCurrentView][objName];
                let canvasObj = pzCanvas.getItemByName(objName);
                pzRemoveObjectFromCanvas(pzCanvas, canvasObj)
            })
            if (imageDetail.promize_attribute_image_value.image_price) {
                if (obj.common_price) {
                    Object.values(pzActiveImages).map((img) => {
                        let imgCount = img.length;
                        if (imgCount == 1) {
                            pzProductPrice = pzProductPrice - (parseFloat(imageDetail.promize_attribute_image_value.image_price) * pzQuantity)
                        }
                    })
                } else {
                    pzProductPrice = pzProductPrice - (parseFloat(imageDetail.promize_attribute_image_value.image_price) * pzQuantity)
                }
            }
        }
        delete pzActiveImages[imageDetail.promize_tab_image_attribute_values_id][image_index];
        pzHomeComponent.setState({
            pzCanvasObject,
            pzProductPrice,
            pzActiveImages
        })
    }
}




const pzCanvasCallback = (event, action, pzHomeComponent) => {
    let {
        pzCanvas,
        pzCanvasObject,
        pzActiveTexts
    } = pzHomeComponent.state;
    if (event.target.showBoundary && event.target.showBoundary == true) {
        pzDisplayBoundary(event.target.boundary, pzCanvas, pzHomeComponent);
        pzHomeComponent.pzObjectProperty(event.target)
    }
    if (action == 'scaling' || action == 'moving' || action == 'rotating') {
        Object.keys(pzCanvasObject).length > 0 && Object.keys(pzCanvasObject).map((view_id, view_index) => {
            let objects = pzCanvasObject[view_id];
            let tempObj = {
                ...objects[event.target.name],
                scaleX: event.target.scaleX,
                scaleY: event.target.scaleY,
                left: parseFloat(event.target.left),
                top: parseFloat(event.target.top),
                angle: event.target.angle,
            }
            pzCanvasObject[view_id][event.target.name] = tempObj
        })
        pzHomeComponent.setState({
            pzCanvasObject
        })
    } else if (action == 'selected') {
        if (event.target.customType == 'text') {
            let targetIndex = event.target.textIndex;
            let selectedAttrText = pzActiveTexts[event.target.tabAttrValueId]
            selectedAttrText.length > 0 && selectedAttrText.map((text, index) => {
                if (targetIndex == index) {
                    selectedAttrText[index] = {
                        ...text,
                        showText: true
                    }
                } else if (text.showText == true) {
                    selectedAttrText[index] = {
                        ...text,
                        showText: false
                    }
                }
            })
            pzActiveTexts[event.target.tabAttrValueId] = selectedAttrText
            pzHomeComponent.setState({
                pzActiveTexts
            })
        }
    }
    // if (event.target.showTextOutsideBoundary == 0) {
    //     pzCliping(event.target);
    // }

    // if (action == 'mouseup') {
    //     let pzFCanvasObject = pzCanvas.getItemByName("FObject_boundary");
    //     pzRemoveObjectFromCanvas(pzCanvas, pzFCanvasObject);
    // }
    pzCanvas.renderAll();
}

const pzCanvasCallbackMouseUp = (event, action, pzHomeComponent) => {
    let {
        pzCanvas
    } = pzHomeComponent.state;
    let pzFCanvasObject = pzCanvas.getItemByName("FObject_boundary");
    pzRemoveObjectFromCanvas(pzCanvas, pzFCanvasObject);
}

const pzDisplayBoundary = (boundary, pzCanvas, pzHomeComponent) => {
    if (!pzCanvas.getItemByName("FObject_boundary")) {
        var pzFCanvasObject = new fabric.Rect({
            name: 'FObject_boundary',
            left: parseFloat(boundary.left) ? parseFloat(boundary.left) : 0,
            top: parseFloat(boundary.top) ? parseFloat(boundary.top) : 0,
            width: parseFloat(boundary.width) ? parseFloat(boundary.width) : 1000,
            height: parseFloat(boundary.height) ? parseFloat(boundary.height) : 1000,
            angle: parseFloat(boundary.angle) ? parseFloat(boundary.angle) : 0,
            fill: 'transparent',
            stroke: pzHomeComponent.state.pzDomainSettings[17],
            strokeWidth: 2,
            strokeDashArray: [10, 10],
            selectable: false,
            layerno: 150,
            evented: false
        });
        pzCanvas.add(pzFCanvasObject);
    }
}

const pzLoadCanvasObjects = (pzObjects) => {
    let {
        pzCurrentView,
        pzCanvas,
        pzCanvasObject
    } = pzObjects
    if (pzCanvas) {
        pzCanvas.clear();
    }
    let FObject = [];
    let pzCanvasObjectCurrent = pzCanvasObject[pzCurrentView] ? pzCanvasObject[pzCurrentView] : {};
    Object.keys(pzCanvasObjectCurrent).length > 0 && Object.keys(pzCanvasObjectCurrent).map((pzCanvasObject, index) => {
        if (pzCanvasObjectCurrent[pzCanvasObject].name) {
            FObject.push(pzCanvasObjectCurrent[pzCanvasObject]);
        } else {
            let canvasMultiObject = pzCanvasObjectCurrent[pzCanvasObject];
            Object.keys(canvasMultiObject).length > 0 && Object.keys(canvasMultiObject).map((multiObj, index) => {
                FObject.push(canvasMultiObject[multiObj])
            })
        }
    })

    FObject.length > 0 && FObject.sort(function (a, b) {
        return a.layerno - b.layerno;
    });

    fabric.util.enlivenObjects(FObject, function (cObject) {
        Object.keys(cObject).map((object, index) => {
            if (cObject[object].type == 'image') {
                cObject[object].crossOrigin = 'Anonymous'
            }
            if (cObject[object].name == 'baseimage') {
                pzCanvas.setHeight(cObject[object].height);
                pzCanvas.setWidth(cObject[object].width);
            }
            if (cObject[object].name == 'pzOverlayImage') {
                pzCanvas.setOverlayImage(cObject[object])
            } else if (cObject[object].type == 'image' && cObject[object].src) {
                cObject[object].src = cObject[object].src + '?' + Date.now()
                pzCanvas.add(cObject[object]);
            } else if (cObject[object].type == 'image') {

            } else {
                cObject[object].src = cObject[object].src + '?' + Date.now()
                pzCanvas.add(cObject[object]);
            }
            pzCanvas.renderAll();
        })
    });
    return pzCanvas
}

const pzAddObjectToCanvas = (pzCanvas, pzFCanvasObject, pzCrossOrigin, pzHomeComponent) => {
    var canvasObject = pzCanvas.getItemByName(pzFCanvasObject.name);
    if (canvasObject) {
        if (pzFCanvasObject.type == 'image') {
            pzFCanvasObject.src = pzFCanvasObject.src + '?' + Date.now()
            canvasObject.set(pzFCanvasObject)
            canvasObject.setSrc(pzFCanvasObject.src, function () {
                pzHomeComponent.setState({
                    pzCanvasLoader: false
                })
                pzCanvas.renderAll();
            }, {
                'crossOrigin': pzCrossOrigin
            });
        } else if (pzFCanvasObject.type == 'textbox') {
            canvasObject.set(pzFCanvasObject);
            pzCanvas.renderAll();
        }
    } else {
        if (pzFCanvasObject.type == 'image') {
            pzFCanvasObject.src = pzFCanvasObject.src + '?' + Date.now()
            fabric.Image.fromObject(pzFCanvasObject, function (oImg) {
                oImg.applyFilters();
                pzCanvas.add(oImg);
                pzHomeComponent.setState({
                    pzCanvasLoader: false
                })
                pzFCanvasLayering(pzCanvas)
                pzFCanvasOptionEffects(oImg, pzCanvas);
            }, {
                'crossOrigin': pzCrossOrigin
            });
        } else if (pzFCanvasObject.type == 'textbox') {
            var pzObject = new fabric.Textbox(pzFCanvasObject.text, pzFCanvasObject);
            pzCanvas.add(pzObject);
            pzFCanvasLayering(pzCanvas)
        }
    }
}
const pzApplyColorToObject = (pzCanvas, pzFCanvasObject, pzCrossOrigin, pzHomeComponent) => {
    var canvasObject = pzCanvas.getItemByName(pzFCanvasObject.name);
    if (canvasObject) {
        canvasObject.set(pzFCanvasObject)
        pzFCanvasObject.src = pzFCanvasObject.src + '?' + Date.now()
        canvasObject.setSrc(pzFCanvasObject.src, function (obj) {
            var filters = []
            var blendFilter = new fabric.Image.filters.BlendColor({
                color: pzFCanvasObject.filterColor,
                mode: 'multiply',
                alpha: 1
            });
            filters.push(blendFilter);
            obj.set("filters", filters);
            obj.applyFilters();
            pzHomeComponent.setState({
                pzCanvasLoader: false
            })
            pzCanvas.renderAll();
        }, {
            'crossOrigin': pzCrossOrigin
        });
    }
}
const pzChangeTextProperty = (pzFCanvasObject, pzObjectParams, pzHomeComponent) => {
    let spaceRemovedText = pzFCanvasObject.Originaltext.replace(/ /g, 0);
    let {
        left = 0, top = 0, width = 0, height = 0
    } = pzObjectParams.boundary;
    var pzObject = new fabric.Textbox(spaceRemovedText, {
        ...pzFCanvasObject
    });
    width = (pzObject.get('width') >= parseFloat(width)) ? parseFloat(width) : parseFloat(pzObject.get('width')) + 1;
    width = (pzObjectParams.pzSettings[13]) ? (pzObject.get('width')) : width; // Center text
    pzFCanvasObject.width = width;

    var pzHeightObject = new fabric.Textbox(pzFCanvasObject.Originaltext, {
        ...pzFCanvasObject
    });
    pzFCanvasObject.height = pzHeightObject.get('height');
    pzFCanvasObject.text = pzFCanvasObject.Originaltext;
    if (pzFCanvasObject.hasControls) {
        pzFCanvasObject._controlsVisibility = ({
            bl: pzHomeComponent.state.pzDomainSettings[14].length > 0 ? (pzHomeComponent.state.pzDomainSettings[14].includes(4) ? true : false) : true,
            br: pzHomeComponent.state.pzDomainSettings[14].length > 0 ? (pzHomeComponent.state.pzDomainSettings[14].includes(3) ? true : false) : true,
            mb: pzHomeComponent.state.pzDomainSettings[14].length > 0 ? (pzHomeComponent.state.pzDomainSettings[14].includes(7) ? true : false) : true,
            ml: false,
            mr: false,
            mt: pzHomeComponent.state.pzDomainSettings[14].length > 0 ? (pzHomeComponent.state.pzDomainSettings[14].includes(5) ? true : false) : true,
            mtr: pzHomeComponent.state.pzDomainSettings[14].length > 0 ? (pzHomeComponent.state.pzDomainSettings[14].includes(9) ? true : false) : true,
            tl: pzHomeComponent.state.pzDomainSettings[14].length > 0 ? (pzHomeComponent.state.pzDomainSettings[14].includes(2) ? true : false) : true,
            tr: pzHomeComponent.state.pzDomainSettings[14].length > 0 ? (pzHomeComponent.state.pzDomainSettings[14].includes(1) ? true : false) : true
        });
        pzFCanvasObject.rotatingPointOffset = 80
        pzFCanvasObject.borderColor = pzHomeComponent.state.pzDomainSettings[11]
        pzFCanvasObject.cornerSize = parseInt(pzHomeComponent.state.pzDomainSettings[13])
        pzFCanvasObject.cornerColor = pzHomeComponent.state.pzDomainSettings[11]
        pzFCanvasObject.useCustomIcons = (window.mobileCheck() || pzHomeComponent.state.pzDomainSettings[24]) ? true : false;
        pzFCanvasObject.transparentCorners = false;
        pzFCanvasObject.hasBorders = true;
    }

    let pzObjectLeft = pzLeftPosition(pzFCanvasObject, pzFCanvasObject.width, pzObjectParams.pzSettings[13], (pzObject.get('width') >= parseFloat(width)) ? true : false)
    pzFCanvasObject.left = pzObjectLeft;
    let boundaryTop = pzTopPostion(pzFCanvasObject, pzObjectParams.pzSettings[13]);
    pzFCanvasObject.top = boundaryTop;
    return pzFCanvasObject;
}

const pzChangeImageProperty = (pzFCanvasObject, pzObjectParams, pzHomeComponent) => {
    console.log(pzFCanvasObject, pzObjectParams, pzHomeComponent)
    let {
        left = 0, top = 0, width = 0, height = 0
    } = pzObjectParams.boundary;
    pzFCanvasObject.left = parseFloat(pzFCanvasObject.boundary.left) + parseFloat(pzFCanvasObject.boundary.width) / 2 - parseFloat(pzFCanvasObject.originalWidth * pzFCanvasObject.scaleX) / 2;
    // var pzImageSettings = pzObjectParams.promize_tab_attributes[0].promize_attribute.promize_attribute_settings;
    pzFCanvasObject._controlsVisibility = ({
        bl: pzHomeComponent.state.pzDomainSettings[14].length > 0 ? (pzHomeComponent.state.pzDomainSettings[14].includes(4) ? true : false) : true,
        br: pzHomeComponent.state.pzDomainSettings[14].length > 0 ? (pzHomeComponent.state.pzDomainSettings[14].includes(3) ? true : false) : true,
        mb: pzHomeComponent.state.pzDomainSettings[14].length > 0 ? (pzHomeComponent.state.pzDomainSettings[14].includes(7) ? true : false) : true,
        ml: pzHomeComponent.state.pzDomainSettings[14].length > 0 ? (pzHomeComponent.state.pzDomainSettings[14].includes(8) ? true : false) : true,
        mr: pzHomeComponent.state.pzDomainSettings[14].length > 0 ? (pzHomeComponent.state.pzDomainSettings[14].includes(6) ? true : false) : true,
        mt: pzHomeComponent.state.pzDomainSettings[14].length > 0 ? (pzHomeComponent.state.pzDomainSettings[14].includes(5) ? true : false) : true,
        mtr: pzHomeComponent.state.pzDomainSettings[14].length > 0 ? (pzHomeComponent.state.pzDomainSettings[14].includes(9) ? true : false) : true,
        tl: pzHomeComponent.state.pzDomainSettings[14].length > 0 ? (pzHomeComponent.state.pzDomainSettings[14].includes(2) ? true : false) : true,
        tr: pzHomeComponent.state.pzDomainSettings[14].length > 0 ? (pzHomeComponent.state.pzDomainSettings[14].includes(1) ? true : false) : true
    });
    pzFCanvasObject.rotatingPointOffset = 80
    pzFCanvasObject.borderColor = pzHomeComponent.state.pzDomainSettings[11]
    pzFCanvasObject.cornerSize = parseInt(pzHomeComponent.state.pzDomainSettings[13])
    pzFCanvasObject.cornerColor = pzHomeComponent.state.pzDomainSettings[11]
    pzFCanvasObject.useCustomIcons = (window.mobileCheck() || pzHomeComponent.state.pzDomainSettings[24]) ? true : false;
    pzFCanvasObject.transparentCorners = false;
    pzFCanvasObject.hasBorders = true;
    return pzFCanvasObject;
}

const pzTopPostion = (textboundary, centerText) => {
    var pzObjectTop = textboundary.top;
    pzObjectTop = (centerText == 1 && textboundary.inCanvas == 0) ? parseFloat(textboundary.top) + parseFloat(textboundary.boundary.height) / 2 : parseFloat(textboundary.top) + parseFloat(textboundary.textHeight) / 2 - parseFloat(textboundary.height) / 2;
    return pzObjectTop;
}

const pzLeftPosition = (textboundary, textwidth, centerText, exceedsBoundary) => {
    // if(exceedsBoundary){
    //     return textboundary.left
    // }
    return (centerText == 1 && textboundary.inCanvas == 0) ? parseFloat(textboundary.boundary.left) + parseFloat(textboundary.boundary.width) / 2 - parseFloat(textwidth) / 2 : parseFloat(textboundary.left) + parseFloat(textboundary.textWidth) / 2 - parseFloat(textwidth) / 2;
}

const pzRemoveObjectFromCanvas = (pzCanvas, pzFCanvasObject) => {
    if (pzFCanvasObject) {
        pzCanvas.remove(pzFCanvasObject);
        pzCanvas.renderAll();
    }
}

const pzCreateCanvasObject = (view_id, pzObjType, pzObjectParams, pzCanvas, pzCurrentView, pzCrossOrigin, pzHomeComponent) => {
    let pzColorFilter = pzColorFilters(pzObjectParams.image_color_settings, pzObjectParams.colorCode, pzObjType);
    if (pzObjType == 'boundary') {
        return '';
    } else if (pzObjType == 'text') {
        let objName = 'FObject_text_' + pzObjectParams.promize_tab_attribute_id + '_' + pzObjectParams.index + '_' + pzObjectParams.textIndex
        const {
            left = 0, top = 0, width = 0, height = 0, scaleX = 1, scaleY = 1, angle = 0
        } = pzObjectParams.boundary;
        let canvasObj = pzCanvas.getItemByName(objName)
        let pzFCanvasObject = {
            name: 'FObject_text_' + pzObjectParams.promize_tab_attribute_id + '_' + pzObjectParams.index + '_' + pzObjectParams.textIndex,
            fontSize: pzObjectParams.fontSize,
            textAlign: pzObjectParams.textAlign,
            fill: pzObjectParams.fill,
            textDecoration: pzObjectParams.textDecoration,
            underline: pzObjectParams.textDecoration == 'underline' ? true : false,
            fontWeight: pzObjectParams.fontWeight,
            fontFamily: pzObjectParams.fontFamily,
            fontStyle: pzObjectParams.fontStyle,
            editable: false,
            selectable: pzObjectParams.pzSettings[12],
            hasControls: pzObjectParams.pzSettings[9],
            boundary: pzObjectParams.boundary,
            layerno: pzObjectParams.tab_layer_no,
            type: 'textbox',
            textIndex: pzObjectParams.textIndex,
            angle: (canvasObj && view_id == pzCurrentView) ? canvasObj.angle : angle,
            left: (canvasObj && view_id == pzCurrentView) ? canvasObj.left : left,
            top: (canvasObj && view_id == pzCurrentView) ? canvasObj.top : top,
            //globalCompositeOperation: 'source-atop',
            showBoundary: pzObjectParams.pzSettings[10],
            showTextOutsideBoundary: pzObjectParams.pzSettings[11],
            Originaltext: pzObjectParams.Originaltext,
            textWidth: (canvasObj && view_id == pzCurrentView) ? canvasObj.width : width,
            textHeight: (canvasObj && view_id == pzCurrentView) ? canvasObj.height : height,
            inCanvas: (canvasObj && view_id == pzCurrentView) ? 1 : 0,
            fontFamilyFile: pzObjectParams.fontFamilyFile,
            //centeredRotation: true,
            // centeredScaling: true,
            // skewX: 10,
            // skewY: 50,
            "customType": 'text',
            "view_id": view_id,
            "tabId": pzObjectParams.promize_tab_id,
            "tabAttrId": pzObjectParams.promize_tab_attribute_id,
            "tabAttrValueId": pzObjectParams.promize_tab_text_attribute_values_id,
            "option_name": pzObjectParams.promize_attribute_text_value ? pzObjectParams.promize_attribute_text_value.text_name : '',
            "option_price": pzObjectParams.promize_attribute_text_value ? pzObjectParams.promize_attribute_text_value.text_price : '',
            "option_sku": pzObjectParams.promize_attribute_text_value ? pzObjectParams.promize_attribute_text_value.text_sku : '',
            "tab_name": pzObjectParams.tab_name,
            "attribute_name": pzObjectParams.attribute_name ? pzObjectParams.attribute_name : '',
            "common_price": pzObjectParams.pzSettings[15]
        };
        if (pzFCanvasObject.showTextOutsideBoundary == 0) {
            pzFCanvasObject.clipTo = pzCliping(pzFCanvasObject, pzCanvas)
        }
        pzFCanvasObject = pzChangeTextProperty(pzFCanvasObject, pzObjectParams, pzHomeComponent);
        return pzFCanvasObject;
    } else if (pzObjType == 'uploadimage') {
        let objName = "FObject_image_" + pzObjectParams.promize_tab_attribute_id + '_' + pzObjectParams.index + '_' + pzObjectParams.imageIndex
        const {
            left = 0, top = 0, width = 1000, height = 1000, scaleX = 1, scaleY = 1, angle = 0
        } = pzObjectParams.boundary;
        let canvasObj = pzCanvas.getItemByName(objName)
        let scaling = (pzObjectParams.boundary.width < pzObjectParams.boundary.height) ? pzObjectParams.boundary.width / pzObjectParams.originalWidth : pzObjectParams.boundary.height / pzObjectParams.originalHeight;
        let pzFCanvasObject = {
            "type": "image",
            "name": "FObject_image_" + pzObjectParams.promize_tab_attribute_id + '_' + pzObjectParams.index + '_' + pzObjectParams.imageIndex,
            "src": pzObjectParams.src,
            "layerno": (pzObjectParams.tab_layer_no) ? pzObjectParams.tab_layer_no : 1,
            "originalWidth": pzObjectParams.originalWidth,
            "originalHeight": pzObjectParams.originalHeight,
            //"width": canvasObj ? canvasObj.width : width,
            //"height": canvasObj ? canvasObj.height : height,
            "left": (canvasObj && view_id == pzCurrentView) ? canvasObj.left : left,
            "top": (canvasObj && view_id == pzCurrentView) ? canvasObj.top : top,
            "scaleX": scaling,
            "scaleY": scaling,
            "angle": (canvasObj && view_id == pzCurrentView) ? canvasObj.angle : angle,
            "boundary": pzObjectParams.boundary,
            "showBoundary": pzObjectParams.pzSettings[7],
            "filters": (canvasObj && view_id == pzCurrentView) ? canvasObj.filters : pzColorFilter,
            "tabId": pzObjectParams.promize_tab_id,
            "tabAttrId": pzObjectParams.promize_tab_attribute_id,
            "tabAttrValueId": pzObjectParams.promize_tab_image_attribute_values_id,
            "selectable": pzObjectParams.pzSettings[8],
            "hasControls": true,
            "hasBorders": false,
            "opacity": 1,
            "crossOrigin": pzCrossOrigin,
            "customType": "uploadimage",
            "showTextOutsideBoundary": 0,
            "resizedImage": pzObjectParams.resizedImage,
            "removedWhiteImage": pzObjectParams.removedWhiteImage,
            "removeWhite": pzObjectParams.removeWhite,
            "option_name": pzObjectParams.promize_attribute_image_value ? pzObjectParams.promize_attribute_image_value.image_name : '',
            "option_price": pzObjectParams.promize_attribute_image_value ? pzObjectParams.promize_attribute_image_value.image_price : '',
            "option_sku": pzObjectParams.promize_attribute_image_value ? pzObjectParams.promize_attribute_image_value.image_sku : '',
            "tab_name": pzObjectParams.tab_name,
            "attribute_name": pzObjectParams.attribute_name ? pzObjectParams.attribute_name : '',
            "common_price": pzObjectParams.pzSettings[11]
        };
        if (pzFCanvasObject.showTextOutsideBoundary == 0) {
            pzFCanvasObject.clipTo = pzCliping(pzFCanvasObject, pzCanvas)
        }
        pzFCanvasObjectCreate = pzChangeImageProperty(pzFCanvasObject, pzObjectParams, pzHomeComponent);
        return pzFCanvasObject;
    } else if (pzObjType == 'clipart') {
        let objName = "FObject_clipart_" + pzObjectParams.promize_tab_attribute_id + '_' + pzObjectParams.category_index + '_' + pzObjectParams.boundary_index + '_' + pzObjectParams.clipart_index
        const {
            left = 0, top = 0, width = 1000, height = 1000, scaleX = 1, scaleY = 1, angle = 0
        } = pzObjectParams.boundary;
        let canvasObj = pzCanvas.getItemByName(objName)
        let scaling = (pzObjectParams.boundary.width < pzObjectParams.boundary.height) ? pzObjectParams.boundary.width / pzObjectParams.originalWidth : pzObjectParams.boundary.height / pzObjectParams.originalHeight;

        let pzFCanvasObject = {
            "type": "image",
            "name": "FObject_clipart_" + pzObjectParams.promize_tab_attribute_id + '_' + pzObjectParams.category_index + '_' + pzObjectParams.boundary_index + '_' + pzObjectParams.clipart_index,
            "src": pzObjectParams.src,
            "layerno": (pzObjectParams.tab_layer_no) ? pzObjectParams.tab_layer_no : 1,
            "originalWidth": pzObjectParams.originalWidth,
            "originalHeight": pzObjectParams.originalHeight,
            // "width": canvasObj ? canvasObj.width : width,
            // "height": canvasObj ? canvasObj.height : height,
            "left": (canvasObj && view_id == pzCurrentView) ? canvasObj.left : left,
            "top": (canvasObj && view_id == pzCurrentView) ? canvasObj.top : top,
            "scaleX": scaling,
            "scaleY": scaling,
            "angle": (canvasObj && view_id == pzCurrentView) ? canvasObj.angle : angle,
            "boundary": pzObjectParams.boundary,
            "filters": pzColorFilter,
            "tabId": pzObjectParams.promize_tab_id,
            "tabAttrId": pzObjectParams.promize_tab_attribute_id,
            "tabAttrValueId": pzObjectParams.promize_tab_clipart_attribute_values_id,
            "selectable": pzObjectParams.pzSettings[10] ? true : false,
            "hasControls": pzObjectParams.pzSettings[7] ? true : false,
            "hasBorders": false,
            "opacity": 1,
            "crossOrigin": pzCrossOrigin,
            "customType": "clipart",
            "showTextOutsideBoundary": pzObjectParams.pzSettings[9],
            "option_name": pzObjectParams.clipart_name,
            "option_price": pzObjectParams.clipart_price,
            "tab_name": pzObjectParams.tab_name,
            "option_sku": pzObjectParams.promize_attribute_clipart_value ? pzObjectParams.promize_attribute_clipart_value.clipart_sku : ''
        };
        if (pzFCanvasObject.showTextOutsideBoundary == 0) {
            pzFCanvasObject.clipTo = pzCliping(pzFCanvasObject, pzCanvas)
        }
        pzFCanvasObjectCreate = pzChangeImageProperty(pzFCanvasObject, pzObjectParams, pzHomeComponent);
        return pzFCanvasObject;
    } else {
        const parsedPosition = (pzObjectParams.option_position) ? JSON.parse(pzObjectParams.option_position) : '';
        const {
            left = 0, top = 0, width = 0, height = 0, scaleX = 1, scaleY = 1, angle = 0
        } = (parsedPosition && view_id in parsedPosition) ? parsedPosition[view_id] : '';
        let objName = "FObject_option_" + pzObjectParams.promize_tab_id
        let canvasObj = pzCanvas.getItemByName(objName)
        return {
            "type": "image",
            "name": "FObject_option_" + pzObjectParams.promize_tab_id,
            "src": pzObjectParams.src,
            "layerno": (pzObjectParams.tab_layer_no) ? pzObjectParams.tab_layer_no : 1,
            "width": width,
            "height": height,
            "left": left,
            "top": top,
            "scaleX": scaleX,
            "scaleY": scaleY,
            "angle": angle,
            "filters": canvasObj ? canvasObj.filters : pzColorFilter,
            "tabId": pzObjectParams.promize_tab_id,
            "tabAttrId": pzObjectParams.promize_tab_attribute_id,
            "tabAttrValueId": pzObjectParams.promize_tab_attribute_values_id,
            "selectable": false,
            "hasControls": false,
            "hasBorders": false,
            "opacity": 1,
            "crossOrigin": pzCrossOrigin,
            "value": pzObjectParams.optionValue ? pzObjectParams.optionValue : pzObjectParams.value,
            "customType": pzObjType === 'tab' ? 'tab' : 'option',
            "option_name": pzObjectParams.promize_attribute_value ? pzObjectParams.promize_attribute_value.option_name : '',
            "option_price": pzObjectParams.promize_attribute_value ? pzObjectParams.promize_attribute_value.option_price : '',
            "tab_name": pzObjectParams.tab_name,
            "option_sku": pzObjectParams.promize_attribute_value ? pzObjectParams.promize_attribute_value.option_sku : '',

        };
    }
}

const pzColorFilters = (imageColorSettings, colorCode, optionType) => {
    let imageFilters = [];
    if (optionType == 'color') {
        let [mat1, mat2, mat3] = imageColorSettings ? imageColorSettings.split(',') : [0, 0, 0];
        var matrixColor = new fabric.Image.filters.ColorMatrix({
            matrix: [1, mat1, mat2, mat3, 0, 1, mat1, mat2, mat3, 0, 1, mat1, mat2, mat3, 0, 0, 0, 0, 1, 0]
        });
        imageFilters.push(matrixColor);
        if (colorCode) {
            var blendFilter = new fabric.Image.filters.BlendColor({
                color: colorCode,
                mode: 'multiply',
                alpha: 1
            });
            imageFilters.push(blendFilter);
        }
    }
    return imageFilters;
}


const pzFCanvasLayering = (pzCanvas) => {
    pzCanvas._objects.sort(function (a, b) {
        return (parseInt(a.layerno) || 0) - (parseInt(b.layerno) || 0)
    })
    pzCanvas.renderOnAddRemove && pzCanvas.requestRenderAll();
}

const pzFCanvasZoom = (zoom, pzCanvas, pzGeneralSettings) => {
    var zoomVal = 0.10;
    var Canvaszoom = pzCanvas.getZoom();
    if (zoom == 'zoomin') {
        if (Canvaszoom < (pzGeneralSettings && pzGeneralSettings[16] ? pzGeneralSettings[16] / 10 : 1.6)) {
            Canvaszoom = Canvaszoom + zoomVal;
        }
    } else {
        if (Canvaszoom > (pzGeneralSettings && pzGeneralSettings[15] ? pzGeneralSettings[15] / 10 : 0.4)) {
            Canvaszoom = Canvaszoom - zoomVal;
        }
    }
    pzCanvas.zoomToPoint(new fabric.Point(pzCanvas.width / 2, pzCanvas.height / 2), Canvaszoom);
    pzCanvas.requestRenderAll();
    pzCanvas.calcOffset();
    //pzCanvas.renderAll();
}

const pzFCanvasOptionEffects = (imgObj, pzCanvas) => {
    imgObj.animate('opacity', 1, {
        duration: 300,
        onChange: pzCanvas.renderAll.bind(pzCanvas),
        onComplete: function () {
            pzCanvas.renderAll();
            pzFCanvasLayering(pzCanvas);
        },
        easing: fabric.util.ease['easeInSine']
    });
}

const pzCheckValidColorCode = (colorCode) => {
    return ((/^#[0-9A-F]{6}$/i.test(colorCode)) || (/^#([0-9A-F]{3}){1,2}$/i.test(colorCode)));
}

const pzCliping = (pzFObject, pzCanvas) => {
    if (pzFObject.boundary) {
        pzFObject.clipTo = function (ctx) {
            let clipObj = {
                left: (pzFObject.boundary.left) ? pzFObject.boundary.left : 0,
                top: pzFObject.boundary.top ? pzFObject.boundary.top : 0,
                width: pzFObject.boundary.width ? pzFObject.boundary.width : 1000,
                height: pzFObject.boundary.height ? pzFObject.boundary.height : 1000,
                angle: pzFObject.boundary.angle ? pzFObject.boundary.angle : 0,
            };
            ctx.beginPath();
            ctx.restore();
            this.setCoords();
            var clipRect = clipObj;
            var scaleXTo1 = (1 / this.scaleX);
            var scaleYTo1 = (1 / this.scaleY);
            ctx.save();
            let zoom = pzCanvas.getZoom();
            ctx.save();
            ctx.scale(1, zoom);
            var ctxLeft = -(this.width / 2) + 0;
            var ctxTop = -(this.height / 2) + 0;
            ctx.translate(ctxLeft, ctxTop);
            this.angle ? ctx.rotate(this.angle * -1 * Math.PI / 180) : ctx.rotate(this.angle * Math.PI / 180);
            ctx.scale(scaleXTo1, scaleYTo1);
            var x = this.canvas.viewportTransform;
            ctx.scale(1 / x[0], 1 / x[3]);
            ctx.translate(x[4], x[5]);
            ctx.beginPath();
            ctx.rect(
                x[0] * clipRect.left - this.oCoords.tl.x,
                x[3] * clipRect.top - this.oCoords.tl.y,
                x[0] * clipRect.width,
                x[3] * clipRect.height);

            // ctx.strokeStyle = "red";
            // ctx.stroke();
            ctx.closePath();
            ctx.restore();
        };

    }
    return pzFObject.clipTo;
}

const pzSaveForLater = async (pzObject) => {
    let {
        pzCanvasObject,
        pzApiUrl,
        pzCustomizer
    } = pzObject;

    let reqBody = {
        domain_id: pzCustomizer.product.domain_id,
        selected_options: JSON.stringify(pzCanvasObject)
    }

    var saveForLaterResponse = await fetch(pzApiUrl + 'saveForLater', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(reqBody)
    })
    var editUrlData = await saveForLaterResponse.json();
    var url = window.location.href.split('&');
    let editUrl = url[0] + "&edit_id=" + editUrlData.records.promize_save_for_later_id;
    return editUrl;
}

const pzGetSelectedValues = (pzCanvasObject, pzProductPrice, pzActiveOptions, pzCustomizer) => {
    let selectedObject = {};
    selectedObject['price'] = pzProductPrice;
    Object.keys(pzCanvasObject).length > 0 && Object.keys(pzCanvasObject).map((view_id, view_index) => {
        let objects = pzCanvasObject[view_id];
        Object.keys(objects).length > 0 && Object.keys(objects).map((obj_id, obj_index) => {
            if (obj_id !== 'baseImage') {
                if (selectedObject[objects[obj_id].tabId] == undefined) {
                    selectedObject[objects[obj_id].tabId] = {}
                }
                if (objects[obj_id].customType == 'uploadimage') {
                    if (selectedObject[objects[obj_id].tabId]['src'] == undefined) {
                        selectedObject[objects[obj_id].tabId]['src'] = []
                    }
                    selectedObject[objects[obj_id].tabId]['customType'] = 'uploadimage'
                    selectedObject[objects[obj_id].tabId]['src'].push(objects[obj_id].src)
                } else if (objects[obj_id].customType == 'text') {
                    selectedObject[objects[obj_id].tabId]['customType'] = 'text'
                    selectedObject[objects[obj_id].tabId]['text'] = objects[obj_id].text
                    selectedObject[objects[obj_id].tabId]['fontFamily'] = objects[obj_id].fontFamily
                    selectedObject[objects[obj_id].tabId]['fontColor'] = objects[obj_id].fill
                    selectedObject[objects[obj_id].tabId]['fontStyle'] = objects[obj_id].fontStyle
                    selectedObject[objects[obj_id].tabId]['fontSize'] = objects[obj_id].fontSize
                }
                selectedObject[objects[obj_id].tabId]['tab_name'] = objects[obj_id].tab_name
                selectedObject[objects[obj_id].tabId]['option_name'] = objects[obj_id].option_name
                selectedObject[objects[obj_id].tabId]['option_price'] = objects[obj_id].option_price
            }
        })
    })
    Object.keys(pzActiveOptions).length > 0 && Object.keys(pzActiveOptions).map((key, index) => {
        if (selectedObject[key] == undefined) {
            selectedObject[key] = {}
        }
        selectedObject[key]['tab_name'] = pzCustomizer.tabs[key].tab_name
        selectedObject[key]['option_name'] = pzCustomizer.attributeOptions[pzActiveOptions[key][0]][pzActiveOptions[key][1]].promize_attribute_value.option_name
        selectedObject[key]['option_price'] = pzCustomizer.attributeOptions[pzActiveOptions[key][0]][pzActiveOptions[key][1]].promize_attribute_value.option_price
    })
    return selectedObject
}

const pzGetSelectedValuesForApp = (pzCanvasObject, pzProductPrice, pzActiveOptions, pzCustomizer) => {
    let selectedObject = {}
    //selectedObject['price'] = pzProductPrice;
    var currViewId = 1;
    let pzSelectedObjectCount = 0;
    Object.keys(pzCanvasObject).length > 0 && Object.keys(pzCanvasObject).map((view_id, view_index) => {
        let objects = pzCanvasObject[view_id];
        //currViewId++;
        const viewName = 'View ' + currViewId++;
        selectedObject[viewName] = {};
        const uploadedImages = [];
        let uploadImageCount = 1;
        Object.keys(objects).length > 0 && Object.keys(objects).map((obj_id, obj_index) => {
            if (obj_id !== 'baseImage') {
                pzSelectedObjectCount = 1;
                /* if (selectedObject[viewName][objects[obj_id].tabId] == undefined) {
                     selectedObject[viewName][objects[obj_id].tabId] = {}
                 }*/
                if (objects[obj_id].customType == 'uploadimage') {
                    uploadedImages.push(objects[obj_id].src);
                    const uploadImageKey = 'Upload Image ' + (uploadImageCount++);
                    selectedObject[viewName][uploadImageKey] = objects[obj_id].src;
                } else if (objects[obj_id].customType == 'text') {
                    //selectedObject[viewName][objects[obj_id].tabId]['customType'] = 'text'

                    if (objects[obj_id].text) {
                        selectedObject[viewName]['text'] = objects[obj_id].text
                    }
                    if (objects[obj_id].fontFamily) {
                        selectedObject[viewName]['fontFamily'] = objects[obj_id].fontFamily
                    }
                    if (objects[obj_id].fontColor) {
                        selectedObject[viewName]['fontColor'] = objects[obj_id].fill
                    }
                    if (objects[obj_id].fontStyle) {
                        selectedObject[viewName]['fontStyle'] = objects[obj_id].fontStyle
                    }
                    if (objects[obj_id].fontSize) {
                        selectedObject[viewName]['fontSize'] = objects[obj_id].fontSize
                    }
                } else if (objects[obj_id].tab_name) {
                    selectedObject[viewName][objects[obj_id].tab_name] = objects[obj_id].option_name
                }
                //selectedObject[viewName][objects[obj_id].tabId]['option_name'] = objects[obj_id].option_name
                if (objects[obj_id].option_price) {
                    selectedObject[viewName]['Price'] = objects[obj_id].option_price;
                }
            }
        })
        /*if (uploadedImages.length > 0) {
            selectedObject[viewName]['uploadedImage'] = uploadedImages.join(',');
        }*/
    })
    /*Object.keys(pzActiveOptions).length > 0 && Object.keys(pzActiveOptions).map((key, index) => {
        if (selectedObject[key] == undefined) {
            selectedObject[key] = {}
        }
        selectedObject[key]['tab_name'] = pzCustomizer.tabs[key].tab_name
        selectedObject[key]['option_name'] = pzCustomizer.attributeOptions[pzActiveOptions[key][0]][pzActiveOptions[key][1]].promize_attribute_value.option_name
        selectedObject[key]['option_price'] = pzCustomizer.attributeOptions[pzActiveOptions[key][0]][pzActiveOptions[key][1]].promize_attribute_value.option_price
    })*/


    return (pzSelectedObjectCount > 0) ? selectedObject : null;
}

const pzGetSelectedValuesForCart = (pzCanvasObject, pzBasePrice, pzProductPrice, pzActiveOptions, pzCustomizer) => {
    let cartObject = {}
    cartObject['price'] = pzBasePrice;
    let imageProperty = {}
    var currViewId = 1;
    let pzSelectedObjectCount = 0;
    Object.keys(pzCanvasObject).length > 0 && Object.keys(pzCanvasObject).map((view_id, view_index) => {
        let objects = pzCanvasObject[view_id];
        var model_data = JSON.parse(pzCustomizer.product.model_image);
        let viewId, viewName;
        model_data.map((data, idx) => {
            if (data.id == view_id) {
                viewName = data.view_name;
            }
        })
        viewId = 'View ' + currViewId++;
        imageProperty[viewId] = {
            'imageinfo': {},
            'textinfo': {},
            'objectinfo': {},
            'baseinfo': {},
            'Productinfo': { 'name': pzCustomizer.product.promize_customizer_name }
        }
        const uploadedImages = [];
        let uploadImageCount = 0;
        let textCount = 0;
        let objectCount = 0;
        Object.keys(objects).length > 0 && Object.keys(objects).map((obj_id, obj_index) => {
            console.log(objects[obj_id])
            if (obj_id !== 'baseImage') {
                pzSelectedObjectCount = 1;
                if (objects[obj_id].customType == 'uploadimage') {
                    uploadedImages.push(objects[obj_id].src);
                    uploadImageCount++;
                    imageProperty[viewId]['imageinfo'][uploadImageCount] = {
                        'src': objects[obj_id].src,
                        'left': objects[obj_id].left,
                        'top': objects[obj_id].top,
                        'width': objects[obj_id].width,
                        'height': objects[obj_id].height,
                        'angle': objects[obj_id].angle,
                        'scaleX': objects[obj_id].scaleX,
                        'scaleY': objects[obj_id].scaleY,
                        'printing': 1,
                        'attribute_name': objects[obj_id].attribute_name,
                        'type': 'image',
                        'cliping': 1,
                        'boundary': objects[obj_id].boundary,
                        'layerno': objects[obj_id].layerno ? objects[obj_id].layerno : 0
                    };
                    cartObject["Uploaded Image" + uploadImageCount] = objects[obj_id].src;
                    if (objects[obj_id].common_price == 1) {
                        if (uploadImageCount == 1) {
                            cartObject['price'] += objects[obj_id].option_price ? objects[obj_id].option_price : 0
                        }
                    } else {
                        cartObject['price'] += objects[obj_id].option_price ? objects[obj_id].option_price : 0
                    }
                } else if (objects[obj_id].customType == 'text') {
                    textCount++;
                    imageProperty[viewId]['textinfo'][textCount] = {
                        'text': objects[obj_id].text,
                        'fontFamily': objects[obj_id].fontFamily,
                        'fontColor': objects[obj_id].fill,
                        'fontStyle': objects[obj_id].fontStyle,
                        'fontSize': objects[obj_id].fontSize,
                        'left': objects[obj_id].left,
                        'top': objects[obj_id].top,
                        'width': objects[obj_id].width,
                        'height': objects[obj_id].height,
                        'angle': objects[obj_id].angle,
                        'scaleX': objects[obj_id].scaleX,
                        'scaleY': objects[obj_id].scaleY,
                        'printing': 1,
                        'attribute_name': objects[obj_id].attribute_name,
                        'text_sku': objects[obj_id].option_sku,
                        'type': 'text',
                        'cliping': 1,
                        'boundary': objects[obj_id].boundary,
                        'fontFamilyFile': objects[obj_id].fontFamilyFile,
                        'layerno': objects[obj_id].layerno ? objects[obj_id].layerno : 0
                    }

                    cartObject[objects[obj_id].attribute_name + textCount] = objects[obj_id].text;
                    if (objects[obj_id].option_sku) {
                        cartObject[objects[obj_id].attribute_name + textCount + " SKU"] = objects[obj_id].option_sku;
                    }

                    cartObject[objects[obj_id].attribute_name + textCount + " Styles"] = 'FontFamily-' + objects[obj_id].fontFamily + ',FontColor-' + objects[obj_id].fill + ',FontStyle-' + objects[obj_id].fontStyle + ',FontSize-' + objects[obj_id].fontSize;
                    if (objects[obj_id].common_price == 1) {
                        if (textCount == 1) {
                            cartObject['price'] += objects[obj_id].option_price ? objects[obj_id].option_price : 0;
                        }
                    } else {
                        cartObject['price'] += objects[obj_id].option_price ? objects[obj_id].option_price : 0;
                    }
                } else if (objects[obj_id].tab_name && !objects[obj_id].tab_name.includes("Verify Selection")) {
                    cartObject[objects[obj_id].tab_name] = objects[obj_id].option_name;
                    imageProperty[viewId][objects[obj_id].tab_name] = objects[obj_id].option_name;
                    if (objects[obj_id].value) {
                        cartObject[objects[obj_id].tab_name] = objects[obj_id].value;
                        imageProperty[viewId][objects[obj_id].tab_name] = objects[obj_id].value;
                    }
                    cartObject['price'] += objects[obj_id].option_price ? objects[obj_id].option_price : 0;
                    //if (objects[obj_id].src) {
                    objectCount++;
                    imageProperty[viewId]['objectinfo'][objectCount] = {
                        'src': objects[obj_id].src,
                        'fill': objects[obj_id].fill,
                        'value': objects[obj_id].value,
                        'left': objects[obj_id].left,
                        'top': objects[obj_id].top,
                        'width': objects[obj_id].width,
                        'height': objects[obj_id].height,
                        'angle': objects[obj_id].angle,
                        'scaleX': objects[obj_id].scaleX,
                        'scaleY': objects[obj_id].scaleY,
                        'type': 'image',
                        'printing': 1,
                        'layerno': objects[obj_id].layerno ? objects[obj_id].layerno : 0,
                        'tabName': objects[obj_id].tab_name,
                        'optionValue': objects[obj_id].option_name
                    }
                    //}
                }
            } else {
                imageProperty[viewId]['baseinfo'][0] = {
                    'src': objects[obj_id].src,
                    'type': 'image',
                    'layerno': -1
                }
            }
        })
    })
    return (pzSelectedObjectCount > 0) ? {
        cartObject: cartObject,
        imageProperty: imageProperty
    } : null;
}