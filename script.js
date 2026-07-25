let myChart = null;

function createChart(labels, prices) {
    const canvas = document.getElementById('myChart');
    if (!canvas) return;

    if (typeof Chart === 'undefined') {
        console.error('Chart.js failed to load.');
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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


const currencySelector = document.getElementById('currency');
let currency = 'usd';

if (currencySelector) {
    currencySelector.addEventListener('change', () => {
        currency = currencySelector.value.toLowerCase();
        getData();
        tracker();
    });
}


async function getData() {

    const apiURL = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=${currency}&days=7`;

    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error('Unable to fetch chart data');
        }

        const data = await response.json();
        const priceHistory = data.prices || [];

        if (!priceHistory.length) {
            throw new Error('No chart data returned');
        }

        const labels = priceHistory.map(item => new Date(item[0]).toLocaleDateString());
        const prices = priceHistory.map(item => item[1]);
        const currentPrice = prices[prices.length - 1];
        const currentPriceElem = document.getElementById('current-price');
        if (currentPriceElem) {
            const symbols = {
                usd: '$',
                inr: '₹',
                eur: '€',
                jpy: '¥',
                chf: 'Fr'
            };
            const symbol = symbols[currency] || currency.toUpperCase() + ' ';
            currentPriceElem.textContent = symbol + currentPrice.toLocaleString('en-US', { maximumFractionDigits: 2 });
        }

        const firstPrice = prices[0];
        const lastPrice = prices[prices.length - 1];
        const change = firstPrice ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0;

        const changeEl = document.getElementById('change');
        if (changeEl) {
            changeEl.textContent = `${change.toFixed(2)}%`;
        }

        createChart(labels, prices);


    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getData();
    setInterval(getData, 60000);
});

async function tracker() {

    const api = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin,solana&vs_currencies=${currency}&days=7`

    try {
        const responsw2 = await fetch(api);
        if (!responsw2.ok) {
            throw new Error('something went wrong')
        }

        const data2 = await responsw2.json();
        const coins = {
            BTC: data2.bitcoin?.[currency] ?? 0,
            ETH: data2.ethereum?.[currency] ?? 0,
            DOGE: data2.dogecoin?.[currency] ?? 0,
            SOL: data2.solana?.[currency] ?? 0
        }

        const btc = document.getElementById('btc').textContent = coins.BTC
        const eth = document.getElementById('eth').textContent = coins.ETH
        const doge = document.getElementById('doge').textContent = coins.DOGE
        const sol = document.getElementById('sol').textContent = coins.SOL

    } catch (error) {
        console.log(error);

    }
}

document.addEventListener('DOMContentLoaded', () => {
    tracker();
    setInterval(tracker, 60000);
});



