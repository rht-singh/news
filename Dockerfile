# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory to /app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose port 5678 for the application
EXPOSE 5678

# Set the command to start the Node.js application
CMD ["npm", "start"]