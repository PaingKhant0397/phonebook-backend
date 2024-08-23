import React, { useEffect, useState } from 'react';
import personServices from "./services/persons"

import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';

const initialNotification = { message: '', type: '' }

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');
  const [notification, setNotification] = useState(initialNotification)

  useEffect(() => {
    personServices
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const showError = (text) => {
    setNotification({ message: text, type: "error" })
    setTimeout(() => setNotification(initialNotification), 3000)
  }

  const showSuccess = (text) => {
    setNotification({ message: text, type: "success" })
    setTimeout(() => setNotification(initialNotification), 3000)
  }

  const checkIfExist = (arr, name) => {
    return arr.some((person) => person.name === name);
  };

  const handleOnChangeName = (e) => setNewName(e.target.value);
  const handleOnChangeNumber = (e) => setNewNumber(e.target.value);
  const handleOnChangeFilter = (e) => setNewFilter(e.target.value);

  const handleAdd = (event) => {
    event.preventDefault();
    const isExist = checkIfExist(persons, newName);
    if (isExist) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate = persons.find(person => person.name === newName)
        const updatedPerson = {
          ...personToUpdate,
          number: newNumber
        }
        personServices
          .update(personToUpdate.id, updatedPerson)
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id === updatedPerson.id ? updatedPerson : person))
            setNewName('')
            setNewNumber('')
            showSuccess(`Changed Number of ${updatedPerson.name} to ${updatedPerson.number}`)
          })
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };
      personServices
        .add(newPerson)
        .then(addedPerson => {
          setPersons(persons.concat(addedPerson))
          setNewName('');
          setNewNumber('');
          showSuccess(`Added ${addedPerson.name}`)
        })
    }
  };

  const handleDelete = (id) => {
    const personToDelete = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personServices
        .del(id)
        .then(deletedPerson => {
          setPersons(persons.filter(person => person.id !== personToDelete.id))
        })
        .catch(error => {
          showError(`${personToDelete.name} is already deleted`)
          console.error("Delete Error", error)
        })
    }
  }

  const filterByName = (array, name) =>
    array.filter(person => person.name.toLowerCase().includes(name.toLowerCase()));

  const personsToShow = filterByName(persons, newFilter);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter value={newFilter} onChange={handleOnChangeFilter} />

      <h3>Add a new</h3>

      <PersonForm
        onSubmit={handleAdd}
        name={newName}
        onNameChange={handleOnChangeName}
        number={newNumber}
        onNumberChange={handleOnChangeNumber}
      />

      <h3>Numbers</h3>

      <Persons handleDelete={handleDelete} persons={personsToShow} />
    </div>
  );
};

export default App;
