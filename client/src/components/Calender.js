import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

// Check if a time slot falls within a time range
const isWithinRange = (timeSlot, startTime, endTime) => {
    const slotTime = parseInt(timeSlot.split(':')[0]);
    const [slotPeriod] = timeSlot.split(' ').slice(-1);
    
    const [startHour, startPeriod] = startTime.split(' ');
    const [endHour, endPeriod] = endTime.split(' ');
    
    const startTimeSlot = startPeriod === 'PM' && startHour !== '12' ? parseInt(startHour) + 12 : parseInt(startHour);
    const endTimeSlot = endPeriod === 'PM' && endHour !== '12' ? parseInt(endHour) + 12 : parseInt(endHour);

    const slotTime24 = slotPeriod === 'PM' && slotTime !== 12 ? slotTime + 12 : slotTime;
    return slotTime24 >= startTimeSlot && slotTime24 < endTimeSlot;
};

const Calendar = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [events, setEvents] = useState([]);

    const getTodayAbbreviation = () => {
        const today = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)
        const abbreviations = ['S', 'M', 'T', 'W', 'R', 'F', 'S']; // Sunday to Saturday
        return abbreviations[today];
    };

    const todayAbbreviation = getTodayAbbreviation();

    useEffect(() => {
        fetch('/courses/schedule', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                enqueueSnackbar(`Error: ${data.error}`, { variant: 'error' });
            } else {
                const filteredEvents = data.filter(event => {
                    if (typeof event.schedule === 'string') {
                        const [days] = event.schedule.split(' ');
                        return days.includes(todayAbbreviation);
                    }
                    return false;
                });
                setEvents(filteredEvents);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            enqueueSnackbar('Error fetching schedule', { variant: 'error' });
        });
    }, [enqueueSnackbar, todayAbbreviation]);

    // Generate time slots for 8 AM to 5 PM
    const getTimeSlots = () => {
        const hours = [];
        for (let i = 8; i <= 17; i++) { // Loop from 8 AM to 5 PM
            const hour = i === 12 ? `12:00 PM` : (i < 12 ? `${i}:00 AM` : `${i - 12}:00 PM`);
            hours.push(hour);
        }
        return hours;
    };

    const timeSlots = getTimeSlots();

    // Create a mapping of time slots to events
    const timeSlotEvents = timeSlots.reduce((acc, slot) => {
        acc[slot] = [];
        return acc;
    }, {});

    // Populate the time slot events
    events.forEach(event => {
        if (typeof event.schedule === 'string') {
            const parts = event.schedule.split(' ');
            if (parts.length === 2) {
                const [days, timeRange] = parts;
                const [startTime, endTime] = timeRange.split('-').map(time => `${time}:00 ${time.includes('AM') || time.includes('PM') ? '' : 'AM'}`);
                if (days.includes(todayAbbreviation)) {
                    timeSlots.forEach(slot => {
                        if (isWithinRange(slot, startTime, endTime)) {
                            timeSlotEvents[slot].push(event);
                        }
                    });
                }
            } else {
                console.warn('Unexpected schedule format:', event.schedule);
            }
        } else {
            console.warn('Event schedule is not a string:', event.schedule);
        }
    });

    return (
        <div className='flex flex-col w-full h-full bg-gray-50 rounded-lg shadow-lg p-4 overflow-y-auto'>
            <div className='flex flex-col h-full'>
                <div className='flex-grow overflow-y-auto'>
                    <div className='space-y-4'>
                        {timeSlots.map((time, index) => (
                            <div key={index} className='relative flex flex-col p-4 bg-white border border-gray-300 rounded-lg shadow-md'>
                                <div className='text-gray-600 font-semibold mb-2'>{time}</div>
                                <div className='relative'>
                                    {timeSlotEvents[time].length > 0 ? (
                                        timeSlotEvents[time].map((event, eventIndex) => (
                                            <div
                                                key={eventIndex}
                                                className='bg-blue-200 text-blue-800 rounded-lg px-3 py-2 mb-2 shadow-sm'
                                                style={{ position: 'relative', zIndex: 1 }}
                                            >
                                                <span className='text-sm'>{event.title} ({event.schedule})</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className='text-gray-400 text-sm'>No events</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
