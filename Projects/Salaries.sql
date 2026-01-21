CREATE TABLE Salaries (
    Salary_ID INT PRIMARY KEY,
    Emp_ID INT,
    Salary DECIMAL(10,2),
    Effective_Date DATE,
    FOREIGN KEY (Emp_ID) REFERENCES Employees(Emp_ID)
);
