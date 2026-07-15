FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY Dashboard/package*.json ./Dashboard/

# Install dependencies
RUN npm install --omit=dev && \
    cd Dashboard && npm install --omit=dev && npm run build && cd ..

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => { if (r.statusCode !== 200) throw Error(r.statusCode) })"

# Start server
CMD ["npm", "start"]
