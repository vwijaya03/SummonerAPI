# Use the official Node.js image
FROM node:20.9.0

# Install dependencies for debugging (optional)
RUN apt-get update && \
    apt-get install -y redis-tools

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Define the default command to run your application
CMD ["npm", "run", "start"]
