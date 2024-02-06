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
                // pointRadius: 1,
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

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Veri çekme başarısız');
                }

                const data = await response.json();

                if (data && Array.isArray(data.dataSet) && data.dataSet.length > 0) {
                    const labels = data.dataSet.map((item) => {
                        const date = new Date(item.date);
                        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric' });
                    });
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
                                label: `${currencyKey}`,
                                data: closePrices,
                                backgroundColor: lineColor,
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
        const canvasId = `lineChart-${currencyKey}`;
        const ctx = document.getElementById(canvasId);

        if (ctx) {
            const existingChart = Chart.getChart(ctx);
            if (existingChart) {
                existingChart.destroy();
            }



            const myLineChart = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false,
                        },
                        title: {
                            display: false,
                        },
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
                    hover: {
                        mode: 'x',
                        intersect: false,
                    },
                },
            });


            return () => {
                myLineChart.destroy();
            };
        } else {
            console.error(`Canvas with id ${canvasId} not found.`);
        }
    }, [chartData, currencyKey]);

    return (
        <div>
            <canvas id={`lineChart-${currencyKey}`} width="600" height="300"></canvas>

        </div>
    );
};

export default LineChart;