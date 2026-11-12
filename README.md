# Team API — Build, Dockerize and Ship

**A Collaborative FastAPI Project Demonstrating CI/CD with GitHub Pull Requests, GitHub Actions, Docker and Railway.**

## 1. Project Overview

Team API is a collaborative backend application developed using **Python and FastAPI** as part of the *Build, Dockerize and Ship* code-along assignment.

The project demonstrates how two developers can collaboratively build, test, containerize and deploy an API application using modern software development and DevOps practices.

It implements four API functionalities: greeting, addition, text reversal and word counting. It also includes a health-check endpoint to monitor application availability and identify the deployed application version.

The project follows a Git-based collaboration workflow using feature branches, Pull Requests, code reviews, automated testing and continuous deployment.

## 2. Key Features

| Endpoint | Method | Description |
|---|---|---|
| `/health` | GET | Checks application health and returns the current version. |
| `/greet/{name}` | GET | Returns a personalized greeting. |
| `/add?a=2&b=3` | GET | Adds two numerical values. |
| `/reverse/{text}` | GET | Reverses the supplied text. |
| `/wordcount` | POST | Counts the number of words in the supplied text. |

### API Examples

**Health Check**

`GET /health`

Response:
```json
{
  "status": "ok",
  "version": "dev"
}
```

**Greeting**

`GET /greet/Shravan`

Response:
```json
{
  "message": "Hello, Shravan!"
}
```

**Addition**

`GET /add?a=2&b=3`

Response:
```json
{
  "result": 5
}
```

**Reverse Text**

`GET /reverse/hello`

Response:
```json
{
  "result": "olleh"
}
```

**Word Count**

`POST /wordcount`

Request:
```json
{
  "text": "Hello world from Python"
}
```

Response:
```json
{
  "words": 4
}
```

## 3. Technology Stack

| Technology | Purpose |
|---|---|
| Python 3.12 | Backend programming language and runtime |
| FastAPI | REST API development framework |
| Uvicorn | ASGI server for running the application |
| Pytest | Automated testing |
| HTTPX | HTTP client used by API tests |
| Docker | Application containerization |
| Git | Version control |
| GitHub | Source code management and collaboration |
| GitHub Actions | Continuous Integration and deployment automation |
| Railway | Cloud application hosting |

## 4. Project Structure

```text
team-api/
│
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── version.txt
│   │
│   └── routers/
│       ├── __init__.py
│       ├── greet.py
│       ├── add.py
│       ├── reverse.py
│       └── wordcount.py
│
├── tests/
│   ├── test_health.py
│   ├── test_greet.py
│   ├── test_add.py
│   ├── test_reverse.py
│   └── test_wordcount.py
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── .dockerignore
├── .gitignore
├── Dockerfile
├── requirements.txt
└── requirements-dev.txt
```

## 5. Running the Application Locally

### Prerequisites

- Python 3.12
- Git
- pip

### Step 1: Clone the repository

```bash
git clone https://github.com/shravanr793-Rare/team-api.git
cd team-api
```

### Step 2: Create a virtual environment

**Windows:**
```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

**Linux/macOS:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Step 3: Install dependencies

```bash
pip install -r requirements-dev.txt
```

### Step 4: Start the application

```bash
python -m uvicorn app.main:app --reload --port 8000
```

The API will be available at:

- Application: http://localhost:8000
- Interactive Swagger documentation: http://localhost:8000/docs
- Alternative API documentation: http://localhost:8000/redoc
- Health check: http://localhost:8000/health

## 6. Automated Testing

The project uses Pytest to verify API functionality.

Run the complete test suite:

```bash
python -m pytest -v
```

Run an individual test:

```bash
python -m pytest tests/test_add.py -v
```

The test suite validates:

- Application health and version response.
- Greeting API responses for different names.
- Addition of positive, negative and decimal numbers.
- Text reversal functionality.
- Word counting, including empty input.

## 7. Docker Containerization

The application is packaged into a Docker image to ensure consistent execution across different environments.

### Build the Docker image

```bash
docker build -t team-api .
```

### Run the container

```bash
docker run --rm -p 8000:8000 team-api
```

Access the application at:

http://localhost:8000/docs

The Dockerfile uses a lightweight Python base image, installs application dependencies, copies the application code and starts Uvicorn.

The application listens on `0.0.0.0` and uses the `PORT` environment variable, with `8000` as its default.

## 8. CI/CD Pipeline

The project implements an automated CI/CD workflow using GitHub Actions and Railway.

### Continuous Integration (CI)

Whenever a Pull Request is opened against the `main` branch, GitHub Actions automatically:

1. Checks out the repository.
2. Sets up Python 3.12.
3. Installs application and development dependencies.
4. Executes the Pytest test suite.
5. Builds the Docker image to validate containerization.

The required GitHub Actions job is named `test`.

A Pull Request cannot be merged until the required checks pass and the required approval is received.

### Continuous Deployment (CD)

When changes are merged and pushed to `main`, the deployment workflow:

1. Runs automated tests.
2. Updates `app/version.txt` with the Git commit SHA.
3. Installs the Railway CLI.
4. Deploys the application to Railway.
5. Runs a smoke test against the deployed `/health` endpoint.
6. Verifies that the deployed application reports the expected commit SHA.

This provides a way to identify which source-code revision is currently running in production.

### Pipeline Overview

```text
Developer creates feature branch
              |
              v
       Implements changes
              |
              v
       Pushes to GitHub
              |
              v
       Creates Pull Request
              |
              v
       GitHub Actions CI
              |
       +------+------+
       |             |
     Pass           Fail
       |             |
       v             v
 Code Review     Fix the issue
       |             |
       v             |
     Merge <---------+
       |
       v
    Main Branch
       |
       v
   Deployment
       |
       v
  Railway Hosting
       |
       v
  Smoke Test
       |
       v
  Live Application
```

## 9. GitHub Collaboration Workflow

The project was developed collaboratively by two developers using Git and GitHub.

The workflow follows these practices:

- **Feature branches:** Each developer implements assigned functionality independently.
- **Pull Requests:** Changes are submitted for review before merging into `main`.
- **Code reviews:** The other team member reviews and approves changes.
- **Branch protection:** The `main` branch requires at least one approval and successful CI checks.
- **Merge conflict resolution:** Overlapping changes are identified and resolved while preserving the intended code from both developers.
- **Automated validation:** GitHub Actions checks the code before it can be merged.

### Example Git Commands

```bash
git switch main
git pull origin main

git switch -c feature/new-feature

git add .
git commit -m "Add new feature"

git push -u origin feature/new-feature
```

A Pull Request is then created on GitHub targeting `main`.

## 10. Repository and Deployment

**GitHub Repository:**  
https://github.com/shravanr793-Rare/team-api

**Deployment Platform:** Railway

The Railway service is deployed through GitHub Actions using a Railway project token stored securely in GitHub repository secrets.

Deployment configuration uses GitHub repository variables for the Railway service name and application URL.

Sensitive credentials are not stored in the source code.

## 11. Learning Outcomes

This project provided practical experience in:

- Building REST APIs using FastAPI.
- Organizing backend applications using modular routers.
- Writing and executing automated tests with Pytest.
- Creating Docker images and running containers.
- Managing source code with Git and GitHub.
- Collaborating through branches and Pull Requests.
- Reviewing code and resolving merge conflicts.
- Configuring GitHub branch protection rules.
- Implementing automated CI/CD pipelines with GitHub Actions.
- Deploying applications to Railway.
- Performing post-deployment smoke tests and version verification.

## 12. Future Improvements

Potential extensions include:

- Adding authentication and authorization.
- Integrating a database for persistent data storage.
- Introducing structured logging and error handling.
- Adding API input validation and rate limiting.
- Implementing monitoring and application observability.
- Expanding automated testing with integration tests.

---

**Project:** Team API — Build, Dockerize and Ship  
**Repository:** `shravanr793-Rare/team-api`  
**Development Approach:** Collaborative Development  
**Focus:** Backend Development, Docker, CI/CD and Cloud Deployment