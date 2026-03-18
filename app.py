from flask import Flask, render_template, request, session, redirect
import mysql.connector

app = Flask(__name__)
app.secret_key = "wellness_secret_key"

@app.route("/",methods=["GET","POST"])
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

    cursor = conn.cursor(buffered=True)

    query = "SELECT * FROM users WHERE email=%s AND password=%s"
    values = (email, password)

    cursor.execute(query, values)

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user:
        session["username"] = user[1]
        user = session["username"]
        return render_template("/index.html", user=user)
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

        query = "INSERT INTO users (user_name, email, password) VALUES (%s, %s, %s)"
        values = (username, email, password)

        cursor.execute(query, values)
        conn.commit()

        cursor.close()
        conn.close()

        return render_template("/login.html")



@app.route('/profile')
def profile():
    if 'username' not in session:
        return redirect('/login')

    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="wellnes"
    )

    cursor = conn.cursor(dictionary=True, buffered=True)

    query = "SELECT * FROM users WHERE user_name=%s"
    cursor.execute(query, (session['username'],))

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    # Handle conditions
    if user.get("conditions"):
        conditions = user["conditions"].split(",")
    else:
        conditions = []

    user_data = {
        "name": user["user_name"],
        "email": user["email"],
        "conditions": conditions,
        "orders": [],
        "reports": [],
        "analysis": "AI health summary will appear here.",
        "suggestions": conditions  # temporary
    }

    return render_template("profile.html", user_data=user_data)

@app.route("/edit-profile")
def edit_profile():
    if 'username' not in session:
        return redirect('/login')

    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="wellnes"
    )

    cursor = conn.cursor(dictionary=True, buffered=True)

    query = "SELECT * FROM users WHERE user_name=%s"
    cursor.execute(query, (session['username'],))

    user = cursor.fetchone()

    cursor.close()
    conn.close()


    return render_template("edit-profile.html", user=user)

@app.route("/update-profile", methods=["POST"])
def update_profile():

    if 'username' not in session:
        return redirect('/login')

    username = request.form["username"]
    email = request.form["email"]
    password = request.form["password"]

    conditions = request.form.getlist("conditions")
    conditions_str = ",".join(conditions)

    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="wellnes"
    )

    cursor = conn.cursor(buffered=True)

    query = """
        UPDATE users 
        SET user_name=%s, email=%s, password=%s, conditions=%s 
        WHERE user_name=%s
    """

    cursor.execute(query, (username, email, password, conditions_str, session['username']))
    conn.commit()

    cursor.close()
    conn.close()

    session["username"] = username

    return redirect("/profile")

@app.route("/delete_account", methods=["POST"])
def delete_account():

    if 'username' not in session:
        return redirect('/login')

    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="wellnes"
    )

    cursor = conn.cursor(buffered=True)

    query = "DELETE FROM users WHERE user_name=%s"
    cursor.execute(query, (session['username'],))
    conn.commit()

    cursor.close()
    conn.close()

    session.clear()

    return redirect("/")
if __name__ == "__main__":
    app.run(debug=True)
