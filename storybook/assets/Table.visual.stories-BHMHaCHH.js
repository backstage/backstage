import{j as e,r as x}from"./iframe-CNJ8DcrC.js";import{d as y}from"./mocked-data1-Bs2nnhCk.js";import{t as w,u as S,T as i,s as f,e as v,C as a,f as h,g as j}from"./utils-DtCWEBa7.js";import"./preload-helper-PPVm8Dsz.js";import"./useStyles-Ctwz8Mdy.js";import"./clsx-B-dksMZM.js";import"./SelectionManager-3zHy28g_.js";import"./useFocusable-BRngNkQp.js";import"./useObjectRef-D4VDTdyV.js";import"./useEvent-BTL2BJnf.js";import"./SelectionIndicator-B--I21Py.js";import"./context-BaC93-pS.js";import"./usePress-D634pjUp.js";import"./Hidden-ubLVAw13.js";import"./useControlledState-CqjGTBew.js";import"./index-Bscon1G1.js";import"./Flex-gznhGsL1.js";import"./useSurface-psgZOnSF.js";import"./Checkbox-R0Yh849O.js";import"./RSPContexts-6RDiUzJW.js";import"./utils-DqzyTKhZ.js";import"./Form-y2WNsJvz.js";import"./useToggle-BlIWHmkr.js";import"./useFormReset-CElrKw0c.js";import"./useToggleState-HSWakYXD.js";import"./useFocusRing-_R5-3ahM.js";import"./VisuallyHidden-CxpG0c7s.js";import"./InternalLinkProvider-BkNugvJ-.js";import"./index-DkthXm2e.js";import"./VisuallyHidden-CvyW_05l.js";import"./TablePagination-CY9YxYcz.js";import"./Select-Crken4Xc.js";import"./Dialog-DhxMaNxl.js";import"./Button-BeiFbECh.js";import"./Label-CJ-vxwqW.js";import"./useLabel-BZdBZ-M8.js";import"./useLabels-CtOTMY5s.js";import"./useButton-CBYUCijk.js";import"./OverlayArrow-DbM2lv9Q.js";import"./Separator-Q4nsgSR4.js";import"./Text-Cn9vnNz6.js";import"./useLocalizedStringFormatter-BNUwPyU_.js";import"./animation-CFsi5qUo.js";import"./FieldError-ed3rL4L6.js";import"./ListBox-BhddLFLW.js";import"./useListState-DHoCQKk8.js";import"./useField-DsFdjrH-.js";import"./Popover.module-C8s8CqIp.js";import"./Autocomplete-DetZC639.js";import"./Input-Bx1Q9ja8.js";import"./SearchField-zRsAF-St.js";import"./FieldLabel-p3nFc0gc.js";import"./FieldError-Cd_1JWen.js";import"./ButtonIcon-DGJXN4it.js";import"./defineComponent-B_6e1-Ln.js";import"./Text-DZ9ojE3W.js";import"./Link-jLmukzYf.js";import"./useLink-C_kUAI-j.js";import"./Avatar-DSRnA0Qd.js";import"./useHighlightSelectionDescription-D5xzQKoY.js";import"./useHasTabbableChild-CoDRaCSe.js";const Ee={title:"Backstage UI/Table/visual",...w},r={render:()=>{const o=[{id:"name",label:"Band name",isRowHeader:!0,cell:n=>e.jsx(v,{name:n.name,src:n.image,href:n.website})},{id:"genre",label:"Genre",cell:n=>e.jsx(a,{title:n.genre})},{id:"yearFormed",label:"Year formed",cell:n=>e.jsx(a,{title:n.yearFormed.toString()})},{id:"albums",label:"Albums",cell:n=>e.jsx(a,{title:n.albums.toString()})}],{tableProps:t}=S({mode:"complete",getData:()=>h,paginationOptions:{pageSize:5}});return e.jsx(i,{columnConfig:o,...t})}},s={render:()=>{const o=[{id:"name",label:"Name",isRowHeader:!0,cell:n=>e.jsx(a,{title:n.name})},{id:"type",label:"Type",cell:n=>e.jsx(a,{title:n.type})}],{tableProps:t}=S({mode:"complete",getData:()=>[],paginationOptions:{pageSize:5}});return e.jsx(i,{columnConfig:o,...t,emptyState:e.jsx("div",{children:"No data available"})})}},m={render:()=>{const o=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(a,{title:t.name})},{id:"owner",label:"Owner",cell:t=>e.jsx(a,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>e.jsx(a,{title:t.type})}];return e.jsx(i,{columnConfig:o,data:y.slice(0,10),pagination:{type:"none"}})}},c={render:()=>{const[o,t]=x.useState(new Set),{tableProps:n}=S({mode:"complete",getData:()=>j,paginationOptions:{pageSize:10}});return e.jsx(i,{...n,columnConfig:f,selection:{mode:"multiple",behavior:"toggle",selected:o,onSelectionChange:t},rowConfig:{getIsDisabled:C=>C.id===2}})}},P=[{id:1,name:"Authentication Service",description:"Handles user login and session management",type:"service",owner:"Platform Team"},{id:2,name:"A very long component name that should be truncated when it exceeds the available column width",description:"This is also a very long description that demonstrates text truncation behavior in the table cells",type:"library",owner:"Frontend Team"},{id:3,name:"API Gateway",description:"Routes and validates API requests",type:"service",owner:"Backend Team"}],p={render:()=>{const[o,t]=x.useState(new Set(["1","3"])),[n,C]=x.useState({column:"name",direction:"ascending"}),T=[{id:"name",label:"Name",isRowHeader:!0,isSortable:!0,cell:l=>e.jsx(a,{title:l.name,description:l.description})},{id:"type",label:"Type",isSortable:!0,cell:l=>e.jsx(a,{title:l.type,leadingIcon:e.jsx("span",{style:{fontSize:"16px"},children:"📦"})})},{id:"owner",label:"Owner",cell:l=>e.jsx(a,{title:l.owner,href:"#"})}];return e.jsx(i,{columnConfig:T,data:P,pagination:{type:"none"},selection:{mode:"multiple",behavior:"toggle",selected:o,onSelectionChange:t},sort:{descriptor:n,onSortChange:l=>C({column:String(l.column),direction:l.direction})}})}},d={render:()=>{const o=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(a,{title:t.name})},{id:"type",label:"Type",cell:t=>e.jsx(a,{title:t.type})}];return e.jsx(i,{columnConfig:o,data:void 0,loading:!0,pagination:{type:"none"}})}},u={render:()=>{const o=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(a,{title:t.name})},{id:"type",label:"Type",cell:t=>e.jsx(a,{title:t.type})}];return e.jsx(i,{columnConfig:o,data:void 0,error:new Error("Failed to fetch data from the server"),pagination:{type:"none"}})}},g={render:()=>{const o=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(a,{title:t.name})},{id:"owner",label:"Owner",cell:t=>e.jsx(a,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>e.jsx(a,{title:t.type})}];return e.jsx(i,{columnConfig:o,data:y.slice(0,5),isStale:!0,pagination:{type:"none"}})}},b={render:()=>{const o=[{id:"name",label:"Name",isRowHeader:!0,cell:n=>e.jsx(a,{title:n.name})},{id:"owner",label:"Owner",cell:n=>e.jsx(a,{title:n.owner.name})},{id:"type",label:"Type",cell:n=>e.jsx(a,{title:n.type})}],{tableProps:t}=S({mode:"complete",getData:()=>y,paginationOptions:{pageSize:3,pageSizeOptions:[{label:"2 per page",value:2},{label:"3 per page",value:3},{label:"5 per page",value:5},{label:"7 per page",value:7}],onPageSizeChange:n=>{console.log("Page size changed to:",n)},onNextPage:()=>{console.log("Navigated to next page")},onPreviousPage:()=>{console.log("Navigated to previous page")}}});return e.jsx(i,{columnConfig:o,...t})}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => {
    const columns: ColumnConfig<Data4Item>[] = [{
      id: 'name',
      label: 'Band name',
      isRowHeader: true,
      cell: item => <CellProfile name={item.name} src={item.image} href={item.website} />
    }, {
      id: 'genre',
      label: 'Genre',
      cell: item => <CellText title={item.genre} />
    }, {
      id: 'yearFormed',
      label: 'Year formed',
      cell: item => <CellText title={item.yearFormed.toString()} />
    }, {
      id: 'albums',
      label: 'Albums',
      cell: item => <CellText title={item.albums.toString()} />
    }];
    const {
      tableProps
    } = useTable({
      mode: 'complete',
      getData: () => data4,
      paginationOptions: {
        pageSize: 5
      }
    });
    return <Table columnConfig={columns} {...tableProps} />;
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    const columns: ColumnConfig<Data1Item>[] = [{
      id: 'name',
      label: 'Name',
      isRowHeader: true,
      cell: item => <CellText title={item.name} />
    }, {
      id: 'type',
      label: 'Type',
      cell: item => <CellText title={item.type} />
    }];
    const {
      tableProps
    } = useTable({
      mode: 'complete',
      getData: () => [],
      paginationOptions: {
        pageSize: 5
      }
    });
    return <Table columnConfig={columns} {...tableProps} emptyState={<div>No data available</div>} />;
  }
}`,...s.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const columns: ColumnConfig<Data1Item>[] = [{
      id: 'name',
      label: 'Name',
      isRowHeader: true,
      cell: item => <CellText title={item.name} />
    }, {
      id: 'owner',
      label: 'Owner',
      cell: item => <CellText title={item.owner.name} />
    }, {
      id: 'type',
      label: 'Type',
      cell: item => <CellText title={item.type} />
    }];
    return <Table columnConfig={columns} data={data1.slice(0, 10)} pagination={{
      type: 'none'
    }} />;
  }
}`,...m.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = useState<Set<string | number> | 'all'>(new Set());
    const {
      tableProps
    } = useTable({
      mode: 'complete',
      getData: () => selectionData,
      paginationOptions: {
        pageSize: 10
      }
    });
    return <Table {...tableProps} columnConfig={selectionColumns} selection={{
      mode: 'multiple',
      behavior: 'toggle',
      selected,
      onSelectionChange: setSelected
    }} rowConfig={{
      getIsDisabled: item => item.id === 2
    }} />;
  }
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = useState<Set<string | number> | 'all'>(new Set(['1', '3']));
    const [sortDescriptor, setSortDescriptor] = useState<{
      column: string;
      direction: 'ascending' | 'descending';
    }>({
      column: 'name',
      direction: 'ascending'
    });
    const columns: ColumnConfig<CellTextVariantsItem>[] = [{
      id: 'name',
      label: 'Name',
      isRowHeader: true,
      isSortable: true,
      cell: item => <CellText title={item.name} description={item.description} />
    }, {
      id: 'type',
      label: 'Type',
      isSortable: true,
      cell: item => <CellText title={item.type} leadingIcon={<span style={{
        fontSize: '16px'
      }}>📦</span>} />
    }, {
      id: 'owner',
      label: 'Owner',
      cell: item => <CellText title={item.owner} href="#" />
    }];
    return <Table columnConfig={columns} data={cellTextVariantsData} pagination={{
      type: 'none'
    }} selection={{
      mode: 'multiple',
      behavior: 'toggle',
      selected,
      onSelectionChange: setSelected
    }} sort={{
      descriptor: sortDescriptor,
      onSortChange: descriptor => setSortDescriptor({
        column: String(descriptor.column),
        direction: descriptor.direction
      })
    }} />;
  }
}`,...p.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const columns: ColumnConfig<Data1Item>[] = [{
      id: 'name',
      label: 'Name',
      isRowHeader: true,
      cell: item => <CellText title={item.name} />
    }, {
      id: 'type',
      label: 'Type',
      cell: item => <CellText title={item.type} />
    }];
    return <Table columnConfig={columns} data={undefined} loading={true} pagination={{
      type: 'none'
    }} />;
  }
}`,...d.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => {
    const columns: ColumnConfig<Data1Item>[] = [{
      id: 'name',
      label: 'Name',
      isRowHeader: true,
      cell: item => <CellText title={item.name} />
    }, {
      id: 'type',
      label: 'Type',
      cell: item => <CellText title={item.type} />
    }];
    return <Table columnConfig={columns} data={undefined} error={new Error('Failed to fetch data from the server')} pagination={{
      type: 'none'
    }} />;
  }
}`,...u.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const columns: ColumnConfig<Data1Item>[] = [{
      id: 'name',
      label: 'Name',
      isRowHeader: true,
      cell: item => <CellText title={item.name} />
    }, {
      id: 'owner',
      label: 'Owner',
      cell: item => <CellText title={item.owner.name} />
    }, {
      id: 'type',
      label: 'Type',
      cell: item => <CellText title={item.type} />
    }];
    return <Table columnConfig={columns} data={data1.slice(0, 5)} isStale={true} pagination={{
      type: 'none'
    }} />;
  }
}`,...g.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => {
    const columns: ColumnConfig<Data1Item>[] = [{
      id: 'name',
      label: 'Name',
      isRowHeader: true,
      cell: item => <CellText title={item.name} />
    }, {
      id: 'owner',
      label: 'Owner',
      cell: item => <CellText title={item.owner.name} />
    }, {
      id: 'type',
      label: 'Type',
      cell: item => <CellText title={item.type} />
    }];
    const {
      tableProps
    } = useTable({
      mode: 'complete',
      getData: () => data1,
      paginationOptions: {
        pageSize: 3,
        pageSizeOptions: [{
          label: '2 per page',
          value: 2
        }, {
          label: '3 per page',
          value: 3
        }, {
          label: '5 per page',
          value: 5
        }, {
          label: '7 per page',
          value: 7
        }],
        onPageSizeChange: size => {
          console.log('Page size changed to:', size);
        },
        onNextPage: () => {
          console.log('Navigated to next page');
        },
        onPreviousPage: () => {
          console.log('Navigated to previous page');
        }
      }
    });
    return <Table columnConfig={columns} {...tableProps} />;
  }
}`,...b.parameters?.docs?.source}}};const Fe=["ProfileCells","EmptyState","NoPagination","SelectionWithDisabledRows","CellTextVariants","LoadingState","ErrorState","StaleState","CustomPageSizeOptions"];export{p as CellTextVariants,b as CustomPageSizeOptions,s as EmptyState,u as ErrorState,d as LoadingState,m as NoPagination,r as ProfileCells,c as SelectionWithDisabledRows,g as StaleState,Fe as __namedExportsOrder,Ee as default};
