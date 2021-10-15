import NewBBcard from './NewBBcard';
import NewWMcard from './NewWMcard';
import CreateTeam from './CreateTeam';
import '../styles/setups.css';

const Setups = () => {
  return(
    <div id= "setupContainer">
      <div id= "bb">
        <div>
          <NewBBcard />
        </div>
        <div>
          <CreateTeam />
        </div>
      </div>

      <div id= "wMachine">
        <div>
          <NewWMcard />
        </div>
      </div>
    </div>
    );
}

export default Setups;
