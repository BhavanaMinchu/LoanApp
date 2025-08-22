import { Component, OnInit } from '@angular/core';

interface LoanApplication {
  loanId: number;
  loanType: string;
  applicantName: string;
  applicantId: string;
  loanAmount: number;
  tenure: number;
  purpose: string;
  status: string;
  appliedOn: string;
  decisionDate: string | null;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activeTab: string = 'apply'; // default tab
  loanTypes: string[] = ['Home Loan', 'Personal Loan', 'Car Loan', 'Education Loan', 'Business Loan'];

  loanApplications: LoanApplication[] = [];

  // form fields
  loanAmount: number = 0;
  loanType: string = '';
  tenure: number = 0;
  purpose: string = '';

  currentUser: any;

  constructor() {}

  ngOnInit(): void {
    // get current user info from localStorage (stored after login)
    const user = localStorage.getItem('currentUser');
    this.currentUser = user ? JSON.parse(user) : null;

    // load existing applications from localStorage
    const loans = localStorage.getItem('loanApplications');
    this.loanApplications = loans ? JSON.parse(loans) : [];
  }

  applyForLoan() {
    if (!this.loanType || !this.loanAmount || !this.tenure || !this.purpose) {
      alert('Please fill all fields');
      return;
    }
  
    // Loan type → ID mapping
    const loanTypeMapping: { [key: string]: number } = {
      'Home Loan': 1,
      'Personal Loan': 2,
      'Car Loan': 3,
      'Education Loan': 4,
      'Business Loan': 5
    };
  
    const newLoan: LoanApplication = {
      loanId: loanTypeMapping[this.loanType] || 0, // fallback 0 if unknown type
      loanType: this.loanType,
      applicantName: this.currentUser?.name || 'Unknown',
      applicantId: this.currentUser?.id || 'U-001',
      loanAmount: this.loanAmount,
      tenure: this.tenure,
      purpose: this.purpose,
      status: 'Pending',
      appliedOn: new Date().toLocaleDateString(),
      decisionDate: null
    };
  
    this.loanApplications.push(newLoan);
    localStorage.setItem('loanApplications', JSON.stringify(this.loanApplications));
  
    // reset form
    this.loanAmount = 0;
    this.loanType = '';
    this.tenure = 0;
    this.purpose = '';
  
    alert('Loan application submitted successfully!');
    this.activeTab = 'applied'; // switch to applied loans
  }

  withdrawLoan(index: number) {
    if (confirm('Are you sure you want to withdraw this loan application?')) {
      this.loanApplications.splice(index, 1);
      localStorage.setItem('loanApplications', JSON.stringify(this.loanApplications));
    }
  }
  logout() {
    if (confirm('Do you really want to logout?')) {
      localStorage.removeItem('currentUser');
      // Optionally clear loanApplications if you want
      // localStorage.removeItem('loanApplications');
      window.location.href = '/login'; // redirect to login
    }
  }
  
}
