FROM denoland/deno:alpine-1.41.0

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies (if any)
# RUN deno cache src/client/client.ts src/server/server.ts src/shared/types.ts

# Load .env if present
RUN if [ -f .env ]; then echo "Found .env"; else touch .env; fi


# Expose the port from the PORT env variable, default to 8080
ARG PORT=8080
ENV PORT=${PORT}
EXPOSE ${PORT}

# Run the Deno task 'serve', ensuring .env is loaded
CMD ["sh", "-c", "deno task serve"]
