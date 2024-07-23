import React, { useState } from "react";
import { useSnackbar } from "notistack";

const NewCourse = () => {
  const [title, setTitle] = useState('');
  const [stringId, setStringId] = useState('');
  const [description, setDescription] = useState('');
  const [schedule, setSchedule] = useState('');
  const [classroomNumber, setClassroomNumber] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');
  const [credits, setCredits] = useState('');
  const [cost, setCost] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (e) => {
    e.preventDefault();

    const courseData = {
      title,
      stringId,
      description,
      schedule,
      classroomNumber,
      maxCapacity,
      credits,
      cost,
    };

    fetch('/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(courseData),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.errorMessage) {
        enqueueSnackbar(data.errorMessage, { variant: 'error' });
      } else {
        setTitle('');
        setDescription('');
        setSchedule('');
        setClassroomNumber('');
        setMaxCapacity('');
        setCredits('');
        setCost('');
        enqueueSnackbar('Course created', { variant: 'success' });
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      enqueueSnackbar('Failed to create course', { variant: 'error' });
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">New Course</h1>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="flex flex-wrap mb-3">
          <div className="flex flex-col w-full md:w-1/2 pr-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              name="title"
              placeholder="Class Title"
              className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
              required
            />
            <input
              type="text"
              value={stringId}
              onChange={(e) => setStringId(e.target.value)}
              name="stringId"
              placeholder="Class ID"
              className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
              required
            />
            <input
              type="text"
              value={classroomNumber}
              onChange={(e) => setClassroomNumber(e.target.value)}
              name="classroomNumber"
              placeholder="Classroom Number"
              className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
            />
            <div className="flex items-center">
              <input
                type="text"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                name="schedule"
                placeholder="Class Schedule"
                className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <p className="text-gray-500 text-xs ml-2">Format (MWF 9-10)</p>
          </div>
          <div className="flex flex-col w-full md:w-1/2 pl-2">
            <input
              type="number"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(e.target.value)}
              name="maxCapacity"
              placeholder="Max Capacity"
              className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
              required
            />
            <input
              type="number"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              name="credits"
              placeholder="Credits"
              className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
              required
            />
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              name="cost"
              placeholder="Cost"
              className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          name="description"
          placeholder="Class Description"
          className="border-2 border-gray-300 rounded mb-3 p-2 focus:border-blue-500 focus:outline-none w-full resize-y"
        />
        <div className="w-full flex justify-center mt-4">
          <input
            type="submit"
            value="Submit"
            className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white py-2 px-4 rounded transition duration-300 ease-in-out"
          />
        </div>
      </form>
    </div>
  );
};

export default NewCourse;
