import{j as e,r as S}from"./iframe-CDMGjht1.js";import{d as y}from"./mocked-data1-Bs2nnhCk.js";import{t as T,u as C,T as l,s as w,e as f,C as n,f as h,g as j}from"./utils-CvPuQpfD.js";import"./preload-helper-PPVm8Dsz.js";import"./useStyles-BuXaoLuy.js";import"./clsx-B-dksMZM.js";import"./SelectionManager-DuDRr8lf.js";import"./useFocusable-e06xOYAF.js";import"./useObjectRef-vqxPmU1u.js";import"./usePress-CY1aMgW_.js";import"./useEvent-DILQypF3.js";import"./SelectionIndicator-CUpmD4Gv.js";import"./context-C7Z1Yniv.js";import"./Hidden-CVnTALYq.js";import"./useControlledState-DSo8XaCD.js";import"./index-6ni4X3d6.js";import"./Flex-D1ckmWJU.js";import"./useSurface-BaT7FJzz.js";import"./Checkbox-BUZ0nZrr.js";import"./RSPContexts-Mc7HM6rs.js";import"./utils-g0RWddUU.js";import"./Form-MyXhU_wj.js";import"./useToggle-Dj-VeWNw.js";import"./useFormReset-CXaX4OLp.js";import"./useToggleState-BuD_xqf4.js";import"./useFocusRing-Bfd5vJzE.js";import"./VisuallyHidden-CAnrpvQ7.js";import"./isExternalLink-DzQTpl4p.js";import"./index-K4DNRamS.js";import"./VisuallyHidden-BNeLTOo3.js";import"./TablePagination-D3uvH1jH.js";import"./Select-BOHfBqub.js";import"./Dialog-DtxreU9r.js";import"./Button-DGXKcQj1.js";import"./Label-wv8EHgGG.js";import"./useLabel-D0kuD8t9.js";import"./useLabels-BcDnH4Xe.js";import"./useButton-BWMvR-GB.js";import"./OverlayArrow-CsJQc_bL.js";import"./Separator-DGYxEDQ0.js";import"./Text-BCv3JODw.js";import"./useLocalizedStringFormatter-DlWtLeD0.js";import"./FieldError-BwSrIfys.js";import"./ListBox-BLpAMy-R.js";import"./useListState-DoJEa-Pu.js";import"./useField-CzIEm_1n.js";import"./Popover.module-O5UoF8fw.js";import"./Autocomplete-C7Fkh2RC.js";import"./Input-DgcfFBB0.js";import"./SearchField-CLQ_c-M0.js";import"./FieldLabel-DqbbEhgd.js";import"./FieldError-BOe9GgWK.js";import"./ButtonIcon-BjyXN5M3.js";import"./Button.module-DkEJAzA0.js";import"./Text-CuCiW2xy.js";import"./Link-kEKrf2OL.js";import"./useLink-Cw6dPxbx.js";import"./Avatar-dnMgfBxJ.js";import"./useHighlightSelectionDescription-Bv0tO2ug.js";import"./useHasTabbableChild-T2IZHt83.js";const Oe={title:"Backstage UI/Table/visual",...T},i={render:()=>{const a=[{id:"name",label:"Band name",isRowHeader:!0,cell:o=>e.jsx(f,{name:o.name,src:o.image,href:o.website})},{id:"genre",label:"Genre",cell:o=>e.jsx(n,{title:o.genre})},{id:"yearFormed",label:"Year formed",cell:o=>e.jsx(n,{title:o.yearFormed.toString()})},{id:"albums",label:"Albums",cell:o=>e.jsx(n,{title:o.albums.toString()})}],{tableProps:t}=C({mode:"complete",getData:()=>h,paginationOptions:{pageSize:5}});return e.jsx(l,{columnConfig:a,...t})}},s={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:o=>e.jsx(n,{title:o.name})},{id:"type",label:"Type",cell:o=>e.jsx(n,{title:o.type})}],{tableProps:t}=C({mode:"complete",getData:()=>[],paginationOptions:{pageSize:5}});return e.jsx(l,{columnConfig:a,...t,emptyState:e.jsx("div",{children:"No data available"})})}},m={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(n,{title:t.name})},{id:"owner",label:"Owner",cell:t=>e.jsx(n,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>e.jsx(n,{title:t.type})}];return e.jsx(l,{columnConfig:a,data:y.slice(0,10),pagination:{type:"none"}})}},c={render:()=>{const[a,t]=S.useState(new Set),{tableProps:o}=C({mode:"complete",getData:()=>j,paginationOptions:{pageSize:10}});return e.jsx(l,{...o,columnConfig:w,selection:{mode:"multiple",behavior:"toggle",selected:a,onSelectionChange:t},rowConfig:{getIsDisabled:b=>b.id===2}})}},D=[{id:1,name:"Authentication Service",description:"Handles user login and session management",type:"service",owner:"Platform Team"},{id:2,name:"A very long component name that should be truncated when it exceeds the available column width",description:"This is also a very long description that demonstrates text truncation behavior in the table cells",type:"library",owner:"Frontend Team"},{id:3,name:"API Gateway",description:"Routes and validates API requests",type:"service",owner:"Backend Team"}],p={render:()=>{const[a,t]=S.useState(new Set(["1","3"])),[o,b]=S.useState({column:"name",direction:"ascending"}),x=[{id:"name",label:"Name",isRowHeader:!0,isSortable:!0,cell:r=>e.jsx(n,{title:r.name,description:r.description})},{id:"type",label:"Type",isSortable:!0,cell:r=>e.jsx(n,{title:r.type,leadingIcon:e.jsx("span",{style:{fontSize:"16px"},children:"📦"})})},{id:"owner",label:"Owner",cell:r=>e.jsx(n,{title:r.owner,href:"#"})}];return e.jsx(l,{columnConfig:x,data:D,pagination:{type:"none"},selection:{mode:"multiple",behavior:"toggle",selected:a,onSelectionChange:t},sort:{descriptor:o,onSortChange:r=>b({column:String(r.column),direction:r.direction})}})}},d={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(n,{title:t.name})},{id:"type",label:"Type",cell:t=>e.jsx(n,{title:t.type})}];return e.jsx(l,{columnConfig:a,data:void 0,loading:!0,pagination:{type:"none"}})}},u={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(n,{title:t.name})},{id:"type",label:"Type",cell:t=>e.jsx(n,{title:t.type})}];return e.jsx(l,{columnConfig:a,data:void 0,error:new Error("Failed to fetch data from the server"),pagination:{type:"none"}})}},g={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(n,{title:t.name})},{id:"owner",label:"Owner",cell:t=>e.jsx(n,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>e.jsx(n,{title:t.type})}];return e.jsx(l,{columnConfig:a,data:y.slice(0,5),isStale:!0,pagination:{type:"none"}})}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}};const Ee=["ProfileCells","EmptyState","NoPagination","SelectionWithDisabledRows","CellTextVariants","LoadingState","ErrorState","StaleState"];export{p as CellTextVariants,s as EmptyState,u as ErrorState,d as LoadingState,m as NoPagination,i as ProfileCells,c as SelectionWithDisabledRows,g as StaleState,Ee as __namedExportsOrder,Oe as default};
