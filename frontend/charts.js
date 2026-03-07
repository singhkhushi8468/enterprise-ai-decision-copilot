const growthCtx = document.getElementById("growthChart").getContext("2d")

const growthChart = new Chart(growthCtx,{

type:"line",

data:{
labels:["Q1","Q2","Q3","Q4"],
datasets:[{
label:"Projected Business Growth (%)",
data:[10,20,30,40],
borderColor:"#3b82f6",
borderWidth:3,
tension:0.4
}]
},

options:{
responsive:true,
scales:{
y:{beginAtZero:true}
}
}

})

function updateGrowthChart(revenue){

let growthData

if(revenue >= 500000){
growthData=[50,80,100,140]
}

else if(revenue >= 100000){
growthData=[30,45,60,80]
}

else{
growthData=[10,20,30,40]
}

growthChart.data.datasets[0].data=growthData
growthChart.update()

}

const financeCtx = document.getElementById("financeChart").getContext("2d")

const financeChart = new Chart(financeCtx,{

type:"bar",

data:{
labels:["Revenue","Budget","Profit"],
datasets:[{
label:"Financial Overview",
data:[0,0,0],
backgroundColor:["#3b82f6","#f59e0b","#22c55e"]
}]
},

options:{
responsive:true
}

})

function updateFinanceChart(revenue,budget,profit){

financeChart.data.datasets[0].data=[revenue,budget,profit]

financeChart.update()

}
