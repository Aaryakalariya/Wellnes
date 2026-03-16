from flask import Flask, render_template, request
import mysql.connector

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/Chat-bot")
def chat():
    return render_template("Chat-bot.html")

@app.route("/Medicines")
def medicine():
    return render_template("Medicines.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/submit_login", methods=["POST"])
def submit_login():

    email = request.form["email"]
    password = request.form["password"]

    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="wellnes"
    )

    cursor = conn.cursor()

    query = "SELECT * FROM user WHERE email=%s AND password=%s"
    values = (email, password)

    cursor.execute(query, values)

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user:
        return "Login Successful"
    else:
        return "Invalid Email or Password"

@app.route("/register")
def register():
    return render_template("register.html")

@app.route("/submit_register",methods=["POST","GET"])
def submit_register():
        username = request.form["username"]
        email = request.form["email"]
        password = request.form["password"]

        # Database connection
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="wellnes"
        )

        cursor = conn.cursor()

        query = "INSERT INTO user (user_name, email, password) VALUES (%s, %s, %s)"
        values = (username, email, password)

        cursor.execute(query, values)
        conn.commit()

        cursor.close()
        conn.close()

        return render_template("/login.html")

# @app.route("/submit_login")
# def submit_login():


if __name__ == "__main__":
    app.run(debug=True)
