import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

interface LoanApplication {
  loanId: string;
  loanType: string;
  applicantName: string;
  applicantId: string;
  loanAmount: number;
  tenure: number;
  purpose: string;
  status: 'Pending'|'Approved'|'Rejected';
  appliedOn: string;
  decisionDate: string | null;
}

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css']
})
export class ManagerDashboardComponent implements OnInit {
  activeTab: 'pending'|'approved'|'rejected' = 'pending';
  loans: LoanApplication[] = [];
  currentUser: any;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getCurrentUser();
    const stored = localStorage.getItem('loanApplications');
    this.loans = stored ? JSON.parse(stored) : [];
  }

  private save() {
    localStorage.setItem('loanApplications', JSON.stringify(this.loans));
  }

  get pendingLoans(): LoanApplication[] {
    return this.loans.filter(l => l.status === 'Pending');
  }
  get approvedLoans(): LoanApplication[] {
    return this.loans.filter(l => l.status === 'Approved');
  }
  get rejectedLoans(): LoanApplication[] {
    return this.loans.filter(l => l.status === 'Rejected');
  }

  approveLoan(loan: LoanApplication) {
    const idx = this.loans.findIndex(l => l.loanId === loan.loanId);
    if (idx > -1) {
      this.loans[idx].status = 'Approved';
      this.loans[idx].decisionDate = new Date().toLocaleDateString();
      this.save();
    }
  }

  rejectLoan(loan: LoanApplication) {
    const idx = this.loans.findIndex(l => l.loanId === loan.loanId);
    if (idx > -1) {
      this.loans[idx].status = 'Rejected';
      this.loans[idx].decisionDate = new Date().toLocaleDateString();
      this.save();
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
