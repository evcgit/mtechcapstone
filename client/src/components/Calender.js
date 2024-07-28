import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

// Utility functions for time and day parsing
const parseTime = (time) => {
    const [hour, period] = time.split(' ');
    let hour24 = parseInt(hour);
    if (period === 'PM' && hour !== '12') {
        hour24 += 12;
    } else if (period === 'AM' && hour === '12') {
        hour24 = 0;
    }
    return hour24;
};

const isWithinRange = (slotTime, startTime, endTime) => {
    const slotHour24 = parseTime(slotTime);
    const startHour24 = parseTime(startTime);
    const endHour24 = parseTime(endTime);
    return slotHour24 >= startHour24 && slotHour24 < endHour24;
};

const checkConflict = (event1, event2) => {
    const parseDays = (days) => {
        const parsedDays = [];
        for (let i = 0; i < days.length; i++) {
            if (days[i] === 'T' && days[i + 1] === 'H') {
                parsedDays.push('TH');
                i++;
            } else {
                parsedDays.push(days[i]);
            }
        }
        return parsedDays;
    };

    const [days1, timeRange1] = event1.schedule.split(' ');
    const [startTime1, endTime1] = timeRange1.split('-');
    const [days2, timeRange2] = event2.schedule.split(' ');
    const [startTime2, endTime2] = timeRange2.split('-');

    const parsedDays1 = parseDays(days1);
    const parsedDays2 = parseDays(days2);

    const daysOverlap = parsedDays1.some(day => parsedDays2.includes(day));
    const timesOverlap = daysOverlap &&
        (parseTime(startTime1) < parseTime(endTime2) && parseTime(endTime1) > parseTime(startTime2));

    return timesOverlap;
};

const Calendar = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [events, setEvents] = useState([]);
    const [conflicts, setConflicts] = useState([]);

    const getTodayAbbreviation = () => {
        const today = new Date().getDay();
        const abbreviations = ['S', 'M', 'T', 'W', 'TH', 'F', 'S'];
        return abbreviations[today];
    };

    const todayAbbreviation = getTodayAbbreviation();

    const parseDays = (days) => {
        const parsedDays = [];
        for (let i = 0; i < days.length; i++) {
            if (days[i] === 'T' && days[i + 1] === 'H') {
                parsedDays.push('TH');
                i++;
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

                // Detect conflicts
                const conflictList = [];
                for (let i = 0; i < filteredEvents.length; i++) {
                    for (let j = i + 1; j < filteredEvents.length; j++) {
                        if (checkConflict(filteredEvents[i], filteredEvents[j])) {
                            conflictList.push({
                                event1: filteredEvents[i],
                                event2: filteredEvents[j],
                                conflictKey: `${filteredEvents[i].title} conflicts with ${filteredEvents[j].title}`
                            });
                        }
                    }
                }
                setEvents(filteredEvents);
                setConflicts(conflictList);
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
                const [startTime, endTime] = timeRange.split('-');
                if (parseDays(days).includes(todayAbbreviation)) {
                    timeSlots.forEach(slot => {
                        if (isWithinRange(slot, startTime, endTime)) {
                            timeSlotEvents[slot].push({
                                ...event,
                                conflict: conflicts.some(conflict => conflict.event1.title === event.title || conflict.event2.title === event.title)
                            });
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
        <div className='flex flex-col h-full bg-gray-50 rounded-lg shadow-lg p-2'>
            <div className='flex flex-col'>
                <div className='flex-grow overflow-y-auto custom-scrollbar'>
                    <div className='space-y-2'>
                        {timeSlots.map((time, index) => (
                            <div key={index} className='relative flex flex-col p-2 bg-white border border-gray-300 rounded-lg shadow-md'>
                                <div className='text-gray-600 font-semibold mb-1'>{time}</div>
                                <div className='relative'>
                                    {timeSlotEvents[time].length > 0 ? (
                                        timeSlotEvents[time].map((event, eventIndex) => (
                                            <div
                                                key={eventIndex}
                                                className={`bg-blue-200 ${event.conflict ? 'border-red-500 border-2' : ''} text-blue-800 rounded-lg px-2 py-1 mb-1 shadow-sm text-xs`}
                                                style={{ position: 'relative', zIndex: 1 }}
                                            >
                                                <span className='text-sm'>{event.title}</span>
                                                {event.conflict && <span className='text-red-600 text-xs ml-2'>(Conflict)</span>}
                                            </div>
                                        ))
                                    ) : (
                                        <div className='text-gray-400 text-xs'>No events</div>
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
