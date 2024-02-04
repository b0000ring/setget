let data = {}

function setData() {
  chrome.storage.local.set({ data })
}

function init() {
  chrome.storage.local.get(["data"], (item) => {
    data = item.data || {}
    render()
  })
}

function render() {
  const root = document.querySelector('#root')
  root.innerHTML = ''
  const result = Object.entries(data).map(renderResource)

  const wrapper = document.createElement('div')

  const input = document.createElement('input')
  input.id = 'add_input'

  const add = document.createElement('button')
  add.innerHTML = '+'
  add.addEventListener('click', addResource)

  wrapper.append(input, add)
  result.push(wrapper)
  root.append(...result)
}

function toggleParam(resource, param) {
  data[resource][param] = !data[resource][param]
  setData()
  render()
}

function renderResource(data) {
  const [key, d] = data
  const resource = document.createElement('div')
  resource.className = 'resource'

  const name = document.createElement('div')
  name.innerHTML = key

  const interface = document.createElement('div')
  interface.className = 'interface'
  const buttons = document.createElement('div')
  const exact = document.createElement('button')
  exact.addEventListener('click', () => toggleParam(key, 'exact'))
  exact.className = d.exact ? 'active' : 'disabled'
  exact.innerHTML = 'exact'
  const overwrite = document.createElement('button')
  overwrite.addEventListener('click', () => toggleParam(key, 'overwrite'))
  overwrite.className = d.overwrite ? 'active' : 'disabled'
  overwrite.innerHTML = 'overwrite'
  const enabled = document.createElement('button')
  enabled.addEventListener('click', () => toggleParam(key, 'enabled'))
  enabled.className = d.enabled ? 'active' : 'disabled'
  enabled.innerHTML = 'enabled'

  buttons.append(enabled, exact, overwrite)

  const remove = document.createElement('button')
  remove.addEventListener('click', () => removeSource(key))
  remove.innerHTML = '&#128465;'

  const rulesWrapper = document.createElement('div')
  rulesWrapper.className = 'rules'

  const rules = Object.entries(d.params).map((item) => renderRule(key, item))

  const newRule = document.createElement('div')

  const param = document.createElement('input')
  param.id = `${key}_param`

  const value = document.createElement('input')
  value.id = `${key}_value`

  const add = document.createElement('button')
  add.innerHTML = '+'
  add.addEventListener('click', () => addRule(key))

  newRule.append(param, value, add)
  rulesWrapper.append(...rules, newRule)
  interface.append(buttons, remove)
  resource.append(name, interface, rulesWrapper)

  return resource
}

function renderRule(resource, item) {
  const [key, value] = item
  const rule = document.createElement('div')
  rule.className = 'rule'
  const param = document.createElement('div')
  param.innerHTML = key + ' = ' + value
  const remove = document.createElement('button')
  remove.innerHTML = '&#128465;'
  remove.addEventListener('click', () => removeRule(resource, key))

  rule.append(param, remove)
  return rule
}

function addResource() {
  const resource = document.querySelector('#add_input').value
  if(!resource || data[resource]) return
  data[resource] = {
    exact: false,
    overwrite: false,
    enabled: true,
    params: {}
  }

  setData()
  render()
}

function addRule(resource) {
  const key = document.getElementById(`${resource}_param`).value
  const value = document.getElementById(`${resource}_value`).value
  if(!key || !value || data[resource][key]) return

  data[resource].params[key] = value

  setData()
  render()
}

function removeRule(resource, rule) {
  delete data[resource].params[rule]
  setData()
  render()
}

function removeSource(source) {
  delete data[source]
  setData()
  render()
}

function loadConfig() {

}

function downloadConfig() {

}

window.onload = init