import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.css'
})
export class CustomTableComponent  {


  @Input() pageTitle: string;
  @Input() addButtonLink: string;
  @Input() addButtonLabel: string;
  @Input() addButtonPermission: string;
  @Input() columns: any[];

  @Input() viewButtonLink: string;
  @Input() viewButtonPermission: string;

  @Input() editButtonLink: string;
  @Input() editButtonPermission: string;
  @Input() deleteButtonPermission: string;

  @Input() ArrayData: any[] = [];
  searchTerm : string = '';
  pageSize : number = 10;

  @Input() checkedStatus: any;
  @Input() uncheckedStatus: any;

  @Output() pageChanged = new EventEmitter();
  @Output() onsearch = new EventEmitter();
  @Output() toggleDropdown = new EventEmitter();
  @Output() applyFilter = new EventEmitter();
  @Output() printData = new EventEmitter();
  @Output() downloadData = new EventEmitter();
  @Output() onChangeEvent = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  
  @ViewChild('removeItemModal', { static: false }) removeItemModal?: ModalDirective;
  idToDelete : any;
  isDropdownOpen: boolean = false;
  filteredArray : any[] = [];
  originalArray : any[] = [];


  filters = [
    { value: 'All', label: 'All' },
    { value: 'Name', label: 'Name' },
    { value: 'City', label: 'City' },
    { value: 'Status', label: 'Status' },
    { value: 'Phone', label: 'Phone' }
  ];
  constructor() {
   }

  ngOnInit(){
    //this.originalArray = this.ArrayData;
    this.filteredArray = this.ArrayData;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.ArrayData) {
      this.filteredArray = changes.ArrayData.currentValue; // Reset filtered data when ArrayData changes
     // this.searchEvent(); // Reapply search filter if there's a term
    }
  }

  getProperty(data: any, propertyPath: string): any {
    
    return propertyPath.split('.').reduce((acc, key) => acc && acc[key], data);
    
  }
  
  pageChangedEvent(event: any) {
    this.pageChanged.emit(event);
  }

  searchEvent() {
    if (this.searchTerm) {
      this.filteredArray = this.ArrayData.filter(item => 
        this.columns.some(column => 
          this.getProperty(item, column.property)?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      );
    } else {
      this.filteredArray = this.ArrayData; 
    }
  }
    
  // searchEvent(){
  //   this.onsearch.emit(this.searchTerm)
  // }

  toggleDropdownEvent() {
    this.isDropdownOpen = !this.isDropdownOpen ;
  }

  applyFilterEvent(filter: string) {
    this.applyFilter.emit(filter);
  }

  printDataEvent() {
    this.printData.emit();
  }

  // downloadDataEvent() {
  //   this.downloadData.emit();
  // }

  onChangeEventEmit(data: any, event: any) {
    console.log(data);
    console.log(event);
    this.onChangeEvent.emit({ data, event } );
  }


  //Delete Data
  deleteData(id: any) {
    this.idToDelete = id;
    this.removeItemModal?.show();
  }

  onConfirm() {
    this.removeItemModal?.hide();
    this.onDelete.emit(this.idToDelete);
  }

  downloadDataEvent() {
    const pdf = new jsPDF();

    pdf.setFontSize(18); // Set font size for title
    pdf.text('Hello World', 14, 22);

    // Capture the HTML content of the table
    const tableElement = document.getElementById('userList-table'); // Use the ID of your table
    if (tableElement) {
      html2canvas(tableElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 190; // Adjust width as needed
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const heightLeft = imgHeight;
        
        let position = 0;
        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        pdf.save('download.pdf'); // Save the PDF
      });
    }
  }

}