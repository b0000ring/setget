chrome.storage.local.get(["data"], (item) => {
  data = item.data || {}
  
  const currentUrl = window.location.href
  const parsedUrl = new URL(currentUrl)

  const entry = Object.entries(data).find((item) => {
    const [key, val] = item 

    if(!data[key].enabled) return false

    const parsedTarget = new URL(key)

    if(parsedUrl.origin !== parsedTarget.origin) return false

    if(val.exact) return parsedUrl.pathname === parsedTarget.pathname

    return parsedUrl.hostname.includes(parsedTarget.hostname)
  })  

  if(!entry) return

  const config = entry[1]
  let result = currentUrl

  Object.entries(config.params).forEach((item) => {
    const [name, value] = item
    const paramExists = result.includes(`${name}=`);

    if(paramExists) {
      if(!config.overwrite) return

      const parsed = new URL(result)

      parsed.searchParams.set(name, value)
      result = parsed.toString()
      return
    }

    result = result.includes('?')
     ? `${result}&${name}=${value}`
     : `${result}?${name}=${value}`
  })

  if(result !== currentUrl) {
    window.history.replaceState({}, document.title, result)
    location.reload()
  }
})