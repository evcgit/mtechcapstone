import React from 'react';

const Calendar = () => {
    // Generate time slots for 8 AM to 5 PM
    const getTimeSlots = () => {
        const hours = [];
        for (let i = 8; i <= 17; i++) { // Loop from 8 AM (8) to 5 PM (17)
            const hour = i < 12 ? `${i === 0 ? '12' : i}:00 AM` : `${i === 12 ? '12' : i - 12}:00 PM`;
            hours.push(hour);
        }
        return hours;
    };

    const timeSlots = getTimeSlots();

    return (
        <div className='flex flex-col w-full h-full bg-white rounded-lg shadow-md p-4 overflow-y-auto'>
            <div className='space-y-5 flex-grow'>
                {timeSlots.map((time, index) => (
                    <div key={index} className='flex items-center justify-between px-2 py-1 border-b border-gray-200'>
                        <span className='font-semibold'>{time}</span>
                        {/* Placeholder for events/reminders */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
