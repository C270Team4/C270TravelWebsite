# Use the official Node.js image from the Docker registry as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker's caching mechanism for dependencies
COPY package*.json ./

# Install the dependencies from package.json
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 3000 to the outside world (ensure your app listens on this port)
EXPOSE 3000

# Start the application (assuming your app starts with npm start)
CMD ["npm", "start"]
