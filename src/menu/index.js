const requireAllProject = requireContext => requireContext.keys().map(requireContext)
const projectPathFiles = require.context('../project', true, /package\.json$/)
const projects = requireAllProject(projectPathFiles)


const cssProjects = projects.filter(item => item.catelog === 'css')
const javascriptProjects = projects.filter(item => item.catelog === 'javascript')
const ideaProjects = projects.filter(item => item.catelog === 'idea')

const menu = [
  ...cssProjects,
  ...javascriptProjects,
  ...ideaProjects
]

export default menu;


