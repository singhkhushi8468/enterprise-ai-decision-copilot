def generate_strategy(revenue,budget,goal):

 strategies=[]

 if goal.lower()=="growth":

  strategies.append("Expand into new geographic markets")

 if budget<100000:

  strategies.append("Increase marketing investment")

 if revenue>1000000:

  strategies.append("Invest in automation and AI")

 if budget>200000:

  strategies.append("Launch multi-channel marketing campaigns")

 if goal.lower()=="profit":

  strategies.append("Reduce operational cost using automation")

 return strategies