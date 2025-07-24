import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon ,faLightbulb} from '@fortawesome/free-solid-svg-icons';
import { useDarkMode } from '../DarkModeProvider/DarkModeContext';
export default function DarkMode(){
  const { darkMode, toggleDarkMode } = useDarkMode();
    return <>
   <div className='styledarkmode'>
    {
      darkMode ?(

        < FontAwesomeIcon icon={faMoon} style={{fontSize:"20px"}}/>
      ):
      (
        <FontAwesomeIcon icon={faLightbulb} style={{fontSize:"20px"}}/>
      )
    }
     
      <button
       onClick={toggleDarkMode}
      className="darkmode"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >

         {darkMode ? 'Mode lumière' : 'Mode sombre'}
      
      </button>

   </div>
    </>
}