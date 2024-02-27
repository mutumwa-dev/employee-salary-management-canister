import { $query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt } from 'azle';
import { v4 as uuidv4 } from 'uuid';

// Define types for Employee and EmployeePayload
type Employee = Record<{
    id: string;
    name: string;
    email: string;
    hireDate: string;
    department: string;
    position: string;
    createdAt: nat64;
    updatedAt: Opt<nat64>;
}>;

type EmployeePayload = Record<{
    name: string;
    email: string;
    hireDate: string;
    department: string;
    position: string;
}>;

// Define types for Salary and SalaryPayload
type Salary = Record<{
    id: string;
    employee_id: string;
    amount: number;
    payment_date: string;
    created_date: nat64;
    updated_at: Opt<nat64>;
}>;

type SalaryPayload = Record<{
    employee_id: string;
    amount: number;
    payment_date: string;
}>;

// Create a map to store employee records
const employeeStorage = new StableBTreeMap<string, Employee>(0, 44, 1024);
const salaryStorage = new StableBTreeMap<string, Salary>(1, 44, 1024);

// Function to add a new employee
$update;
export function addEmployee(payload: EmployeePayload): Result<Employee, string> {
    // Input validation
    if (!payload || !payload.name || !payload.email || !payload.hireDate || !payload.department || !payload.position) {
        return Result.Err("Invalid employee payload. All fields are required.");
    }

    const employee: Employee = { id: uuidv4(), createdAt: ic.time(), updatedAt: Opt.None, ...payload };
    employeeStorage.insert(employee.id, employee);
    return Result.Ok(employee);
}

// Function to update an existing employee
$update;
export function updateEmployee(id: string, payload: EmployeePayload): Result<Employee, string> {
    // Input validation
    if (!id) {
        return Result.Err("Invalid employee ID.");
    }
    if (!payload || Object.keys(payload).length === 0) {
        return Result.Err("Invalid payload. At least one field must be provided for update.");
    }

    return match(employeeStorage.get(id), {
        Some: (employee) => {
            const updatedEmployee: Employee = { ...employee, ...payload, updatedAt: Opt.Some(ic.time()) };
            employeeStorage.insert(employee.id, updatedEmployee);
            return Result.Ok<Employee, string>(updatedEmployee);
        },
        None: () => Result.Err<Employee, string>(`Couldn't update an employee with id=${id}. Employee not found`)
    });
}

// Function to delete an employee
$update;
export function deleteEmployee(id: string): Result<Employee, string> {
    return match(employeeStorage.remove(id), {
        Some: (deletedEmployee) => Result.Ok<Employee, string>(deletedEmployee),
        None: () => Result.Err<Employee, string>(`Couldn't delete an employee with id=${id}. Employee not found.`)
    });
}

// Function to get all employees
$query;
export function getEmployees(): Result<Vec<Employee>, string> {
    return Result.Ok(employeeStorage.values());
}

// Function to get an employee by ID
$query;
export function getEmployee(id: string): Result<Employee, string> {
    return match(employeeStorage.get(id), {
        Some: (employee) => Result.Ok<Employee, string>(employee),
        None: () => Result.Err<Employee, string>(`Employee with id=${id} not found`)
    });
}

// Function to add salary for an employee
$update;
export function addSalary(payload: SalaryPayload): Result<Salary, string> {
    // Input validation
    if (!payload || !payload.employee_id || !payload.amount || !payload.payment_date) {
        return Result.Err("Invalid salary payload. All fields are required.");
    }

    const salary: Salary = { id: uuidv4(), created_date: ic.time(), updated_at: Opt.None, ...payload };
    salaryStorage.insert(salary.id, salary);
    return Result.Ok(salary);
}

// Function to update salary for an employee
$update;
export function updateSalary(id: string, payload: SalaryPayload): Result<Salary, string> {
    // Input validation
    if (!id) {
        return Result.Err("Invalid salary ID.");
    }
    if (!payload || Object.keys(payload).length === 0) {
        return Result.Err("Invalid payload. At least one field must be provided for update.");
    }

    return match(salaryStorage.get(id), {
        Some: (salary) => {
            const updatedSalary: Salary = {...salary, ...payload, updated_at: Opt.Some(ic.time())};
            salaryStorage.insert(salary.id, updatedSalary);
            return Result.Ok<Salary, string>(updatedSalary);
        },
        None: () => Result.Err<Salary, string>(`Couldn't update salary with id=${id}. Salary not found`)
    });
}

// Function to delete salary for an employee
$update;
export function deleteSalary(id: string): Result<Salary, string> {
    return match(salaryStorage.remove(id), {
        Some: (deletedSalary) => Result.Ok<Salary, string>(deletedSalary),
        None: () => Result.Err<Salary, string>(`Couldn't delete salary with id=${id}. Salary not found.`)
    });
}

// Function to get salary details for an employee
$query;
export function getSalary(id: string): Result<Salary, string> {
    return match(salaryStorage.get(id), {
        Some: (salary) => Result.Ok<Salary, string>(salary),
        None: () => Result.Err<Salary, string>(`Salary with id=${id} not found`)
    });
}

// Function to get all salaries for an employee
$query;
export function getSalariesByEmployee(employeeId: string): Result<Vec<Salary>, string> {
    const salariesByEmployee = salaryStorage
        .values()
        .filter(salary => salary.employee_id === employeeId);
    return Result.Ok(salariesByEmployee);
}

// Function to get total salary paid to an employee
$query;
export function getTotalSalaryByEmployee(employeeId: string): Result<number, string> {
    const salariesByEmployee = salaryStorage
        .values()
        .filter(salary => salary.employee_id === employeeId);
    const totalSalary = salariesByEmployee.reduce((acc, curr) => acc + curr.amount, 0);
    return Result.Ok(totalSalary);
}

// Function to get average salary paid to employees
$query;
export function getAverageSalary(): Result<number, string> {
    const allSalaries = salaryStorage.values();
    if (allSalaries.length === 0) {
        return Result.Err("No salary records found.");
    }
    const totalSalary = allSalaries.reduce((acc, curr) => acc + curr.amount, 0);
    const averageSalary = totalSalary / allSalaries.length;
    return Result.Ok(averageSalary);
}

// Function to get the latest salary for an employee
$query;
export function getLatestSalaryByEmployee(employeeId: string): Result<Salary, string> {
    const salariesByEmployee = salaryStorage
        .values()
        .filter(salary => salary.employee_id === employeeId);
    if (salariesByEmployee.length === 0) {
        return Result.Err(`No salary records found for employee with ID ${employeeId}`);
    }
    const latestSalary = salariesByEmployee.reduce((latest, current) => latest.payment_date > current.payment_date ? latest : current);
    return Result.Ok(latestSalary);
}

// Function to get the earliest salary for an employee
$query;
export function getEarliestSalaryByEmployee(employeeId: string): Result<Salary, string> {
    const salariesByEmployee = salaryStorage
        .values()
        .filter(salary => salary.employee_id === employeeId);
    if (salariesByEmployee.length === 0) {
        return Result.Err(`No salary records found for employee with ID ${employeeId}`);
    }
    const earliestSalary = salariesByEmployee.reduce((earliest, current) => earliest.payment_date < current.payment_date ? earliest : current);
    return Result.Ok(earliestSalary);
}

// Function to get the highest salary amount for an employee
$query;
export function getHighestSalaryAmountByEmployee(employeeId: string): Result<number, string> {
    const salariesByEmployee = salaryStorage
        .values()
        .filter(salary => salary.employee_id === employeeId);
    if (salariesByEmployee.length === 0) {
        return Result.Err(`No salary records found for employee with ID ${employeeId}`);
    }
    const highestSalaryAmount = Math.max(...salariesByEmployee.map(salary => salary.amount));
    return Result.Ok(highestSalaryAmount);
}

// Function to get the lowest salary amount for an employee
$query;
export function getLowestSalaryAmountByEmployee(employeeId: string): Result<number, string> {
    const salariesByEmployee = salaryStorage
        .values()
        .filter(salary => salary.employee_id === employeeId);
    if (salariesByEmployee.length === 0) {
        return Result.Err(`No salary records found for employee with ID ${employeeId}`);
    }
    const lowestSalaryAmount = Math.min(...salariesByEmployee.map(salary => salary.amount));
    return Result.Ok(lowestSalaryAmount);
}

// A workaround to make the uuid package work with Azle
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    }
};