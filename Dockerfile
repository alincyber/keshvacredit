# Use Node.js 22 as the base image
FROM node:22

# Create and use /app as the working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Tell Docker the app listens on port 5000
EXPOSE 5000

# Start the application
CMD ["npm", "start"]