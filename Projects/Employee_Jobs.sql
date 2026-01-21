CREATE TABLE Employee_Jobs (
    Emp_ID INT,
    Job_ID INT,
    Start_Date DATE,
    PRIMARY KEY (Emp_ID, Job_ID),
    FOREIGN KEY (Emp_ID) REFERENCES Employees(Emp_ID),
    FOREIGN KEY (Job_ID) REFERENCES Job_Titles(Job_ID)
);
