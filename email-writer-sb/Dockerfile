# Use Java 17 (Linux)
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy Maven wrapper (Linux only)
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Give execute permission to mvnw
RUN chmod +x mvnw

# Download dependencies (cache layer)
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src src

# Build application
RUN ./mvnw clean package -DskipTests

# Expose backend port
EXPOSE 8080

# Run Spring Boot jar
CMD ["java", "-jar", "target/email-writer-sb-0.0.1-SNAPSHOT.jar"]
