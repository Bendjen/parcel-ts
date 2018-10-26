import demoErector from '../../components/demoErector'
import textErector from '../../components/textErector'
import Demo from './demo'
import text from './text'

export const demoModule =  demoErector(Demo);
export const textModule =  textErector(text);

// export default {
//   demoModule: demoErector(Demo),
//   textModule: textErector(text)
// }
