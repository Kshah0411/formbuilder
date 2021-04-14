import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Subscription } from 'rxjs';
import { FetcherService } from '../fetcher.service';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})
export class TreeViewComponent implements OnInit {

  private _collapseAll: boolean;
  private _selectAll: boolean;

  public nodes: any[] = [];
  public collapseAttr: string = 'isCollapsed';
  public selectAttr: string = 'isSelected';
  public inDeterminateAttr: string = 'isIndeterminate';

  /**
   * Providen data for tree.
   */
  @Input('data') data: any[];

  /**
   * A flag indicating data is flatten in array and prepare is required.(Default
   * is true).
   */
  @Input('prepareData') prepareData: boolean = true;

  /**
   * Name of ID property in input data.
   */
  @Input('idAttr') idAttr: string = 'ID';

  /**
   * Name of parent property in input data.
   */
  @Input('parentAttr') parentAttr: string = 'PARENT_ID';


  /**
   * Name of children list property in input data.
   */
  @Input('childrenAttr') childrenAttr: string = 'CHILDREN';


  /**
   * Collapse or expand all parent nodes.
   */
  @Input('collapseAll')
  set collapseAll(value: boolean) {
    this._collapseAll = value;
    this._recursiveEdit(
        this.nodes, this.childrenAttr, this.collapseAttr, value);
  }

  /**
   * Select or deselect all nodes.
   */
  @Input('selectAll')
  set selectAll(value: boolean) {
    this._selectAll = value;
    this._recursiveEdit(this.nodes, this.childrenAttr, this.selectAttr, value);
    this._recursiveEdit(
        this.nodes, this.childrenAttr, this.inDeterminateAttr, false);
  }

  /**
   * When change a node model this event will be emit.
   */
  @Output() onChange = new EventEmitter<any>();

  /**
   * On click node.
   */
  @Output() onClick = new EventEmitter<any>();
  private refreshTree: Subscription; 

  constructor(private fetchService:FetcherService) {
    this.refreshTree = this.fetchService.getRefreshTree().subscribe((res) => {
      this.data = res;
      this.ngOnInit();
    })
  }

  ngOnInit() {
    // Clone input data for protect.
    const cloned = this.data.map(x => Object.assign([], x));

    // If data is flat, prepare data with recursive function.
    this.nodes = this.prepareData ? this._getPreparedData(cloned) : this.data;
  }

  onModelChange(node) {
    if (node[this.childrenAttr].length) {
      this._recursiveEdit(
          [node], this.childrenAttr, this.selectAttr, node[this.selectAttr]);
    }
    this.onChange.emit(node);
  }

  click(node: any) {
    if (node[this.childrenAttr].length) {
      node[this.collapseAttr] = !node[this.collapseAttr]
    }
    this.onClick.emit(node);
  }

  change(value: any) {
    const parent = this.nodes.filter(
        (item) => {return item.ID === value[this.parentAttr]})[0];
    if (parent) {
      let hasDifferent = false, duplicate = {},
          isIndeterminate = value[this.inDeterminateAttr] || false;

      parent[this.childrenAttr].forEach((item) => {
        duplicate[item[this.selectAttr]] =
            (duplicate[item[this.selectAttr]] || 0) + 1;
        if (item[this.inDeterminateAttr]) {
          isIndeterminate = true;
        }
      });
      if (Object.keys(duplicate).length === 1 && !isIndeterminate) {
        parent[this.inDeterminateAttr] = false;
        parent[this.selectAttr] = JSON.parse(Object.keys(duplicate)[0]);
        this.onChange.emit(parent);
      } else {
        parent[this.inDeterminateAttr] = true;
        this.onChange.emit(parent);
      }
    }
  }

  private _recursiveEdit(list, childrenAttr, attr, value) {
    if (Array.isArray(list)) {
      for (let i = 0, len = list.length; i < len; i++) {
        list[i][attr] = value;
        if (list[i][childrenAttr].length) {
          this._recursiveEdit(list[i][childrenAttr], childrenAttr, attr, value);
        }
      }
    }
  }

  private _getPreparedData(list) {
    let tree = [], lookup = {};
    for (let i = 0, len = list.length; i < len; i++) {
      lookup[list[i][this.idAttr]] = list[i];
      list[i][this.childrenAttr] = [];
      list[i][this.collapseAttr] = true;
      list[i][this.selectAttr] = false;
      list[i][this.inDeterminateAttr] = false;
    }
    for (let i = 0, len = list.length; i < len; i++) {
      if (list[i][this.parentAttr]) {
        lookup[list[i][this.parentAttr]][this.childrenAttr].push(list[i]);
      } else {
        tree.push(list[i]);
      }
    }
    return tree;
  };
}
