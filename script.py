# Let me create a comprehensive analysis of the gathered information
import pandas as pd

# Create a data structure to organize the key information
research_data = {
    "thalassemia_burden": {
        "prevalence": "3-4% carrier rate (35-45 million carriers in India)",
        "new_cases": "10,000-15,000 new patients annually",
        "current_patients": "100,000 patients in India",
        "transfusion_needs": "500-700 transfusions per patient lifetime",
        "global_context": "India is 'Thalassemia capital of the world'"
    },
    "blood_shortage": {
        "annual_requirement": "14.6 million units",
        "current_supply": "12.5 million units",
        "shortage": "2.1 million units (14% deficit)",
        "deaths_per_day": "12,000 deaths due to blood shortage",
        "voluntary_donation_rate": "80% (WHO recommends 100%)"
    },
    "existing_systems": {
        "e_raktkosh": {
            "description": "National blood bank management system",
            "blood_banks": "3,800+ registered centers",
            "features": ["Real-time inventory", "Donor management", "Blood availability search"],
            "limitations": ["Manual processes", "Limited integration", "Poor real-time data"]
        },
        "blood_warriors": {
            "established": "2020",
            "impact": "3,333 donations, 4,437 registered donors",
            "programs": ["Blood Bridge", "HPLC testing", "Awareness campaigns"],
            "technology": "Blood Bridge Chatbot (AI-based)"
        }
    },
    "ai_solutions": {
        "predictive_analytics": ["Demand forecasting", "Donor availability prediction", "Supply optimization"],
        "machine_learning": ["Donor matching algorithms", "Retention prediction", "Risk assessment"],
        "IoT_integration": ["Real-time monitoring", "Temperature sensors", "Inventory tracking"],
        "blockchain": ["Supply chain transparency", "Data security", "Donor authentication"]
    },
    "cost_burden": {
        "annual_treatment_cost": "INR 1-2.5 lakhs ($1,200-3,000) per patient",
        "bmt_cost": "INR 10-60 lakhs ($12,000-72,000)",
        "screening_vs_treatment": "Screening costs 0.01% of treatment cost",
        "economic_impact": "10% of total healthcare expenditure"
    }
}

# Create a summary table of key statistics
key_stats = pd.DataFrame([
    ["Thalassemia Prevalence", "3-4% carrier rate", "35-45 million carriers"],
    ["New Cases Annually", "10,000-15,000", "Children born with Thalassemia Major"],
    ["Blood Shortage", "2.1 million units", "14% deficit from requirement"],
    ["Deaths per Day", "12,000", "Due to blood shortage"],
    ["Treatment Cost", "INR 1-2.5 lakhs", "Per patient per year"],
    ["BMT Cost", "INR 10-60 lakhs", "One-time cure cost"],
    ["Screening Efficiency", "0.01%", "Of treatment cost for prevention"]
], columns=["Metric", "Value", "Description"])

print("=== KEY STATISTICS SUMMARY ===")
print(key_stats.to_string(index=False))
print("\n")

# Technology solutions matrix
tech_solutions = pd.DataFrame([
    ["AI Predictive Analytics", "High", "Donor prediction, demand forecasting", "Medium"],
    ["Machine Learning", "High", "Pattern recognition, optimization", "Medium"],
    ["IoT Monitoring", "Medium", "Real-time tracking, inventory", "High"],
    ["Blockchain", "Medium", "Security, transparency", "Low"],
    ["Mobile Apps", "High", "Accessibility, engagement", "High"],
    ["Gamification", "Medium", "Donor retention, motivation", "Medium"],
    ["Social Media", "High", "Outreach, community building", "High"]
], columns=["Technology", "Impact Potential", "Primary Use Case", "Implementation Ease"])

print("=== TECHNOLOGY SOLUTIONS MATRIX ===")
print(tech_solutions.to_string(index=False))
print("\n")

# Save to CSV for potential chart creation
key_stats.to_csv("thalassemia_statistics.csv", index=False)
tech_solutions.to_csv("technology_solutions.csv", index=False)

print("Data saved to CSV files for visualization")