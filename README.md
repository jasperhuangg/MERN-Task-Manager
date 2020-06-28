# Doozy Task Manager
A task manager app written with the Express.js, React.js, Node.js, and MongoDB inspired by TickTick. The app is complete functionality-wise and is ready to be used. I'd still like to work on the styling for a few items and responsiveness.
## Setup
Clone the repo, cd into the 'api' folder, and run 'npm start'. Then cd into the 'client' folder and run 'npm run build'. Then run 'serve -s build' in this same directory. The app should now be hosted at http://localhost:5000.
## Features
- Keyword Parsing: Set todo item priorities and due dates in real time as you type their titles. Adding 'Get groceries !high tmr' adds a high priority item called 'Get groceries' that is due tomorrow.
- Item Sorting: Settings to affect item sorting based on their due dates and priorities; completely changes how you use the app.
- Real-time MongoDB Integration: Any changes made to any todo items are updated in the database in real-time.
- Google OAuth
- RSA Encrytion of User Information
- Cookies to Maintain User Login State
- Numerous other featuers which improve user experience.
