
# CronWizard

CronWizard is a web application that allows users to generate cron expressions and calculate the next scheduled dates for these expressions.

To try out this application, visit [CronWizard](https://cronwizard.com).

## Getting Started


### Prerequisites

- Node.js (v14 or higher)
- Angular CLI (v12 or higher)

### Installation

1. Clone this repository:
    ```bash
    git clone https://github.com/your-repo/cronwizard-frontend.git
    ```
2. Navigate to the project directory:
    ```bash
    cd cronwizard
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
    
### Running the Development Server

```bash 
ng serve
```

Open your browser and navigate to `http://localhost:4200`. The app will automatically reload if you change any of the source files.

## Usage

### Generating Cron Expressions

1. Select a time interval from the tabs at the top (Minutes, Hourly, Daily, Weekly, Monthly, Yearly).

2. Fill in the required fields according to your selection.

3. Click the "Generate" button. The generated cron expression will be displayed below.

4. Click the "Copy" button to copy the cron expression.

### Listing Next Scheduled Dates

1. Enter your generated or manually entered cron expression in the input field.

2. Click the "Calculate next dates" button. The next scheduled dates will be listed below.

## About the Project

This project provides a user-friendly interface for easily creating and testing cron expressions. The frontend part of the application is developed using Angular and styled with Bootstrap.