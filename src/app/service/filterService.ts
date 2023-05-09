import { EventEmitter, Injectable } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class filterService {
    filters: FormGroup<any> | undefined;
    setFilter(filters: FormGroup<any>) {
        this.onGetData.emit(this.filters = filters)
    }
    onGetData: EventEmitter<any> = new EventEmitter();

}