import css from "./css";
import idea from "./idea";
import javaScript from "./javaScript";

const requireAllProject = requireContext => requireContext.keys().map(requireContext)
const projectPathFiles = require.context('../project', true, /package\.json$/)
const projects = requireAllProject(projectPathFiles)


const cssProjects = projects.filter(item=>item.catelog === 'css')
const javascriptProjects = projects.filter(item=>item.catelog === 'javascript')
const ideaProjects = projects.filter(item=>item.catelog === 'idea')


const indexList2 = {
  css:cssProjects,
  javaScript:javascriptProjects,
  idea:ideaProjects,
};

// tslint:disable-next-line:no-console
console.log(indexList2)

const indexList = {
  css,
  idea,
  javaScript
};

// tslint:disable-next-line:no-console
console.log(indexList)

export default indexList;


