# Build context is the repo root (the API packages ../db/migrations).
# docker build -f api/Dockerfile .

FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /src
COPY api/pom.xml api/pom.xml
RUN mvn -q -f api/pom.xml dependency:go-offline
COPY api/src api/src
COPY db db
RUN mvn -q -f api/pom.xml package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /src/api/target/capsteal-api-*.jar app.jar
# Fits Render's free 512 MB instance; trims startup a bit for cold starts.
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75 -XX:TieredStopAtLevel=1"
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
