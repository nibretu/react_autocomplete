import './App.scss';
import { useState } from 'react';
import { Autocomplete } from './Autocomplete';
import { Person } from './types/Person';
import { peopleFromServer as people } from './data/people';

export const App = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <div className="App">
      <h1 data-cy="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <Autocomplete
        people={people}
        onSelected={setSelectedPerson}
        onChange={() => setSelectedPerson(null)}
      />
    </div>
  );
};
