import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

interface LoanApplication {
  loanId: string;
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
  activeTab: string = 'apply';
  loanTypes: string[] = ['Home Loan', 'Personal Loan', 'Car Loan', 'Education Loan', 'Business Loan'];

  allLoans: LoanApplication[] = [];

  // form fields
  loanAmount: number = 0;
  loanType: string = '';
  tenure: number = 0;
  purpose: string = '';

  currentUser: any;

  constructor(private auth: AuthService, private router: Router) {}

  // ngOnInit(): void {
  //   this.currentUser = this.auth.getCurrentUser();

  //   // format userId as U001, U002...
  //   if (this.currentUser && this.currentUser.rawId) {
  //     this.currentUser.id = 'U' + String(this.currentUser.rawId).padStart(3, '0');
  //   }

  //   const loans = localStorage.getItem('loanApplications');
  //   this.allLoans = loans ? JSON.parse(loans) : [];
  // }

  ngOnInit(): void {
    this.currentUser = this.auth.getCurrentUser();
  
    // format userId as U-001, U-002...
    if (this.currentUser && this.currentUser.rawId) {
      this.currentUser.id = 'U-' + String(this.currentUser.rawId).padStart(3, '0');
    }
  
    const loans = localStorage.getItem('loanApplications');
    this.allLoans = loans ? JSON.parse(loans) : [];
  }
  

  get loanApplications(): LoanApplication[] {
    // return loans for this user only
    if (!this.currentUser?.id) return [];
    return this.allLoans.filter(l => l.applicantId === this.currentUser.id);
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

    // Create Loan ID like L-1-001 (LoanType-UserCount)
    const loanTypeId = loanTypeMapping[this.loanType] || 0;
    const loanCount = this.allLoans.filter(l => l.applicantId === this.currentUser.id).length + 1;
    const generatedLoanId = `L-${loanTypeId}-${loanCount.toString().padStart(3, '0')}`;

    const newLoan: LoanApplication = {
      loanId: generatedLoanId,
      loanType: this.loanType,
      applicantName: this.currentUser?.name || 'Unknown',
      applicantId: this.currentUser?.id || 'U-UNKNOWN',
      loanAmount: this.loanAmount,
      tenure: this.tenure,
      purpose: this.purpose,
      status: 'Pending',
      appliedOn: new Date().toLocaleDateString(),
      decisionDate: null
    };

    this.allLoans.push(newLoan);
    this.auth.saveAllLoans(this.allLoans);

    // reset form
    this.loanAmount = 0;
    this.loanType = '';
    this.tenure = 0;
    this.purpose = '';

    alert('Loan application submitted successfully!');
    this.activeTab = 'applied';
  }

  withdrawLoan(loanId: string) {
    if (confirm('Are you sure you want to withdraw this loan application?')) {
      const idx = this.allLoans.findIndex(
        l => l.loanId === loanId && l.applicantId === this.currentUser.id
      );
      if (idx > -1) {
        this.allLoans.splice(idx, 1);
        this.auth.saveAllLoans(this.allLoans);
      }
    }
  }

  logout() {
    if (confirm('Do you really want to logout?')) {
      this.auth.logout();
      this.router.navigate(['/login']);
    }
  }
}
