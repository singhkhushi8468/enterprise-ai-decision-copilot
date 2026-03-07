def calculate_risk(revenue,budget):

 score=0

 if revenue<200000:

  score+=40

 if budget<50000:

  score+=30

 if revenue>1000000:

  score-=10

 if score<30:

  return "Low Risk"

 elif score<60:

  return "Medium Risk"

 else:

  return "High Risk"