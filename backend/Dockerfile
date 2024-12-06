# Use the official Node.js image from the Docker Hub
FROM node

# Set the working directory inside the container
WORKDIR /app

# Copy all files from the current folder to the /app folder inside the container
COPY . /app

# Install all dependencies using npm
RUN npm install

# Expose port 5500 so the container can communicate with the outside world
EXPOSE 5500

# Command to run the Node.js application
CMD ["node", "index.js"]
