export default (axios,config={})=>{
  let httpUtil = {}
  // 确认api存在且为对象
  let {api} = config
  if(!api)throw new Error("api配置必须存在")
  if(!api instanceof Object)throw new Error("api必须为对象")

  // 遍历api中的每个对象,并解构其中的属性
  for(let name in api){
    let {url,method,isForm,hooks} = api[name]
    if(hooks){
      api[name].beforeReq = hooks.beforeReq
      api[name].afterReq = hooks.afterReq
    }
    httpUtil[name] = async (data={})=>{
      let transformData = null
      // 判断是否为formData方式
      if(isForm){
          transformData = new FormData()
          for(let key in data){
            transformData .append(key,data[key])
          }
      }else{
          transformData = data
      }

      // 判断用户的请求方式决定发送什么请求
      let body = ""
      switch (method) {
        case "get":
        case "delete":
          api[name].beforeReq && api[name].beforeReq()
          body = await axios({
            method,
            url,
            params:transformData
          })
          api[name].afterReq && api[name].afterReq()
          break;
        case "put":
          body = await axios({
            method,
            url,
            data:transformData
          })
          break;
        case "post":
          body = await axios({
            method,
            url,
            data:transformData
          })
          break;
      }

      return body
    }
  }
  return httpUtil
}