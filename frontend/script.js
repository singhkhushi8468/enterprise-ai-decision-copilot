function generateStrategy(){

  let revenue = Number(document.getElementById("revenue").value)
  let budget = Number(document.getElementById("budget").value)
  let goal = document.getElementById("goal").value
  
  if(!revenue || !budget || !goal){
  alert("Please fill all fields")
  return
  }
  
  let profit = revenue - budget
  let ratio = budget / revenue
  
  let risk=""
  let strategy=""
  let aiAdvice=""
  let advisor=""
  let aiScore=0
  
  if(ratio <= 0.2){
  
  risk="Low Risk"
  strategy="Business is financially strong. Scale marketing and expansion."
  aiAdvice="AI suggests expanding into new markets."
  advisor="Strong performance. Consider hiring more sales teams."
  aiScore=90
  
  }
  
  else if(ratio <= 0.5){
  
  risk="Moderate Risk"
  strategy="Optimize marketing and monitor financial performance."
  aiAdvice="AI suggests improving marketing efficiency."
  advisor="Focus on improving customer retention."
  aiScore=65
  
  }
  
  else{
  
  risk="High Risk"
  strategy="Reduce spending and stabilize financial operations."
  aiAdvice="AI suggests cost optimization."
  advisor="Control expenses before expanding business."
  aiScore=40
  
  }
  
  document.getElementById("strategy").innerText=strategy
  document.getElementById("aiAdvice").innerText=aiAdvice
  document.getElementById("advisor").innerText=advisor
  document.getElementById("risk").innerText=risk
  
  document.getElementById("profit").innerText=profit
  document.getElementById("aiScore").innerText=aiScore
  
  document.getElementById("revKPI").innerText=revenue
  document.getElementById("budgetKPI").innerText=budget
  document.getElementById("riskKPI").innerText=risk
  
  updateGrowthChart(revenue)
  updateFinanceChart(revenue,budget,profit)
  
  saveHistory(revenue,budget,goal,risk,profit)
  
  }
  
  function simulateGrowth(value){
  document.getElementById("simValue").innerText=value
  }
  
  function saveHistory(revenue,budget,goal,risk,profit){
  
  let history=document.getElementById("history")
  
  let item=document.createElement("li")
  
  item.innerText=`Revenue: ${revenue} | Budget: ${budget} | Goal: ${goal} | Profit: ${profit} | Risk: ${risk}`
  
  history.prepend(item)
  
  }
  
  function clearDashboard(){
  
  document.getElementById("revenue").value=""
  document.getElementById("budget").value=""
  document.getElementById("goal").value=""
  
  document.getElementById("strategy").innerText=""
  document.getElementById("aiAdvice").innerText=""
  document.getElementById("advisor").innerText=""
  document.getElementById("risk").innerText=""
  
  document.getElementById("profit").innerText="0"
  document.getElementById("aiScore").innerText="0"
  
  document.getElementById("revKPI").innerText="0"
  document.getElementById("budgetKPI").innerText="0"
  document.getElementById("riskKPI").innerText="-"
  
  document.getElementById("history").innerHTML=""
  
  }
  