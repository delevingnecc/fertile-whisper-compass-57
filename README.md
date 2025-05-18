# Genesis: Your Fertility Co-Pilot

**Genesis** is a personalized, concierge-style fertility app that guides individuals and couples through their reproductive health journey. By integrating wearable biometrics, symptom logs, and AI-driven insights, Genesis empowers users to make informed decisions and take proactive steps toward their fertility goals.

---

## 🚀 Features

* **Onboarding & Profiles**: Collect basic details (age, goals, health history) and user preferences.
* **Wearable Integration**: Sync with Oura Ring, Apple Watch, Fitbit, Garmin, and more for continuous data.
* **AI Chat Companion**: Interact with Eve/Adam for daily check-ins, mood logging, pain tracking, and personalized tips.
* **Predictive Health Modeling**: Flag early signs of endometriosis, PCOS, hormone imbalances, and other conditions.
* **Smart Dashboard**: Visualize cycle charts, HRV trends, skin temperature, and pain severity.
* **Clinician Access**: Book 30-minute virtual consultations with vetted professionals.
* **Community Forums**: Ask questions, share experiences anonymously or by profile, and join expert webinars.
* **Product Recommendations**: Browse hormone-friendly supplements, skincare, and lifestyle tools.

---

## 🏗️ Architecture & Tech Stack

* **Frontend**: React Native (iOS & Android), Tailwind CSS
* **Backend**: Node.js, Express.js
* **Database**: PostgreSQL
* **AI & ML**: OpenAI GPT for conversational agent, scikit-learn & TensorFlow for predictive models
* **Wearable SDKs**: Oura Cloud API, Apple HealthKit, Fitbit Web API
* **Hosting**: AWS (EC2, RDS, S3)

---

## ⚙️ Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-org/genesis-fertility-app.git
   cd genesis-fertility-app
   ```

2. **Install dependencies**:

   * **Backend**:

     ```bash
     cd server
     npm install
     ```
   * **Frontend**:

     ```bash
     cd ../mobile
     npm install
     ```

3. **Configure environment variables**:

   * Copy the example file and fill in your keys:

     ```bash
     cp server/.env.example server/.env
     cp mobile/.env.example mobile/.env
     ```

4. **Run the application**:

   * **Backend**:

     ```bash
     cd server
     npm run dev
     ```
   * **Frontend** (iOS):

     ```bash
     cd ../mobile
     npx react-native run-ios
     ```
   * **Frontend** (Android):

     ```bash
     npx react-native run-android
     ```

---

- Website for subscriber demo https://kzmqe3s89xdww2w600oh.lite.vusercontent.net/ 
---

## 📱 Usage

1. Open the Genesis mobile app.
2. Complete the onboarding flow with your details and goals.
3. Sync your wearable device for real-time data.
4. Interact with Eve/Adam in the chat for daily check-ins.
5. Explore the Dashboard, Community, Clinician Access, and Products tabs.
6. Track your progress and receive actionable insights.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/YourFeature`.
3. Commit your changes: `git commit -m "Add YourFeature"`.
4. Push to the branch: `git push origin feature/YourFeature`.
5. Open a Pull Request describing your changes.

Please ensure all code follows our linting and testing standards.

---

## 📝 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

* **OpenAI**: For providing the GPT models that power our conversational AI companion.
* **Lovable**: For the design mockups and UI/UX assets used throughout the app.
* https://github.com/sngweizhi: For mobile app mockup development and AI Agent generation.


---

*Genesis: Navigating your fertility journey with confidence.*
