import React, { useContext, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import GlobalContext from '../../context/GlobalContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [classesData, setClassesData] = useState({});
  const [meetingsData, setMeetingsData] = useState({});
  const [consultationsData, setConsultationsData] = useState({});

  const { allEvents } = useContext(GlobalContext);

  useEffect(() => {
    const calculateChartData = () => {
      let classes = Array(12).fill(0);
      let meetings = Array(12).fill(0);
      let consultations = Array(12).fill(0);

      allEvents.forEach((event) => {
        if (event.category.name === 'Class') {
          classes[new Date(event.date).getMonth()] += 1;
        }
        if (event.category.name === 'Meeting') {
          meetings[new Date(event.date).getMonth()] += 1;
        }
        if (event.category.name === 'Consultations') {
          consultations[new Date(event.date).getMonth()] += 1;
        }
      });

      const classesByMonth = {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            label: 'Classes by month',
            data: classes,
            backgroundColor: ['#6366f1'],
            borderWidth: 1,
          },
        ],
      };
      setClassesData(classesByMonth);

      const meetingsByMonth = {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            label: 'Meetings by month',
            data: meetings,
            backgroundColor: ['#ec4899'],
            borderWidth: 1,
          },
        ],
      };
      setMeetingsData(meetingsByMonth);

      const consultationsByMonth = {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            label: 'Consultations by month',
            data: consultations,
            backgroundColor: ['#22c55e'],
            borderWidth: 1,
          },
        ],
      };
      setConsultationsData(consultationsByMonth);
    };

    if (allEvents?.length > 0) {
      calculateChartData();
    }
  }, [allEvents]);

  return (
    <div className='my-auto mt-6 h-[90vh] w-[100%] overflow-y-scroll'>
      <div className='m-auto w-[60%] '>
        <h2>Classes by Month</h2>
        {classesData && classesData.labels ? (
          <Bar data={classesData} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className='m-auto w-[60%]'>
        <h2>Meetings by Month</h2>
        {meetingsData && meetingsData.labels ? (
          <Bar data={meetingsData} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className='m-auto w-[60%]'>
        <h2>Consultations by Month</h2>
        {consultationsData && consultationsData.labels ? (
          <Bar data={consultationsData} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
