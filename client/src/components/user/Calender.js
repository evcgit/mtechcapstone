import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

const isWithinRange = (timeSlot, startTime, endTime) => {
    const [slotHour, slotPeriod] = timeSlot.split(' ');
    const slotHour24 = slotPeriod === 'PM' && parseInt(slotHour) !== 12 ? parseInt(slotHour) + 12 : parseInt(slotHour);

    const [startHour, startPeriod] = startTime.split(' ');
    const startHour24 = startPeriod === 'PM' && parseInt(startHour) !== 12 ? parseInt(startHour) + 12 : parseInt(startHour);

    const [endHour, endPeriod] = endTime.split(' ');
    const endHour24 = endPeriod === 'PM' && parseInt(endHour) !== 12 ? parseInt(endHour) + 12 : parseInt(endHour);

    return slotHour24 >= startHour24 && slotHour24 < endHour24;
};

const Calendar = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [events, setEvents] = useState([]);

    const getTodayAbbreviation = () => {
        const today = new Date().getDay();
        const abbreviations = ['S', 'M', 'T', 'W', 'TH', 'F', 'S'];
        return abbreviations[today];
    };

    const todayAbbreviation = getTodayAbbreviation();

    const parseDays = (days) => {
        
        const parsedDays = [];
        for (let i = 0; i < days.length; i++) {
            if (days[i] === 'T') {
                if (days[i + 1] === 'H') {
                    parsedDays.push('TH');
                    i++; // Skip the next character
                } else {
                    parsedDays.push('T');
                }
            } else {
                parsedDays.push(days[i]);
            }
        }
        
        return parsedDays;
    };

    useEffect(() => {
        fetch('/student/courses/schedule', {
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
                        const parsedDays = parseDays(days);
                        return parsedDays.includes(todayAbbreviation);
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

    const getTimeSlots = () => {
        const hours = [];
        for (let i = 8; i <= 17; i++) {
            const hour = i === 12 ? `12:00 PM` : (i < 12 ? `${i}:00 AM` : `${i - 12}:00 PM`);
            hours.push(hour);
        }
        return hours;
    };

    const timeSlots = getTimeSlots();

    const timeSlotEvents = timeSlots.reduce((acc, slot) => {
        acc[slot] = [];
        return acc;
    }, {});

    events.forEach(event => {
        if (typeof event.schedule === 'string') {
            const parts = event.schedule.split(' ');
            if (parts.length === 2) {
                const [days, timeRange] = parts;
                const [startTime, endTime] = timeRange.split('-').map(time => {
                    const hour = parseInt(time);
                    const period = hour >= 8 && hour < 12 ? 'AM' : 'PM';
                    return `${hour % 12 === 0 ? 12 : hour % 12} ${period}`;
                });
                if (parseDays(days).includes(todayAbbreviation)) {
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
