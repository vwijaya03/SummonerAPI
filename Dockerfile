# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the content of the local src directory to the working directory
COPY . .

# Expose the port on which the app will run
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
