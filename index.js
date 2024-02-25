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
  const root = document.querySelector('#root');
  root.innerHTML = '';

  const resources = Object.entries(data).map(renderResource);

  const wrapper = document.createElement('div');
  wrapper.className = 'resource-new';

  const title = document.createElement('div');
  title.textContent = 'Add resource';

  const interface = document.createElement('div');

  const input = document.createElement('input');
  input.placeholder = 'http://localhost:1313/path';
  input.id = 'add_input';

  addEnterPressSupport(input, addResource)

  const add = document.createElement('button');
  add.textContent = 'Add';
  add.addEventListener('click', addResource);

  interface.append(input, add);
  wrapper.append(title, interface);
  root.append(...resources, wrapper);
}

function toggleParam(resource, param) {
  data[resource][param] = !data[resource][param]
  apply()
}

function renderResource(data) {
  const [key, d] = data
  const resource = document.createElement('div')
  resource.className = 'resource' + (!d.enabled ? ' disabled' : '')

  const nameWrapper = document.createElement('div')
  nameWrapper.className = 'resource-name-wrapper'

  const name = document.createElement('div')
  name.className = 'resource-name'
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

  const remove = document.createElement('button')
  remove.addEventListener('click', () => removeSource(key))
  remove.innerHTML = 'Delete'

  const rulesWrapper = document.createElement('div')
  rulesWrapper.className = 'rules'

  const rules = Object.entries(d.params).map((item) => renderRule(key, item))

  const addRuleWrapper = document.createElement('div')
  addRuleWrapper.className = 'rule-new'

  const newRule = document.createElement('div')
  newRule.className = 'rule-new-form'

  const ruleTitle = document.createElement('div')
  ruleTitle.textContent = 'Add rule';

  const param = document.createElement('input')
  param.placeholder = 'param'
  param.id = `${key}_param`
  addEnterPressSupport(param, () => addRule(key))

  const value = document.createElement('input')
  value.placeholder = 'value'
  value.id = `${key}_value`
  addEnterPressSupport(value, () => addRule(key))

  const add = document.createElement('button')
  add.innerHTML = 'Add'
  add.addEventListener('click', () => addRule(key))

  newRule.append(ruleTitle, param, value, add)
  buttons.append(enabled)
  d.enabled && buttons.append(exact, overwrite)
  d.enabled && addRuleWrapper.append(ruleTitle, newRule)
  d.enabled && rulesWrapper.append(...rules, addRuleWrapper)
  nameWrapper.append(name, remove)
  interface.append(buttons)
  resource.append(nameWrapper, interface, rulesWrapper)

  return resource
}

function renderRule(resource, item) {
  const [key, value] = item
  const rule = document.createElement('div')
  rule.className = 'rule'
  const param = document.createElement('div')
  param.innerHTML = key + ' = ' + value
  const remove = document.createElement('button')
  remove.innerHTML = 'Delete'
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

  apply()
}

function addRule(resource) {
  const key = document.getElementById(`${resource}_param`).value
  const value = document.getElementById(`${resource}_value`).value
  if(!key || !value || data[resource][key]) return

  data[resource].params[key] = value
  apply()
}

function removeRule(resource, rule) {
  delete data[resource].params[rule]
  apply()

}

function removeSource(source) {
  delete data[source]
  apply()
}

function apply() {
  setData()
  render()
}

function addEnterPressSupport(input, cb) {
  input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
      cb()
    }
  })
}

function loadConfig() {

}

function downloadConfig() {

}

window.onload = init