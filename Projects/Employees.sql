CREATE TABLE Employees (
    Emp_ID INT PRIMARY KEY,
    First_Name VARCHAR(100),
    Last_Name VARCHAR(100),
    Email VARCHAR(150),
    Hire_Date DATE,
    Dept_ID INT,
    FOREIGN KEY (Dept_ID) REFERENCES Departments(Dept_ID)
);
