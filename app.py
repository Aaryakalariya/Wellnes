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

# DB CONNECTION FUNCTION (ADD THIS ON TOP)
def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="wellnes"
    )


# ✅ MEDICINES PAGE (NOW FROM DATABASE)
@app.route("/Medicines")
def medicine():

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()

    cursor.close()
    conn.close()

    return render_template("Medicines.html", products=products)


# ✅ ADD TO CART (USER BASED)
@app.route("/add_to_cart", methods=["POST"])
def add_to_cart():

    if "username" not in session:
        return redirect("/login")

    product_id = request.form.get("product_id")
    username = session["username"]

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    # 1. CHECK IF CART EXISTS
    cursor.execute("SELECT * FROM cart WHERE user_name=%s", (username,))
    cart = cursor.fetchone()

    if not cart:
        cursor.execute("INSERT INTO cart (user_name) VALUES (%s)", (username,))
        conn.commit()

        cursor.execute("SELECT * FROM cart WHERE user_name=%s", (username,))
        cart = cursor.fetchone()

    cart_id = cart["cart_id"]

    # 2. CHECK IF PRODUCT ALREADY IN CART
    cursor.execute("""
        SELECT * FROM cart_items 
        WHERE cart_id=%s AND product_id=%s
    """, (cart_id, product_id))

    item = cursor.fetchone()

    if item:
        # Increase quantity
        cursor.execute("""
            UPDATE cart_items 
            SET quantity = quantity + 1
            WHERE cart_id=%s AND product_id=%s
        """, (cart_id, product_id))
    else:
        # Insert new item
        cursor.execute("""
            INSERT INTO cart_items (cart_id, product_id, quantity, price_at_time)
            SELECT %s, product_id, 1, price FROM products WHERE product_id=%s
        """, (cart_id, product_id))

    conn.commit()

    cursor.close()
    conn.close()

    return redirect("/Medicines")

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

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE user_name=%s", (session['username'],))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    conditions = user["conditions"].split(",") if user.get("conditions") else []

    user_data = {
        "name": user["user_name"],
        "email": user["email"],
        "conditions": conditions,
        "orders": [],
        "reports": [],
        "analysis": "AI health summary will appear here.",
        "suggestions": conditions
    }

    return render_template("profile.html", user_data=user_data)

@app.route("/edit-profile")
def edit_profile():
    if 'username' not in session:
        return redirect('/login')

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE user_name=%s", (session['username'],))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    user_conditions = user["conditions"].split(",") if user.get("conditions") else []

    return render_template("edit-profile.html", user=user, user_conditions=user_conditions)

@app.route("/update-profile", methods=["POST"])
def update_profile():

    if 'username' not in session:
        return redirect('/login')

    username = request.form["username"]
    email = request.form["email"]
    password = request.form["password"]

    conditions = request.form.getlist("conditions")
    conditions_str = ",".join(conditions)

    conn = get_db()
    cursor = conn.cursor()

    if password:  # ✅ only update password if entered
        query = """
            UPDATE users 
            SET user_name=%s, email=%s, password=%s, conditions=%s 
            WHERE user_name=%s
        """
        cursor.execute(query, (username, email, password, conditions_str, session['username']))
    else:
        query = """
            UPDATE users 
            SET user_name=%s, email=%s, conditions=%s 
            WHERE user_name=%s
        """
        cursor.execute(query, (username, email, conditions_str, session['username']))

    conn.commit()

    cursor.close()
    conn.close()

    # ✅ Update session username
    session["username"] = username

    return redirect("/profile")

@app.route("/delete_account", methods=["POST"])
def delete_account():

    if 'username' not in session:
        return redirect('/login')

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM users WHERE user_name=%s", (session['username'],))
    conn.commit()

    cursor.close()
    conn.close()

    session.clear()

    return redirect("/")


# @app.route("/cart")
# def cart():
#     if 'username' not in session:
#         return redirect('/login')

if __name__ == "__main__":
    app.run(debug=True)
