// LineChart.jsx

import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

const LineChart = ({ currencyKey, rate, change }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: `Kapanış Fiyatı`,
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                pointRadius: 1,

            },
        ],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const today = new Date();
                const formattedToday = today.toISOString().slice(0, 10).replace(/[-]/g, '') + '235900';

                const startDate = new Date();
                startDate.setDate(today.getDate() - 90);
                const formattedStartDate = startDate.toISOString().slice(0, 10).replace(/[-]/g, '') + '000000';

                const url = `https://web-paragaranti-pubsub.foreks.com/web-services/historical-data?userName=undefined&name=S${currencyKey}&exchange=FREE&market=N&group=F&last=300&period=1440&intraPeriod=null&isLast=false&from=${formattedStartDate}&to=${formattedToday}`;
                // console.log('Fetch URL:', url);
                // console.log(formattedStartDate);
                // console.log(formattedToday);

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Veri çekme başarısız');
                }

                const data = await response.json();
                // console.log('Fetched Data:', data);

                if (data && Array.isArray(data.dataSet) && data.dataSet.length > 0) {
                    const labels = data.dataSet.map((item) => new Date(item.date).toLocaleDateString());
                    const closePrices = data.dataSet.map((item) => item.close);

                    const lineColors = {
                        'EUR': 'blue',
                        'GBP': 'purple',
                        'GLD': 'brown',
                    };

                    const lineColor = lineColors[currencyKey] || 'rgba(75, 192, 192, 1)';

                    setChartData({
                        labels: labels,
                        datasets: [
                            {
                                label: `${currencyKey} (90 gün)`,
                                data: closePrices,
                                backgroundColor: `rgba(75, 192, 192, 0.2)`,
                                borderColor: lineColor,
                                borderWidth: 2,
                                pointRadius: 1,
                                pointStyle: false,
                            },
                        ],
                    });
                } else {
                    console.error('Veri formatı uygun değil.');
                }
            } catch (error) {
                console.error('Veri çekme hatası:', error.message);
            }
        };
        fetchData();
    }, [currencyKey]);

    useEffect(() => {
        const ctx = document.getElementById(`lineChart-${currencyKey}`);

        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }

        const myLineChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                plugins: {
                    tooltip: {
                        mode: 'nearest',
                        intersect: false,
                        callbacks: {
                            label: function (context) {
                                const label = context.dataset.label || '';
                                if (label) {
                                    return `${label}: ${context.parsed.y.toFixed(2)}`;
                                }
                                return null;
                            },
                        },
                    },
                },
                legend: {
                    onClick: (e, legendItem) => {
                        // Prevent the default toggle behavior
                        e.preventDefault();
                    },
                    display: false, // Set display to false to hide the legend
                },
                hover: {
                    mode: 'x',
                    intersect: false,
                },
            },
        });


        return () => {
            myLineChart.destroy();
        };
    }, [chartData, currencyKey]);

    return (
        <div>
            <canvas id={`lineChart-${currencyKey}`} width="300" height="150"></canvas>
        </div>
    );
};

export default LineChart;
