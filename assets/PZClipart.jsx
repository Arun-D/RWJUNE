const PZClipart = (props) => {
	const pzDisplayStyle = { 1: 'square', 2: 'circle', 3: 'radio', 4: 'checkbox', 5: 'select', 6: 'input' };
  const pzClipart = props.pzClipart;
  const pzClipartCategory = props.pzClipartCategory;
  const pzTabData = props.pzSubTab ? props.pzSubTab : props.pzTab
  const pzTabStyle = (pzTabData.tab_style) ? JSON.parse(pzTabData.tab_style) : '';
  const displayType = (pzDisplayStyle[pzTabStyle.display]) ? pzDisplayStyle[pzTabStyle.display] : 'square';
  
	return (
        <div className="pz-design-item-wrapper">
          <div className ="pz-clipart-cover-section">
            {(pzClipartCategory.length > 0) &&
              <div className ="pz-clipart-categories">
                <ul className ="pz-clipart-categories-list">
                {pzClipartCategory.map((category, index) => {
                  const pzClipartCatName = category[0].clipart_category_name;
                  const pzClipartThumbImg = props.pzImgUrl.concat(category[0].clipart_category_image.replace("./", ''));
                  let activeClass = (props.pzActiveCliparts[pzTabData.promize_tab_id] && props.pzActiveCliparts[pzTabData.promize_tab_id][2] == category[0].promize_domain_clipart_category_id) ? true : false
                  
                  let style = {
                    width: (pzTabStyle && pzTabStyle.width > 0) ? pzTabStyle.width : '40',
                    height: (pzTabStyle && pzTabStyle.height > 0) ? pzTabStyle.height : '40',
                    borderRadius: (pzDisplayStyle[pzTabStyle.display] == 'circle') ? '50%' : '',
                  };
                  return (
                    <li className={(activeClass) ? 'active' : ''} onClick={() => { props.clickHandler(category, "category") }}>
                      <div className ="pz-clip-cate-icon" >
                        <img src={pzClipartThumbImg} alt={pzClipartCatName} style={style}/>
                      </div>
                      <div className ="pz-clip-cate-name">{pzClipartCatName}</div>
                    </li>
                  )
                })
              }
              </ul>
            </div>
          }
          
          {props.pzClipartImg && props.pzClipartImg.length > 0 &&
            <div className ="pz-clipart-category-groups">
              <div className ="pz-clipart-group active">
                {Object.keys(pzClipart["clipartCategories"]).map(catId =>{
                  if(catId == props.pzClipartImg[0].promize_domain_clipart_category_id){
                    const pzClipartCatName = pzClipart["clipartCategories"][catId][0].clipart_category_name;
                    const pzClipartThumbImg = props.pzImgUrl.concat(pzClipart["clipartCategories"][catId][0].clipart_category_image.replace("./", ''));
                    return (
                      <div className ="pz-clipart-title">
                        <div className ="pz-clip-cate-icon" onClick={() => { props.clickHandler(category, "category") }}>
                          <img src={pzClipartThumbImg} alt={pzClipartCatName} />
                        </div>
                        <h4>{pzClipartCatName}</h4>
                      </div>
                  );
                  }
                })}
            {props.pzClipartImg.map((clipart, index) => {
              const pzClipartCatName = clipart.clipart_name;
              const pzClipartThumbImg = props.pzImgUrl.concat(clipart.promize_product_clipart_image.replace("./", ''));
              let style = {
                // background: `${pzOptionColorCode} url(${pzOptionThumbImg})`,
                width: (pzTabStyle && pzTabStyle.width > 0) ? pzTabStyle.width : '40',
                height: (pzTabStyle && pzTabStyle.height > 0) ? pzTabStyle.height : '40',
                borderRadius: (pzDisplayStyle[pzTabStyle.display] == 'circle') ? '50%' : '',
              };
             
              return (
                  <div className ="pz-clipart-images">
                    <ul>
                      <li>
                        <div className ="pz-clipart-details">
                          <div className ="pz-clipart-img">
                            <img src={pzClipartThumbImg} onClick={() => { props.clickHandler(pzClipart, clipart) }} alt="" style={style}/>
                          </div>
                          {clipart.clipart_price > 0 &&
                          <div className ="pz-clipart-price">
                            <span>${clipart.clipart_price}</span>
                          </div>}      
                        </div> 
                      </li>
                    </ul>
                  </div>
                );
              })
            }
          </div>
        </div>
      }
      </div>
    </div>
  );
}