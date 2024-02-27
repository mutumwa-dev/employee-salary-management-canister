# Employee and Salary Management Canister.

## Introduction

The Employee and Salary Management Canister is designed to simplify the process of managing employee records and their corresponding salary details within an application. By leveraging the provided functions, developers can easily integrate employee and salary management features into their projects, streamlining administrative tasks and ensuring accurate record-keeping.

## Table of Contents
- [Types](#types)
- [Functions](#functions)
- [Deployment](#deployment)

## Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/mutumwa-dev/employee-salary-management-canister
cd employee-salary-management-canister
```

Install dependencies:

```bash
npm install
```
## Types

### Employee
Represents an employee record with the following fields:
- `id`: Unique identifier for the employee.
- `name`: Name of the employee.
- `email`: Email address of the employee.
- `hireDate`: Date when the employee was hired.
- `department`: Department in which the employee works.
- `position`: Position or role of the employee.
- `createdAt`: Timestamp indicating when the employee record was created.
- `updatedAt`: Optional timestamp indicating when the employee record was last updated.

### EmployeePayload
Represents the payload required to add or update an employee, containing fields:
- `name`
- `email`
- `hireDate`
- `department`
- `position`

### Salary
Represents a salary record with the following fields:
- `id`: Unique identifier for the salary record.
- `employee_id`: Identifier of the employee associated with the salary.
- `amount`: Amount of the salary.
- `payment_date`: Date of the salary payment.
- `created_date`: Timestamp indicating when the salary record was created.
- `updated_at`: Optional timestamp indicating when the salary record was last updated.

### SalaryPayload
Represents the payload required to add or update a salary, containing fields:
- `employee_id`
- `amount`
- `payment_date`

## Functions

### Adding, Updating, and Deleting Employees

#### `addEmployee(payload: EmployeePayload): Result<Employee, string>`
Adds a new employee record.

#### `updateEmployee(id: string, payload: EmployeePayload): Result<Employee, string>`
Updates an existing employee record.

#### `deleteEmployee(id: string): Result<Employee, string>`
Deletes an employee record.

#### `getEmployees(): Result<Vec<Employee>, string>`
Retrieves all employee records.

#### `getEmployee(id: string): Result<Employee, string>`
Retrieves an employee record by ID.

### Adding, Updating, and Deleting Salaries

#### `addSalary(payload: SalaryPayload): Result<Salary, string>`
Adds a salary record for an employee.

#### `updateSalary(id: string, payload: SalaryPayload): Result<Salary, string>`
Updates a salary record for an employee.

#### `deleteSalary(id: string): Result<Salary, string>`
Deletes a salary record.

#### `getSalary(id: string): Result<Salary, string>`
Retrieves a salary record by ID.

### Retrieving Salary Information

#### `getSalariesByEmployee(employeeId: string): Result<Vec<Salary>, string>`
Retrieves all salary records for a given employee.

#### `getTotalSalaryByEmployee(employeeId: string): Result<number, string>`
Calculates the total salary paid to a given employee.

#### `getAverageSalary(): Result<number, string>`
Calculates the average salary paid to all employees.

#### `getLatestSalaryByEmployee(employeeId: string): Result<Salary, string>`
Retrieves the latest salary record for a given employee.

#### `getEarliestSalaryByEmployee(employeeId: string): Result<Salary, string>`
Retrieves the earliest salary record for a given employee.

#### `getHighestSalaryAmountByEmployee(employeeId: string): Result<number, string>`
Retrieves the highest salary amount for a given employee.

#### `getLowestSalaryAmountByEmployee(employeeId: string): Result<number, string>`
Retrieves the lowest salary amount for a given employee.

## Deployment

To deploy the canister, follow these steps:

1. Build the project:

   ```bash
   npm run build
   ```

2. Deploy the canister:

   ```bash
   dfx deploy
   ```

3. Use the generated canister identifier to interact with the deployed canister.

For additional deployment options and configurations, refer to the [Azle documentation](https://docs.azle.io/).

## Contributing

Feel free to contribute to the project by submitting issues or pull requests. Follow the standard GitHub flow for contributing.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.