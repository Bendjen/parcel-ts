const requireAllProject = requireContext => requireContext.keys().map(requireContext)
const projectPathFiles = require.context('../project', true, /package\.json$/)
const projects = requireAllProject(projectPathFiles)

const menu = projects

export default menu;


