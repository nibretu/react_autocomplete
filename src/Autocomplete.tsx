import React, { useEffect, useState, useRef } from 'react';
import { Person } from './types/Person';

type Props = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person) => void;
  onChange: () => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
  onChange,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!query) {
        setSuggestions(people);
      } else {
        const normalizedQuery = query.toLowerCase();

        setSuggestions(
          people.filter(person =>
            person.name.toLowerCase().includes(normalizedQuery),
          ),
        );
      }

      setIsOpen(true);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [query, delay, people]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setQuery(newValue);
    setIsOpen(true);

    // Clear selected person when input changes
    if (selectedPerson) {
      setSelectedPerson(null);
      onChange();
    }
  };

  const handleFocus = () => {
    if (!query) {
      setSuggestions(people);
    }

    setIsOpen(true);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setIsOpen(false);
    setSelectedPerson(person);
    onSelected(person);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          ref={inputRef}
          className="input"
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder="Enter a part of the name"
          data-cy="search-input"
        />
      </div>

      {isOpen && (
        <div
          className="dropdown-menu"
          data-cy="suggestions-list"
          role="listbox"
        >
          <div className="dropdown-content">
            {suggestions.length > 0 ? (
              suggestions.map(person => (
                <button
                  type="button"
                  className="dropdown-item"
                  key={person.slug || person.name}
                  onClick={() => handleSelect(person)}
                  data-cy="suggestion-item"
                >
                  {person.name}
                </button>
              ))
            ) : (
              <div className="dropdown-item" data-cy="no-suggestions-message">
                No matching suggestions
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
