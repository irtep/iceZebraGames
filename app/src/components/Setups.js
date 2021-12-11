import NewBBcard from './NewBBcard';
import NewWMcard from './NewWMcard';
import ManageTeam from './ManageTeam';
import CreateWmArmy from './CreateWmArmy';
import '../styles/setups.css';

const Setups = () => {
  return(
    <div id= "setupContainer">
      <div id= "bb">
        <div>
          <NewBBcard />
        </div>
        <div>
          <ManageTeam />
        </div>
      </div>

      <div id= "wMachine">
        <div>
          <NewWMcard />
        </div>
        <div>
          <CreateWmArmy />
        </div>
      </div>
    </div>
    );
}

export default Setups;
