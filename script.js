let myChart = null;
const ctx = document.getElementById('myChart').getContext('2d');

function createChart(labels, prices) {
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Bitcoin',
                    data: prices,
                    borderWidth: 3,
                    pointRadius: 0,
                    fill: true,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(50, 189, 23, 0.1)',
                    tension: 0.4,
                },
            ],
        },
        options: {
            interaction: {
                mode: 'nearest',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: true,
                },
            },
            layout: {
                padding: {
                    left: 30,
                    right: 30,
                    top: 40,
                    bottom: 10
                },
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 7,
                        color: '#111',
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    },
                    ticks: {
                        color: '#111',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

async function getData() {
    const apiURL = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7';

    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error('Unable to fetch chart data');
        }

        const data = await response.json();
        const priceHistory = data.prices || [];

        const labels = priceHistory.map(item => new Date(item[0]).toLocaleDateString());
        const prices = priceHistory.map(item => item[1]);
        const currentPrice = prices[prices.length - 1];
        const currentPriceElem = document.getElementById('current-price');
        if (currentPriceElem) {
            currentPriceElem.textContent = '$' + currentPrice.toLocaleString('en-US', { maximumFractionDigits: 2 });
        }

        const firstPrice = prices[0];
        const lastPrice = prices[prices.length - 1];
        const change = ((lastPrice - firstPrice) / firstPrice) * 100;

        const changeEl = document.getElementById('change');
        if (changeEl) {
            changeEl.textContent = `${change.toFixed(2)}%`;
        }

        console.log('currentPrice', currentPrice);
        console.log('labels', labels);
        console.log('prices', prices);

        createChart(labels, prices);
    } catch (error) {
        console.error(error);
    }
}

getData();
