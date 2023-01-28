# Use the official Node.js image as the base image
FROM node:lts-alpine

# Use the official PostgreSQL image as the database
FROM postgres:14

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

RUN apt-get update && apt-get install -y npm

# Install dependencies
RUN npm ci --only=production

RUN npm i -g @adonisjs/cli --unsafe-perm

# Copy the rest of the application code
COPY . .

# Expose the port that the AdonisJS application will run on
EXPOSE 8000

# Start the AdonisJS application and connect to the PostgreSQL database
CMD ["adonis", "serve", "--dev", "--pg"]
