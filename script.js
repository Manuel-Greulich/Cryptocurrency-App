async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}






const API_KEY = '7QnwBQ7yfXUnMjzw4kX_';

let startDate = '';
let endDate = '';
let responseAsJson;
let responseAsJsonToday = '';
let myChart = null;
let bitcoinToday;



async function loadPrice(){

    let url = (`https://data.nasdaq.com/api/v3/datasets/BCHAIN/MKPRU?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`);
    let response = await fetch(url);  // serverantwort, warten bis daten kommen
    responseAsJson = await response.json(); // daten angekommen, umwandlung in ein JSON
   
    showBitcoinPrice(responseAsJson);
}



//##### ab hier second fatch second data########//


        let responseAsJsonSecond;
        let myDatas = [];
            
        async function bitcoin(){

        let url = ('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin&order=market_cap_desc&per_page=10&page=1&sparkline=false');
        let responsecoingecko = await fetch(url);
        responseAsJsonSecond = await responsecoingecko.json();
        console.log(responsecoingecko);

        showBTCData(responseAsJsonSecond);    

        }
        
        function showBTCData(){
            
            myDatas.push(responseAsJsonSecond['0']['circulating_supply']);
            myDatas.push(responseAsJsonSecond['0']['max_supply']);
            myDatas.push(responseAsJsonSecond['0']['last_updated']);
            myDatas.push(responseAsJsonSecond['0']['market_cap_rank']);
            myDatas.push(responseAsJsonSecond['0']['market_cap']);
            myDatas.push(responseAsJsonSecond['0']['price_change_percentage_24h']);
            myDatas.push(responseAsJsonSecond['0']['price_change_24h']);
            myDatas.push(responseAsJsonSecond['0']['ath']);



            getHistory(myDatas);
        }


        function getHistory(){
            let container = document.getElementById('container');
           
            
            container.innerHTML += `

                <div class="info-section-headline">
                    <h4 class="stye-headline">Bitcoin Dates & Facts</h4>
                </div>

                <div class="info-section" id="info-section">
                
                    <div class="left">

                        <div class="marginBottom"> Market-Cap Rank:  <b>#${myDatas[3]}</b> </div>
                        <div class="marginBottom"> Marketcap: <b>${myDatas[4].toFixed(2)} USD </b></div>
                        <div class="marginBottom"> Price Change last 24H: <b>${myDatas[5].toFixed(2)} % </b></div>
                        <div class="marginBottom"> Price Change last 24H: <b>${myDatas[6].toFixed(2)} USD </b></div> 
            
                    </div>

                    <div class ="left">

                        <div class="marginBottom"> Cirulation Supply: <b>${myDatas[0]} BTC </b></div>
                        <div class="marginBottom"> Circulation Max: <b>${myDatas[1]} BTC </b></div>
                        <div class="marginBottom"> All Time High Price: <b>${myDatas[7].toFixed(2)} USD </b></div>
                        <div class="marginBottom"> Last Update: <b>${myDatas[2].replace('T', ', ').replace('Z', '').slice(0, -4)}&nbspMEZ </b></div> 

                    </div>
                        
                </div>
               `;
        }




//####Zeigt aktuellen Bitcoinkurs von der API#####//

function showBitcoinPrice(responseAsJson){
    
    bitcoinToday = responseAsJson['dataset']['data'][0][1];  // position 1 im array -value- in variable verknüpft, also aktueller Preis
    document.getElementById('currentPrice').innerHTML = bitcoinToday.toFixed(2);
}   




//##### BTC in USD - USD in BTC Rechner

function calculator(){
    let test1 = document.getElementById('input1').value / bitcoinToday;
    test1 = document.getElementById('input2').value = test1.toFixed(6);

    document.getElementById('input-fields').scrollIntoView(); // scroll zum nächsten Part bzw ID myChart 
}

function caluclatorBack(){
    let get = document.getElementById('input2').value * bitcoinToday;
    get = document.getElementById('input1').value = get;

}



//#######  ######//

async function getDate(){   

    
    if (myChart != null) {  // != verneinen istnichtgleichnull, myChart hat den Wert null, 
        deleteChart();  
    }   
    
    startDate = document.getElementById('startDate').value; 
    endDate = document.getElementById('endDate').value;
    await loadPrice(); 
    document.getElementById('chart').classList.remove('d-none');
    document.getElementById('chart').scrollIntoView({
        behavior: 'smooth'
    });

    

    // buildTable();
    chart();
}


let labelsx = [];
let labelsy = [];


//##### Zeigt die Chart Grafik mit Preis und Datum #####//

function chart(){

    setTimeout(() => {

    let dateInfo = responseAsJson.dataset.data;

    dateInfo.reverse(); // ein Array  mit Elementen und kehrt die Reihenfolge des Arrays um. Aufuruf = .reverse()

    for (let i = 0; i < dateInfo.length; i++) {
        
      labelsx.push(dateInfo[i][0]);  // array 0 wert 0 = datum im array an stell 0  
      labelsy.push(dateInfo[i][1]);  // array 0 wert 1 = Preis im array an stelle 1

    }
        data = {
        labels: labelsx,  
        datasets: [{
        label: 'Bitcoin Price',
        backgroundColor: 'rgb(0, 0, 0)',
        borderColor: 'rgb(0, 0, 0)',
        data: labelsy,
        }]
    };

        config = {
        type: 'line',
        data: data,
        options: {
            scales: {
              x: {
                ticks: {
                  color: 'black'
                }
              },
              y: {
                ticks: {
                  color: 'black'
                }
              }
            }
        }
    };


    myChart = new Chart(
        document.getElementById('myChart'),
        config
    
    );
    }, 100);
}


//###### Zeigt eine Tabelle mit Preis und Datum ######//

// function buildTable(){

//     let tableData = document.getElementById('table');
//     let saveData = responseAsJson.dataset.data;

//     tableData.innerHTML = '';

//     for (let i = 0; i < saveData.length; i++) {
//         tableData.innerHTML += `
            
//         <table>
//             <tr>
//                 <td>${saveData[i][0]}</td>
//                 <td>${saveData[i][1].toFixed(2)}&nbsp<b> USD</b></td>
//             </tr>
//         </table> `;
//     }
// }

//### Löscht/leert den Chart nach der ersten Datumsabfrage, wenn eine 2. Abfrage gemacht wird #######//

function deleteChart(){
    
    startDate = [];
    endDate = [];
    myChart.destroy();
    labelsx = [];
    labelsy = [];
}
