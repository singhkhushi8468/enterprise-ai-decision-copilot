import sqlite3

def save_analysis(revenue,budget,goal,risk):

 conn=sqlite3.connect("analysis.db")

 cursor=conn.cursor()

 cursor.execute(

 "INSERT INTO history VALUES (?,?,?,?)",

 (revenue,budget,goal,risk)

 )

 conn.commit()

 conn.close()