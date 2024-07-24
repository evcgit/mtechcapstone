import React, { useState, useEffect }from "react";
import { CompactStudentCard } from "./StudentCards";

export const StudentsModal = ({ isOpen, onClose, string_id, title }) => {
	const [students, setStudents] = useState([]);

	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const response = await fetch('/registered/students', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					}, 
					body: JSON.stringify({ string_id })
				});
				if (response.ok) {
					const data = await response.json();
					setStudents(data);
				} else {
					console.error('Failed to fetch students');
				}
			} catch (error) {
				console.error('Error fetching students:', error);
			}
		};

		if (isOpen) {
			fetchStudents();
		}
	}, [isOpen, string_id]);
	
	
	if (!isOpen) {
		return null;
	}
	return (
		<div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50'>
			<div className='bg-white p-8 rounded shadow-lg max-w-lg max-h-[80vh] overflow-hidden'>
				<h2 className='text-lg font-semibold mb-4'>{title} Students</h2>
				<div className='max-h-[60vh] overflow-y-auto'>
					{students.map(student => (
						<div className='mb-4'>
							<CompactStudentCard key={student.user_id} student={student} />
						</div>
					))}
				</div>
				<div className='flex justify-end mt-4'>
					<button onClick={onClose} className='bg-gray-300 text-gray-800 px-4 py-2 mr-2 rounded'>
						Close
					</button>
					<button className='text-slate-500 bg-slate-200 font-bold px-4 py-2 rounded border-2 border-slate-500 hover:bg-slate-300 hover:border-slate-600 hover:text-white'>
						Add
					</button>
				</div>
			</div>
		</div>
	);
}

export const EditCourseModal = ({ isOpen, onClose, title, string_id }) => {	
	if (!isOpen) {
		return null;
	}
	return (
		<div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50'>
			<div className='bg-white p-8 rounded shadow-lg'>
				<h2 className='text-lg font-semibold mb-4'>{title}</h2>
				<span>{string_id}</span>
				<div className='flex justify-end'>
					<button onClick={onClose} className='bg-gray-300 text-gray-800 px-4 py-2 mr-2 rounded'>
						Cancel
					</button>
					<button className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'>
						Edit
					</button>
				</div>
			</div>
		</div>
	);
}

