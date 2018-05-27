export const dataToWeight = (data) => {
  // data is an object
  // {
  //   id: {
  //     type: value
  //     timestamp: value
  //   }
  // }
  let ret = {};
  let totalCount = 0;
  Object.keys(data).forEach(item => {
    let type = data[item].type;
    if(!Object.keys(ret).includes(type)) {
      ret[type] = 1;
    }
    else {
      ret[type]++;
    }
    totalCount++;
  })
  
  Object.keys(ret).forEach(key => {
    ret[key] = (ret[key] / totalCount).toFixed(2);
  })

  return ret;
  // ret: {
  //   type: count
  // }
}