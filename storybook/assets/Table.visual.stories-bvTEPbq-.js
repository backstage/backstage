import{j as e,r as S}from"./iframe-OUC1hy1H.js";import{d as y}from"./mocked-data1-Bs2nnhCk.js";import{t as T,u as C,T as r,s as w,e as f,C as n,f as h,g as j}from"./utils-D8ATIzPs.js";import"./preload-helper-PPVm8Dsz.js";import"./useStyles-BaONCSkE.js";import"./clsx-B-dksMZM.js";import"./useListState-D5IbOxW1.js";import"./useFocusable-TT6djGBW.js";import"./useObjectRef-6gXwUxt0.js";import"./usePress-wO8QA_B4.js";import"./useEvent-BZfwiQXr.js";import"./SelectionIndicator-GcOcAfXg.js";import"./context-C5aqG8tU.js";import"./Hidden-C-0yicsS.js";import"./useControlledState-Cm9f7dTu.js";import"./index-D4oTCeTJ.js";import"./Flex-BhlKuQ9v.js";import"./useSurface-B0ayTmJO.js";import"./Checkbox-BPP2tKxP.js";import"./RSPContexts-DTR_CgGN.js";import"./utils-DXBqo5Xm.js";import"./Form-CRz3e8en.js";import"./useToggle-BwfQSQJo.js";import"./useFormReset-CTJRwYEg.js";import"./useToggleState-BaUXBUSS.js";import"./useFocusRing-DYgZMWSG.js";import"./VisuallyHidden-Ei8gg8WB.js";import"./isExternalLink-DzQTpl4p.js";import"./index-_R9_qqkB.js";import"./VisuallyHidden-C7xqrtb0.js";import"./TablePagination-hyop9GeM.js";import"./Select-D5NgVqK4.js";import"./Dialog-uUCAa6hr.js";import"./ListBox-E-dXpkna.js";import"./Text-at0_7CvX.js";import"./useLabel-ItSB4Rxf.js";import"./useLabels-DvFaAZZI.js";import"./useLocalizedStringFormatter-CXd1jwaQ.js";import"./Button-0VEB2ZkT.js";import"./Label-DZa06QgM.js";import"./useButton-CmJkajli.js";import"./OverlayArrow-BWeCpfBx.js";import"./FieldError-BB3z4Kss.js";import"./Input-Kbb3INx1.js";import"./SearchField-Dd_C4NK6.js";import"./FieldLabel-CFTOZnI4.js";import"./FieldError-CkQNCPeW.js";import"./ButtonIcon-BpCu2_qs.js";import"./Button.module-DkEJAzA0.js";import"./Text-CP74jZ5O.js";import"./Link-HrzVlePL.js";import"./useLink-DpZPl6hF.js";import"./Avatar-Bym06QmZ.js";import"./useHighlightSelectionDescription-gvqDAUIm.js";import"./useHasTabbableChild-BfXAeP-A.js";const Pe={title:"Backstage UI/Table/visual",...T},i={render:()=>{const a=[{id:"name",label:"Band name",isRowHeader:!0,cell:o=>e.jsx(f,{name:o.name,src:o.image,href:o.website})},{id:"genre",label:"Genre",cell:o=>e.jsx(n,{title:o.genre})},{id:"yearFormed",label:"Year formed",cell:o=>e.jsx(n,{title:o.yearFormed.toString()})},{id:"albums",label:"Albums",cell:o=>e.jsx(n,{title:o.albums.toString()})}],{tableProps:t}=C({mode:"complete",getData:()=>h,paginationOptions:{pageSize:5}});return e.jsx(r,{columnConfig:a,...t})}},s={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:o=>e.jsx(n,{title:o.name})},{id:"type",label:"Type",cell:o=>e.jsx(n,{title:o.type})}],{tableProps:t}=C({mode:"complete",getData:()=>[],paginationOptions:{pageSize:5}});return e.jsx(r,{columnConfig:a,...t,emptyState:e.jsx("div",{children:"No data available"})})}},m={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(n,{title:t.name})},{id:"owner",label:"Owner",cell:t=>e.jsx(n,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>e.jsx(n,{title:t.type})}];return e.jsx(r,{columnConfig:a,data:y.slice(0,10),pagination:{type:"none"}})}},c={render:()=>{const[a,t]=S.useState(new Set),{tableProps:o}=C({mode:"complete",getData:()=>j,paginationOptions:{pageSize:10}});return e.jsx(r,{...o,columnConfig:w,selection:{mode:"multiple",behavior:"toggle",selected:a,onSelectionChange:t},rowConfig:{getIsDisabled:b=>b.id===2}})}},D=[{id:1,name:"Authentication Service",description:"Handles user login and session management",type:"service",owner:"Platform Team"},{id:2,name:"A very long component name that should be truncated when it exceeds the available column width",description:"This is also a very long description that demonstrates text truncation behavior in the table cells",type:"library",owner:"Frontend Team"},{id:3,name:"API Gateway",description:"Routes and validates API requests",type:"service",owner:"Backend Team"}],p={render:()=>{const[a,t]=S.useState(new Set(["1","3"])),[o,b]=S.useState({column:"name",direction:"ascending"}),x=[{id:"name",label:"Name",isRowHeader:!0,isSortable:!0,cell:l=>e.jsx(n,{title:l.name,description:l.description})},{id:"type",label:"Type",isSortable:!0,cell:l=>e.jsx(n,{title:l.type,leadingIcon:e.jsx("span",{style:{fontSize:"16px"},children:"📦"})})},{id:"owner",label:"Owner",cell:l=>e.jsx(n,{title:l.owner,href:"#"})}];return e.jsx(r,{columnConfig:x,data:D,pagination:{type:"none"},selection:{mode:"multiple",behavior:"toggle",selected:a,onSelectionChange:t},sort:{descriptor:o,onSortChange:l=>b({column:String(l.column),direction:l.direction})}})}},d={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(n,{title:t.name})},{id:"type",label:"Type",cell:t=>e.jsx(n,{title:t.type})}];return e.jsx(r,{columnConfig:a,data:void 0,loading:!0,pagination:{type:"none"}})}},u={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(n,{title:t.name})},{id:"type",label:"Type",cell:t=>e.jsx(n,{title:t.type})}];return e.jsx(r,{columnConfig:a,data:void 0,error:new Error("Failed to fetch data from the server"),pagination:{type:"none"}})}},g={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(n,{title:t.name})},{id:"owner",label:"Owner",cell:t=>e.jsx(n,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>e.jsx(n,{title:t.type})}];return e.jsx(r,{columnConfig:a,data:y.slice(0,5),isStale:!0,pagination:{type:"none"}})}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}};const Re=["ProfileCells","EmptyState","NoPagination","SelectionWithDisabledRows","CellTextVariants","LoadingState","ErrorState","StaleState"];export{p as CellTextVariants,s as EmptyState,u as ErrorState,d as LoadingState,m as NoPagination,i as ProfileCells,c as SelectionWithDisabledRows,g as StaleState,Re as __namedExportsOrder,Pe as default};
