import NewCard from './NewCard';
import CreateTeam from './CreateTeam';
/*
name,
team,
game,
stats,
skills,
cost,
specialRules
*/
const Setups = () => {
  return(
    <div>
      <div id= "bb">
        <div>
          <NewCard />
        </div>
        <div>
          <CreateTeam />
        </div>
      </div>
    </div>
    );
}

export default Setups;
