import _ from 'lodash'

const files = require.context('.', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
	if (key === './index.js') return
	_.mergeWith(modules,files(key).default)
})
export default modules
