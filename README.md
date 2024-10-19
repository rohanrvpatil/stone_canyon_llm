# Stone Canyon LLM chatbot:

A LLM powered service-oriented chatbot which can run decision trees and gather information from the user

## Implemented Libraries, Tech stack:

1. LLM: Gemini API
2. State Management: Redux
3. Database: MongoDB
4. Animations: framer-motion

## Features:

1. Validation implemented for name, phone, email, zip code, address
2. If a question has options, the user can input the option number, option text or click on the option to select it
3. Any input by user passes through the LLM, which corrects the spelling if wrong
4. At the end, a Floating modal appears with the service ID and user data, asking the user for confirmation

## Working:

1. The home_improvement.csv containing question funnels is stored in MongoDB
2. Category ID number is taken from the user which is used to initialize the chatbot
3. On clicking the chatbot icon, it gets initialized by the different question funnels of that category ID. They are fetched from MongoDB collection.
4. Once the user asks for help, the decision tree flow starts where the user can select an option to each question
5. When the decision tree ends, the user is prompted to enter personal details
6. At the end of the process, a Floating modal appears with the service ID and user data, asking the user for confirmation
