from flask import Flask, render_template, request

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

@app.route("/register")
def register():
    return render_template("register.html")

@app.route("/submit_register")
def submit_register():


@app.route("/submit_login")
def submit_login():


if __name__ == "__main__":
    app.run(debug=True)
