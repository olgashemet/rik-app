import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { filter } from 'rxjs';
import { TOKEN_KEY } from 'src/app/constants/token.consts';
import { User } from 'src/app/interfaces/user.interface';
import { UsersApiService } from 'src/app/services/api-services/users-api.service';
import { CommunicationService } from 'src/app/services/communication.service';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  displayedColumns: string[] = [
    'name',
    'email',
    'phone',
    'is_admin',
    'update_at',
    'create_at',
    'status',
    'is_ecp',
  ];
  dataSource: MatTableDataSource<any>;
  users: User[];

  constructor(
    private usersApiService: UsersApiService,
    private communicationService: CommunicationService,
    private filterService: FilterService
  ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;

  get isAllSelected() {
    return this.users?.every((elem) => elem.isSelected === true);
  }

  toggleAll() {
    return this.isAllSelected
      ? (this.users = this.users.map((elem) => ({
          ...elem,
          isSelected: false,
        })))
      : (this.users = this.users.map((elem) => ({
          ...elem,
          isSelected: true,
        })));
  }

  toggleItem(id: number) {
    this.users = this.users.map((elem) =>
      elem.id === id ? { ...elem, isSelected: !elem.isSelected } : elem
    );
  }

  ngOnInit() {
    this.communicationService.getData().subscribe((value) => {
      console.log(value);
      if (value === 'block') {
        this.users = this.users.map((elem) =>
          elem.isSelected
            ? { ...elem, status: 'blocked', isSelected: false }
            : elem
        );
        localStorage.setItem(TOKEN_KEY, JSON.stringify(this.users));
      }

      if (value === 'unblock') {
        this.users = this.users.map((elem) =>
          elem.isSelected
            ? { ...elem, status: 'ACTIVE', isSelected: false }
            : elem
        );
        localStorage.setItem(TOKEN_KEY, JSON.stringify(this.users));
      }
      if (typeof value !== 'string') {
        this.users = this.filterService.filter(this.users, value);
      }
      if (value === 'cancel') {
        this.users = JSON.parse(localStorage.getItem(TOKEN_KEY));
      }
    });

    if (localStorage.getItem(TOKEN_KEY)) {
      this.users = JSON.parse(localStorage.getItem(TOKEN_KEY));
      this.dataSource = new MatTableDataSource<any>(this.users);
      this.dataSource.paginator = this.paginator;
      return;
    }
    this.usersApiService.getUsers().subscribe((users) => {
      this.users = users;
      localStorage.setItem(TOKEN_KEY, JSON.stringify(this.users));
      this.dataSource = new MatTableDataSource<any>(this.users);
      this.dataSource.paginator = this.paginator;
    });
  }
}
