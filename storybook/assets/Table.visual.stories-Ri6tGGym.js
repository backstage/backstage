import{j as e,r as x}from"./iframe-DagLMla0.js";import{d as y}from"./mocked-data1-Bs2nnhCk.js";import{t as w,u as S,T as i,s as f,e as v,C as a,f as h,g as j}from"./utils-CxYuRHdh.js";import"./preload-helper-PPVm8Dsz.js";import"./useStyles-wQ2Jx8X5.js";import"./clsx-B-dksMZM.js";import"./SelectionManager-B7LD5O_3.js";import"./useFocusable-BCMv3E05.js";import"./useObjectRef-Cb8HRT-z.js";import"./useEvent-BVn_L9yV.js";import"./SelectionIndicator-gELnvTUD.js";import"./context-DHKKpdNC.js";import"./usePress-lqe-0kac.js";import"./Hidden-ClFwjn4q.js";import"./useControlledState-D0awditL.js";import"./index-DwjklBa5.js";import"./Flex-BvT-iGvC.js";import"./useBg-CpNI-B1I.js";import"./Checkbox-CpfK9rzJ.js";import"./RSPContexts-BST9G051.js";import"./utils-Cc_A0DgX.js";import"./Form-BHYw4yXk.js";import"./useToggle-BFnrf7Sz.js";import"./useFormReset-DNDqb84w.js";import"./useToggleState-CMFp_CJN.js";import"./useFocusRing-BjTZ4siM.js";import"./VisuallyHidden-DOp0ud0Z.js";import"./InternalLinkProvider-Dwrnb0qS.js";import"./index-IelGYWEf.js";import"./VisuallyHidden-Dnm8_bTy.js";import"./TablePagination-DkXn5X7E.js";import"./Select-BIpZ0KrZ.js";import"./Dialog-zqP251qk.js";import"./Button-DZc9Enob.js";import"./Label-BMPPDm7Q.js";import"./useLabel-CoPPX9Ip.js";import"./useLabels-DKiqHSPy.js";import"./useButton-D9BJCUxP.js";import"./OverlayArrow-CPerN2fV.js";import"./Separator-g-SYD0Tf.js";import"./Text-BBp-mWry.js";import"./useLocalizedStringFormatter-Co06QSh7.js";import"./animation-DJoAXbJ2.js";import"./FieldError-BzXCGqX7.js";import"./ListBox-DooZ1r9a.js";import"./useListState-nmF_MNLe.js";import"./useField--RhdZAJl.js";import"./Popover.module-DeEiA6vT.js";import"./Autocomplete-D82K4uVl.js";import"./Input-CqYZRsk6.js";import"./SearchField-DzeBiUwx.js";import"./FieldLabel-CYqdn1tj.js";import"./FieldError-Dp_Jrh6_.js";import"./ButtonIcon-DGi7vVUB.js";import"./defineComponent-DL4axF5-.js";import"./Text-CIxOQPjX.js";import"./Link-M-_vjT2l.js";import"./useLink-pOrcc4BM.js";import"./Avatar-DO94Y_hF.js";import"./useHighlightSelectionDescription-uMjEUXvG.js";import"./useHasTabbableChild-BA7hoL3k.js";const Ee={title:"Backstage UI/Table/visual",...w},r={render:()=>{const o=[{id:"name",label:"Band name",isRowHeader:!0,cell:n=>e.jsx(v,{name:n.name,src:n.image,href:n.website})},{id:"genre",label:"Genre",cell:n=>e.jsx(a,{title:n.genre})},{id:"yearFormed",label:"Year formed",cell:n=>e.jsx(a,{title:n.yearFormed.toString()})},{id:"albums",label:"Albums",cell:n=>e.jsx(a,{title:n.albums.toString()})}],{tableProps:t}=S({mode:"complete",getData:()=>h,paginationOptions:{pageSize:5}});return e.jsx(i,{columnConfig:o,...t})}},s={render:()=>{const o=[{id:"name",label:"Name",isRowHeader:!0,cell:n=>e.jsx(a,{title:n.name})},{id:"type",label:"Type",cell:n=>e.jsx(a,{title:n.type})}],{tableProps:t}=S({mode:"complete",getData:()=>[],paginationOptions:{pageSize:5}});return e.jsx(i,{columnConfig:o,...t,emptyState:e.jsx("div",{children:"No data available"})})}},m={render:()=>{const o=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(a,{title:t.name})},{id:"owner",label:"Owner",cell:t=>e.jsx(a,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>e.jsx(a,{title:t.type})}];return e.jsx(i,{columnConfig:o,data:y.slice(0,10),pagination:{type:"none"}})}},c={render:()=>{const[o,t]=x.useState(new Set),{tableProps:n}=S({mode:"complete",getData:()=>j,paginationOptions:{pageSize:10}});return e.jsx(i,{...n,columnConfig:f,selection:{mode:"multiple",behavior:"toggle",selected:o,onSelectionChange:t},rowConfig:{getIsDisabled:C=>C.id===2}})}},P=[{id:1,name:"Authentication Service",description:"Handles user login and session management",type:"service",owner:"Platform Team"},{id:2,name:"A very long component name that should be truncated when it exceeds the available column width",description:"This is also a very long description that demonstrates text truncation behavior in the table cells",type:"library",owner:"Frontend Team"},{id:3,name:"API Gateway",description:"Routes and validates API requests",type:"service",owner:"Backend Team"}],p={render:()=>{const[o,t]=x.useState(new Set(["1","3"])),[n,C]=x.useState({column:"name",direction:"ascending"}),T=[{id:"name",label:"Name",isRowHeader:!0,isSortable:!0,cell:l=>e.jsx(a,{title:l.name,description:l.description})},{id:"type",label:"Type",isSortable:!0,cell:l=>e.jsx(a,{title:l.type,leadingIcon:e.jsx("span",{style:{fontSize:"16px"},children:"📦"})})},{id:"owner",label:"Owner",cell:l=>e.jsx(a,{title:l.owner,href:"#"})}];return e.jsx(i,{columnConfig:T,data:P,pagination:{type:"none"},selection:{mode:"multiple",behavior:"toggle",selected:o,onSelectionChange:t},sort:{descriptor:n,onSortChange:l=>C({column:String(l.column),direction:l.direction})}})}},d={render:()=>{const o=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(a,{title:t.name})},{id:"type",label:"Type",cell:t=>e.jsx(a,{title:t.type})}];return e.jsx(i,{columnConfig:o,data:void 0,loading:!0,pagination:{type:"none"}})}},u={render:()=>{const o=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(a,{title:t.name})},{id:"type",label:"Type",cell:t=>e.jsx(a,{title:t.type})}];return e.jsx(i,{columnConfig:o,data:void 0,error:new Error("Failed to fetch data from the server"),pagination:{type:"none"}})}},g={render:()=>{const o=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(a,{title:t.name})},{id:"owner",label:"Owner",cell:t=>e.jsx(a,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>e.jsx(a,{title:t.type})}];return e.jsx(i,{columnConfig:o,data:y.slice(0,5),isStale:!0,pagination:{type:"none"}})}},b={render:()=>{const o=[{id:"name",label:"Name",isRowHeader:!0,cell:n=>e.jsx(a,{title:n.name})},{id:"owner",label:"Owner",cell:n=>e.jsx(a,{title:n.owner.name})},{id:"type",label:"Type",cell:n=>e.jsx(a,{title:n.type})}],{tableProps:t}=S({mode:"complete",getData:()=>y,paginationOptions:{pageSize:3,pageSizeOptions:[{label:"2 per page",value:2},{label:"3 per page",value:3},{label:"5 per page",value:5},{label:"7 per page",value:7}],onPageSizeChange:n=>{console.log("Page size changed to:",n)},onNextPage:()=>{console.log("Navigated to next page")},onPreviousPage:()=>{console.log("Navigated to previous page")}}});return e.jsx(i,{columnConfig:o,...t})}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
