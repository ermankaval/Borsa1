// LineChart.jsx

import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const LineChartDetay = ({ currencyKey, rate, change }) => {
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
        options: {
            legend: {
                display: false,
            },
        },
    });

    const [chartError, setChartError] = useState(null);
    const [lineColor, setLineColor] = useState(getRandomColor());

    useEffect(() => {
        setLineColor(getRandomColor());
    }, [currencyKey]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const today = new Date();
                const formattedToday = today.toISOString().slice(0, 10).replace(/[-]/g, '') + '235900';

                const startDate = new Date();
                startDate.setDate(today.getDate() - 30);
                const formattedStartDate = startDate.toISOString().slice(0, 10).replace(/[-]/g, '') + '000000';

                const url = `https://web-paragaranti-pubsub.foreks.com/web-services/historical-data?userName=undefined&name=S${currencyKey}&exchange=FREE&market=N&group=F&last=300&period=1440&intraPeriod=null&isLast=false&from=${formattedStartDate}&to=${formattedToday}`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Veri çekme başarısız');
                }

                const data = await response.json();

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
                        options: {
                            legend: {
                                display: false,
                            },
                        },
                    });
                } else {
                    // console.error('Veri formatı uygun değil.');
                    setChartError('No Data');
                    setChartData({ ...chartData, datasets: [{ data: [] }] }); // Set empty data
                }
            } catch (error) {
                // console.error('Veri çekme hatası:', error.message);
                setChartError('No Data');
                setChartData({ ...chartData, datasets: [{ data: [] }] }); // Set empty data
            }
        };
        fetchData();
    }, [currencyKey]);

    useEffect(() => {
        if (chartError) {
            return; // No need to render the chart if there's an error
        }
        const ctx = document.getElementById(`lineChart-${currencyKey}`);

        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }

        const myLineChart = new Chart(ctx, {
            type: 'line',
            data: chartData, // Use chartData directly
            responsive: true,
            options: {
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: false,
                    },
                    tooltip: {
                        enabled: false, // Disable tooltips
                    },
                },

                scales: {
                    x: {
                        display: false, // Hide x-axis labels
                    },
                    y: {
                        display: false, // Hide y-axis labels
                    },
                },
            },
        });

        return () => {
            myLineChart.destroy();
        };
    }, [chartData, currencyKey, chartError]);

    return (
        <div>
            {chartError ? (
                <p>No Data</p>
            ) : (
                <canvas id={`lineChart-${currencyKey}`} width="100" height="50"></canvas>
            )}
        </div>
    );
};

export default LineChartDetay;
