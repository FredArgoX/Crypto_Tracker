const assets = [
    { name: "HEX (ETH)", amount: 537_000, url: "https://api.dexscreener.com/latest/dex/pairs/ethereum/0x9e0905249CeEFfFB9605E034b534544684A58BE6" },
    //{ name: "eHEX (PLS)", amount: 72_980, url: "https://api.dexscreener.com/latest/dex/pairs/pulsechain/0xF0eA3efE42C11c8819948Ec2D3179F4084863D3F" },
    { name: "HEX", amount: 513_368, url: "https://api.dexscreener.com/latest/dex/pairs/pulsechain/0xf1F4ee610b2bAbB05C635F726eF8B0C568c8dc65" },
    { name: "PLS", amount: 50_000, url: "https://api.dexscreener.com/latest/dex/pairs/pulsechain/0xE56043671df55dE5CDf8459710433C10324DE0aE" },
    { name: "PLSX", amount: 382_898_921, url: "https://api.dexscreener.com/latest/dex/pairs/pulsechain/0x1b45b9148791d3a104184Cd5DFE5CE57193a3ee9" },
    { name: "INC", amount: 631, url: "https://api.dexscreener.com/latest/dex/pairs/pulsechain/0xf808Bb6265e9Ca27002c0A04562Bf50d4FE37EAA" },
    { name: "XEN (ETH)", amount: 30_808_114_900, url: "https://api.dexscreener.com/latest/dex/pairs/ethereum/0x2a9d2ba41aba912316D16742f259412B681898Db" },
    //{ name: "pXEN", amount: 1_411_058_764_239, url: "https://api.dexscreener.com/latest/dex/pairs/pulsechain/0x61C8D2DeE20F8e303B999D485cFa577054196B40" },
    //{ name: "pDXN", amount: 6_662, url: "https://api.dexscreener.com/latest/dex/pairs/pulsechain/0x385de5FB8953DC34dcBB6da9CBa0896653149096" },
    //{ name: "DWB", amount: 11_423_862, url: "https://api.dexscreener.com/latest/dex/pairs/pulsechain/0xe644f9B23375D07f5fE11cC223716C6Db7EA356B" },
    //{ name: "PEAR", amount: 181_466_712_798, url: "https://api.dexscreener.com/latest/dex/pairs/pulsechain/0x5Ac9Ce15e67ac2c76c030B149EEe4cc73e3238Ae" },
    //{ name: "PEACH", amount: 3_235_764, url: "https://api.dexscreener.com/latest/dex/pairs/pulsechain/0xEC1415fdc0a7f2B8cbcE45D183Eb02b487db00F2" },
    //{ name: "NANANA", amount: 10_373, url: "https://api.dexscreener.com/latest/dex/pairs/pulsechain/0xB1133248aB5B307f4C903fA750a44861e13383a1" }
];

async function fetchPrice(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.pairs && data.pairs.length > 0) {
            return parseFloat(data.pairs[0].priceUsd); // Convert price to number
        }
    } catch (error) {
        console.error(`Error fetching price for ${url}:`, error);
    }
    return null; // Return null if there's an error
}

async function updateTable() {
    const tableBody = document.querySelector("#cryptoTable tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    let totalSumUSD = 0;
    let totalSumMXN = 0;
    let totalPercentageSum = 0;
    let assetData = [];

    // First loop: Fetch all prices and calculate total sums
    for (const asset of assets) {
        const price = await fetchPrice(asset.url);
        const totalValueUSD = price ? Math.floor(asset.amount * price) : 0;
        const totalValueMXN = Math.floor(totalValueUSD * 20);

        totalSumUSD += totalValueUSD;
        totalSumMXN += totalValueMXN;

        assetData.push({
            name: asset.name,
            amount: asset.amount,
            price: price,
            totalValueUSD: totalValueUSD,
            totalValueMXN: totalValueMXN
        });
    }

    assetData.sort((a, b) => b.totalValueUSD - a.totalValueUSD);

    // Second loop: Populate the table with data
    for (const asset of assetData) {
        const percentage = totalSumUSD ? ((asset.totalValueUSD / totalSumUSD) * 100).toFixed(0) : "0";
        totalPercentageSum += parseFloat(percentage);

        await new Promise(resolve => setTimeout(resolve, 300));

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${asset.name}</td>
            <td>${asset.amount.toLocaleString()}</td>
            <td>${asset.price ? `${asset.price.toFixed(10)}` : "N/A"}</td>
            <td>${asset.price ? `${asset.totalValueUSD.toLocaleString()}` : "N/A"}</td>
            <td>${asset.price ? `${asset.totalValueMXN.toLocaleString()}` : "N/A"}</td>
            <td>${asset.price ? `${percentage}` : "N/A"}</td>
        `;
        tableBody.appendChild(row);
    }

    // 👉 Compute top 3 core totals
    const top3 = assetData.slice(0, 3);
    const coreUSD = top3.reduce((sum, a) => sum + a.totalValueUSD, 0);
    const coreMXN = top3.reduce((sum, a) => sum + a.totalValueMXN, 0);
    const corePercent = totalSumUSD ? ((coreUSD / totalSumUSD) * 100).toFixed(0) : "0";

    await new Promise(resolve => setTimeout(resolve, 300));
    const totalCoreRow = document.createElement("tr");
    totalCoreRow.innerHTML = `
        <td>Top 3 Total</td>
        <td>-</td>
        <td>-</td>
        <td>${coreUSD.toLocaleString()}</td>
        <td>${coreMXN.toLocaleString()}</td>
        <td>${corePercent}</td>
    `;
    tableBody.appendChild(totalCoreRow);

    // 👉 Now add the grand total row
    await new Promise(resolve => setTimeout(resolve, 300));
    const totalRow = document.createElement("tr");
    totalRow.innerHTML = `
        <td>Grand Total</td>
        <td>-</td>
        <td>-</td>
        <td>${totalSumUSD.toLocaleString()}</td>
        <td>${totalSumMXN.toLocaleString()}</td>
        <td>${totalPercentageSum.toFixed(0)}</td>
    `;
    tableBody.appendChild(totalRow);
}


// Fetch prices and update the table every 60 seconds
updateTable();
setInterval(updateTable, 600000);


// Show Current Date
document.addEventListener("DOMContentLoaded", function () {
    function formatDate(date) {
        const options = { month: "long", day: "numeric", year: "numeric" };
        let day = date.getDate();
        let suffix = getDaySuffix(day);
        let formattedDate = date.toLocaleDateString("en-US", options);
        
        // Insert the suffix manually
        return formattedDate.replace(day, day + suffix);
    }

    function getDaySuffix(day) {
        if (day >= 11 && day <= 13) return "th"; // Special case for 11-13
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    }

    let dateElement = document.getElementById("currentDate");
    let currentDate = new Date();
    dateElement.textContent = formatDate(currentDate);
});


