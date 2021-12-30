import NewBBcard from './NewBBcard';
import NewWMcard from './NewWMcard';
import NewKTcard from './NewKTcard';
import ManageTeam from './ManageTeam';
import CreateWmArmy from './CreateWmArmy';
import CreateKTarmy from './CreateKTarmy';
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

      <div id= "killTeam">
        <div>
          <NewKTcard />
        </div>
        <div>
          <CreateKTarmy />
        </div>
      </div>
    </div>
    );
}

export default Setups;
