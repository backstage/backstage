import{j as e,r as x}from"./iframe-CMBqt-A6.js";import{d as y}from"./mocked-data1-Bs2nnhCk.js";import{t as w,s as f,d as v,a as h}from"./utils-lcdcxlsJ.js";import{u as S,T as r,e as j,C as a}from"./useTable-BFKC41Ay.js";import"./preload-helper-PPVm8Dsz.js";import"./index-9jpoN6B7.js";import"./SelectionManager-fq9uxR9W.js";import"./useFocusable-CV7yW7DE.js";import"./useObjectRef-CGSD8NQp.js";import"./useEvent-LJhgLKkp.js";import"./SelectionIndicator-CEoz0uol.js";import"./context-CjP_Id4P.js";import"./usePress-JKpwaxPV.js";import"./Hidden-Cum0__DP.js";import"./useControlledState-Bi1RpUJn.js";import"./index-CeouwpqU.js";import"./Flex-BCi6YlJM.js";import"./Checkbox-l6MvCmtA.js";import"./RSPContexts-C7S471nv.js";import"./utils-BsuA5P8E.js";import"./Form-taROB1iO.js";import"./useToggle-BM14oJ4D.js";import"./useFormReset-Cl19A9mk.js";import"./useToggleState-CmalZCKT.js";import"./useFocusRing-Dg5qN7f3.js";import"./VisuallyHidden-DY51tSOj.js";import"./InternalLinkProvider-B0CHN5k4.js";import"./VisuallyHidden-BdyYTFxq.js";import"./TablePagination-BFzm1dPY.js";import"./Select-2jKK0tOa.js";import"./Dialog-7MFZ9Kpf.js";import"./Button-kyykA9SO.js";import"./Label-Dl30HET7.js";import"./useLabel-C3Rt0zjS.js";import"./useLabels-D3b8Bz8f.js";import"./useButton-ovS_9Dgw.js";import"./OverlayArrow-B0Yd5NZM.js";import"./Separator-JzxeNSBt.js";import"./Text-Df1pNLi3.js";import"./useLocalizedStringFormatter-7soz3w-c.js";import"./animation-Bx-ue73j.js";import"./FieldError-2C2b1JKv.js";import"./ListBox-D1zvyMnq.js";import"./useListState-B7Wd3gnW.js";import"./useField-BYQS2JaF.js";import"./definition-AJcu9tK1.js";import"./Autocomplete-BS4uXj3t.js";import"./Input-BlSVicBV.js";import"./SearchField-sLnickfb.js";import"./FieldError-Ba9aJeWn.js";import"./FieldLabel-B6qM2eQZ.js";import"./ButtonIcon-C6-JmKo5.js";import"./Text-BgeSLHUM.js";import"./Link-DZn78RT-.js";import"./useLink-BS3j-5Ug.js";import"./useHighlightSelectionDescription-CO3PqAPU.js";import"./useHasTabbableChild-BLPRaqsf.js";import"./Avatar-C1V4bieI.js";const Re={title:"Backstage UI/Table/visual",...w},i={render:()=>{const o=[{id:"name",label:"Band name",isRowHeader:!0,cell:n=>e.jsx(j,{name:n.name,src:n.image,href:n.website})},{id:"genre",label:"Genre",cell:n=>e.jsx(a,{title:n.genre})},{id:"yearFormed",label:"Year formed",cell:n=>e.jsx(a,{title:n.yearFormed.toString()})},{id:"albums",label:"Albums",cell:n=>e.jsx(a,{title:n.albums.toString()})}],{tableProps:t}=S({mode:"complete",getData:()=>v,paginationOptions:{pageSize:5}});return e.jsx(r,{columnConfig:o,...t})}},s={render:()=>{const o=[{id:"name",label:"Name",isRowHeader:!0,cell:n=>e.jsx(a,{title:n.name})},{id:"type",label:"Type",cell:n=>e.jsx(a,{title:n.type})}],{tableProps:t}=S({mode:"complete",getData:()=>[],paginationOptions:{pageSize:5}});return e.jsx(r,{columnConfig:o,...t,emptyState:e.jsx("div",{children:"No data available"})})}},m={render:()=>{const o=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(a,{title:t.name})},{id:"owner",label:"Owner",cell:t=>e.jsx(a,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>e.jsx(a,{title:t.type})}];return e.jsx(r,{columnConfig:o,data:y.slice(0,10),pagination:{type:"none"}})}},c={render:()=>{const[o,t]=x.useState(new Set),{tableProps:n}=S({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsx(r,{...n,columnConfig:f,selection:{mode:"multiple",behavior:"toggle",selected:o,onSelectionChange:t},rowConfig:{getIsDisabled:C=>C.id===2}})}},P=[{id:1,name:"Authentication Service",description:"Handles user login and session management",type:"service",owner:"Platform Team"},{id:2,name:"A very long component name that should be truncated when it exceeds the available column width",description:"This is also a very long description that demonstrates text truncation behavior in the table cells",type:"library",owner:"Frontend Team"},{id:3,name:"API Gateway",description:"Routes and validates API requests",type:"service",owner:"Backend Team"}],p={render:()=>{const[o,t]=x.useState(new Set(["1","3"])),[n,C]=x.useState({column:"name",direction:"ascending"}),T=[{id:"name",label:"Name",isRowHeader:!0,isSortable:!0,cell:l=>e.jsx(a,{title:l.name,description:l.description})},{id:"type",label:"Type",isSortable:!0,cell:l=>e.jsx(a,{title:l.type,leadingIcon:e.jsx("span",{style:{fontSize:"16px"},children:"📦"})})},{id:"owner",label:"Owner",cell:l=>e.jsx(a,{title:l.owner,href:"#"})}];return e.jsx(r,{columnConfig:T,data:P,pagination:{type:"none"},selection:{mode:"multiple",behavior:"toggle",selected:o,onSelectionChange:t},sort:{descriptor:n,onSortChange:l=>C({column:String(l.column),direction:l.direction})}})}},d={render:()=>{const o=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(a,{title:t.name})},{id:"type",label:"Type",cell:t=>e.jsx(a,{title:t.type})}];return e.jsx(r,{columnConfig:o,data:void 0,loading:!0,pagination:{type:"none"}})}},u={render:()=>{const o=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(a,{title:t.name})},{id:"type",label:"Type",cell:t=>e.jsx(a,{title:t.type})}];return e.jsx(r,{columnConfig:o,data:void 0,error:new Error("Failed to fetch data from the server"),pagination:{type:"none"}})}},g={render:()=>{const o=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(a,{title:t.name})},{id:"owner",label:"Owner",cell:t=>e.jsx(a,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>e.jsx(a,{title:t.type})}];return e.jsx(r,{columnConfig:o,data:y.slice(0,5),isStale:!0,pagination:{type:"none"}})}},b={render:()=>{const o=[{id:"name",label:"Name",isRowHeader:!0,cell:n=>e.jsx(a,{title:n.name})},{id:"owner",label:"Owner",cell:n=>e.jsx(a,{title:n.owner.name})},{id:"type",label:"Type",cell:n=>e.jsx(a,{title:n.type})}],{tableProps:t}=S({mode:"complete",getData:()=>y,paginationOptions:{pageSize:3,pageSizeOptions:[{label:"2 per page",value:2},{label:"3 per page",value:3},{label:"5 per page",value:5},{label:"7 per page",value:7}],onPageSizeChange:n=>{console.log("Page size changed to:",n)},onNextPage:()=>{console.log("Navigated to next page")},onPreviousPage:()=>{console.log("Navigated to previous page")}}});return e.jsx(r,{columnConfig:o,...t})}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}};const He=["ProfileCells","EmptyState","NoPagination","SelectionWithDisabledRows","CellTextVariants","LoadingState","ErrorState","StaleState","CustomPageSizeOptions"];export{p as CellTextVariants,b as CustomPageSizeOptions,s as EmptyState,u as ErrorState,d as LoadingState,m as NoPagination,i as ProfileCells,c as SelectionWithDisabledRows,g as StaleState,He as __namedExportsOrder,Re as default};
