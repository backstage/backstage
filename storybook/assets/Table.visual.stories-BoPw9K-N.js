import{j as e,r as S}from"./iframe-C8yOC2Gz.js";import{d as y}from"./mocked-data1-Bs2nnhCk.js";import{t as T,u as C,T as r,s as w,e as f,C as n,f as h,g as j}from"./utils-D2oDlK-U.js";import"./preload-helper-PPVm8Dsz.js";import"./useStyles-Cp2nr9ip.js";import"./clsx-B-dksMZM.js";import"./useListState-h7zkOJgq.js";import"./useFocusable-Cf-uba3q.js";import"./useObjectRef-B28ZJtJV.js";import"./usePress-DlLbwG62.js";import"./useEvent-Bz7ZiiYU.js";import"./SelectionIndicator-Chk8fLVr.js";import"./context-xKD2YgYJ.js";import"./Hidden-Bf4vJGoG.js";import"./useControlledState-3OIQq_AY.js";import"./index-BPNZKYTF.js";import"./Flex-arqN7lW6.js";import"./useSurface-HU3pbKvv.js";import"./Checkbox-C_OXWnR5.js";import"./RSPContexts-BuW_aY7-.js";import"./utils-Bx2t-JSx.js";import"./Form-BeYU7OAG.js";import"./useToggleState-7KOUQ1k_.js";import"./useFormReset-TWxaP-8z.js";import"./useFocusRing-9VATBKEW.js";import"./VisuallyHidden-Db8cAXyC.js";import"./isExternalLink-DzQTpl4p.js";import"./index-CL1m9NR9.js";import"./VisuallyHidden-CSKsda0G.js";import"./TablePagination-ngoAE7z6.js";import"./Select-EpdT0Oki.js";import"./Dialog-C19JSOa_.js";import"./ListBox-DWrZHFSF.js";import"./Text-uBsvBm9f.js";import"./useLabel-CxDV84tc.js";import"./useLabels-DTMIxM_1.js";import"./useLocalizedStringFormatter-BEYUcJWC.js";import"./Button-C1EZ39_j.js";import"./Label-Cpe3tjrq.js";import"./OverlayArrow-B-VkW_rH.js";import"./FieldError-CILJVuEy.js";import"./Input-B-2MV5dK.js";import"./SearchField-p5hkHDnt.js";import"./FieldLabel-BtbX2-zx.js";import"./FieldError-BJcJCsXR.js";import"./ButtonIcon-BMeiW29z.js";import"./Button.module-D8OjmJLb.js";import"./Text-B2b0JVSQ.js";import"./Link-DiCE4SC-.js";import"./useLink-x5cfDSAd.js";import"./Avatar-DQg107ju.js";import"./useHighlightSelectionDescription-Cxb0SOrf.js";import"./useHasTabbableChild-emFBPVC7.js";const De={title:"Backstage UI/Table/visual",...T},i={render:()=>{const o=[{id:"name",label:"Band name",isRowHeader:!0,cell:a=>e.jsx(f,{name:a.name,src:a.image,href:a.website})},{id:"genre",label:"Genre",cell:a=>e.jsx(n,{title:a.genre})},{id:"yearFormed",label:"Year formed",cell:a=>e.jsx(n,{title:a.yearFormed.toString()})},{id:"albums",label:"Albums",cell:a=>e.jsx(n,{title:a.albums.toString()})}],{tableProps:t}=C({mode:"complete",getData:()=>h,paginationOptions:{pageSize:5}});return e.jsx(r,{columnConfig:o,...t})}},s={render:()=>{const o=[{id:"name",label:"Name",isRowHeader:!0,cell:a=>e.jsx(n,{title:a.name})},{id:"type",label:"Type",cell:a=>e.jsx(n,{title:a.type})}],{tableProps:t}=C({mode:"complete",getData:()=>[],paginationOptions:{pageSize:5}});return e.jsx(r,{columnConfig:o,...t,emptyState:e.jsx("div",{children:"No data available"})})}},m={render:()=>{const o=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(n,{title:t.name})},{id:"owner",label:"Owner",cell:t=>e.jsx(n,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>e.jsx(n,{title:t.type})}];return e.jsx(r,{columnConfig:o,data:y.slice(0,10),pagination:{type:"none"}})}},c={render:()=>{const[o,t]=S.useState(new Set),{tableProps:a}=C({mode:"complete",getData:()=>j,paginationOptions:{pageSize:10}});return e.jsx(r,{...a,columnConfig:w,selection:{mode:"multiple",behavior:"toggle",selected:o,onSelectionChange:t},rowConfig:{getIsDisabled:b=>b.id===2}})}},D=[{id:1,name:"Authentication Service",description:"Handles user login and session management",type:"service",owner:"Platform Team"},{id:2,name:"A very long component name that should be truncated when it exceeds the available column width",description:"This is also a very long description that demonstrates text truncation behavior in the table cells",type:"library",owner:"Frontend Team"},{id:3,name:"API Gateway",description:"Routes and validates API requests",type:"service",owner:"Backend Team"}],p={render:()=>{const[o,t]=S.useState(new Set(["1","3"])),[a,b]=S.useState({column:"name",direction:"ascending"}),x=[{id:"name",label:"Name",isRowHeader:!0,isSortable:!0,cell:l=>e.jsx(n,{title:l.name,description:l.description})},{id:"type",label:"Type",isSortable:!0,cell:l=>e.jsx(n,{title:l.type,leadingIcon:e.jsx("span",{style:{fontSize:"16px"},children:"📦"})})},{id:"owner",label:"Owner",cell:l=>e.jsx(n,{title:l.owner,href:"#"})}];return e.jsx(r,{columnConfig:x,data:D,pagination:{type:"none"},selection:{mode:"multiple",behavior:"toggle",selected:o,onSelectionChange:t},sort:{descriptor:a,onSortChange:l=>b({column:String(l.column),direction:l.direction})}})}},d={render:()=>{const o=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(n,{title:t.name})},{id:"type",label:"Type",cell:t=>e.jsx(n,{title:t.type})}];return e.jsx(r,{columnConfig:o,data:void 0,loading:!0,pagination:{type:"none"}})}},u={render:()=>{const o=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(n,{title:t.name})},{id:"type",label:"Type",cell:t=>e.jsx(n,{title:t.type})}];return e.jsx(r,{columnConfig:o,data:void 0,error:new Error("Failed to fetch data from the server"),pagination:{type:"none"}})}},g={render:()=>{const o=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(n,{title:t.name})},{id:"owner",label:"Owner",cell:t=>e.jsx(n,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>e.jsx(n,{title:t.type})}];return e.jsx(r,{columnConfig:o,data:y.slice(0,5),isStale:!0,pagination:{type:"none"}})}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}};const ve=["ProfileCells","EmptyState","NoPagination","SelectionWithDisabledRows","CellTextVariants","LoadingState","ErrorState","StaleState"];export{p as CellTextVariants,s as EmptyState,u as ErrorState,d as LoadingState,m as NoPagination,i as ProfileCells,c as SelectionWithDisabledRows,g as StaleState,ve as __namedExportsOrder,De as default};
