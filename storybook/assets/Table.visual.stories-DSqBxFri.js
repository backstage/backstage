import{ca as x,bR as e}from"./iframe-BNSLO1vV.js";import{t as w,d as y,s as f,a as h,b as v}from"./utils-CuhiIAKf.js";import{T as i,u as S,a as o,C as P}from"./useTable-DUVkjPNO.js";import"./preload-helper-PPVm8Dsz.js";import"./BUIProvider-C1aeAfVF.js";import"./openLink-D76OisA9.js";import"./useResolvedHref-Cc2IO8w5.js";import"./useObjectRef-DfKP_bGf.js";import"./Virtualizer-DMO1Pg7x.js";import"./useCollection-DFBi0WJc.js";import"./useFocusRing-BWAOHlHz.js";import"./Hidden-BWb7YpQ9.js";import"./keyboard-CK2KOmJP.js";import"./FocusScope-DL8AivFs.js";import"./useEvent-TJw7m1NL.js";import"./I18nProvider-Ct0Vubxu.js";import"./usePress-B5FaNHuw.js";import"./textSelection-mReTmyFw.js";import"./useControlledState-PL9NIT9a.js";import"./useOverlayTriggerState-Baeho1Ue.js";import"./utils-BgaqTVim.js";import"./number-CFmIYAFH.js";import"./index-915ceJIm.js";import"./Flex-B19edo3u.js";import"./Checkbox-CYOl6jem.js";import"./Checkbox-DQPQRXLi.js";import"./FieldError-DzFGWgMI.js";import"./Text-B3PwrI6a.js";import"./useFormValidation-DICvltng.js";import"./Label-DzAvhi63.js";import"./useField-B0QwNT7y.js";import"./useLabel-BRSOlNNT.js";import"./useLabels-BlcH69Wp.js";import"./useToggle-OH42fc56.js";import"./useFormReset-EQWShVt4.js";import"./useToggleState-CQ64ZAhX.js";import"./useHover-CGZzpOhk.js";import"./VisuallyHidden-D8dNxkax.js";import"./Skeleton-BXpAp4SL.js";import"./VisuallyHidden-CttHuEiR.js";import"./TablePagination-Pi3DYrGz.js";import"./Select-Cv0xPAbm.js";import"./Button-B0vfnfY-.js";import"./useButton-BSKANQze.js";import"./ListBox-CFDeD7rX.js";import"./getItemCount-u9xCZwNr.js";import"./Autocomplete-BQexmFy8.js";import"./useLocalizedStringFormatter-DEaeFhG_.js";import"./useListState-bSCKIYSY.js";import"./Dialog-DTgFF9wf.js";import"./Heading-vDaE-Bpm.js";import"./animation-B2_q34rf.js";import"./Input-C013WslU.js";import"./SearchField-CSEHtFkT.js";import"./useTextField-C8My7CSS.js";import"./useFilter-C24k0sGf.js";import"./useCollectionAdapter-sYFClAvF.js";import"./Avatar-BJQKuhdF.js";import"./FieldLabel-CxT1gLPF.js";import"./FieldError-JGQ5ZZKy.js";import"./Popover-C0ray1_N.js";import"./Text-DSY5HhhV.js";import"./ButtonIcon-DDv33qIH.js";import"./Link-CVg5K25O.js";import"./useLink-BEuw5SHn.js";import"./getNodeText-CY5-f5dd.js";import"./useHighlightSelectionDescription-C_2R4gq9.js";import"./useUpdateEffect-BbntSGFh.js";import"./useHasTabbableChild-8UvgMJLE.js";import"./useGridSelectionCheckbox-r8VypmnX.js";const Ye={title:"Backstage UI/Table/visual",...w},r={render:()=>{const a=[{id:"name",label:"Band name",isRowHeader:!0,cell:n=>e.jsx(P,{name:n.name,src:n.image,href:n.website})},{id:"genre",label:"Genre",cell:n=>e.jsx(o,{title:n.genre})},{id:"yearFormed",label:"Year formed",cell:n=>e.jsx(o,{title:n.yearFormed.toString()})},{id:"albums",label:"Albums",cell:n=>e.jsx(o,{title:n.albums.toString()})}],{tableProps:t}=S({mode:"complete",getData:()=>h,paginationOptions:{pageSize:5}});return e.jsx(i,{columnConfig:a,...t})}},s={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:n=>e.jsx(o,{title:n.name})},{id:"type",label:"Type",cell:n=>e.jsx(o,{title:n.type})}],{tableProps:t}=S({mode:"complete",getData:()=>[],paginationOptions:{pageSize:5}});return e.jsx(i,{columnConfig:a,...t,emptyState:e.jsx("div",{children:"No data available"})})}},m={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(o,{title:t.name})},{id:"owner",label:"Owner of the component or service in the organization",defaultWidth:120,cell:t=>e.jsx(o,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>e.jsx(o,{title:t.type})}];return e.jsx(i,{columnConfig:a,data:y.slice(0,10),pagination:{type:"none"}})}},c={render:()=>{const[a,t]=x.useState(new Set),{tableProps:n}=S({mode:"complete",getData:()=>v,paginationOptions:{pageSize:10}});return e.jsx(i,{...n,columnConfig:f,selection:{mode:"multiple",behavior:"toggle",selected:a,onSelectionChange:t},rowConfig:{getIsDisabled:C=>C.id===2}})}},j=[{id:1,name:"Authentication Service",description:"Handles user login and session management",type:"service",owner:"Platform Team"},{id:2,name:"A very long component name that should be truncated when it exceeds the available column width",description:"This is also a very long description that demonstrates text truncation behavior in the table cells",type:"library",owner:"Frontend Team"},{id:3,name:"API Gateway",description:"Routes and validates API requests",type:"service",owner:"Backend Team"}],p={render:()=>{const[a,t]=x.useState(new Set(["1","3"])),[n,C]=x.useState({column:"name",direction:"ascending"}),T=[{id:"name",label:"Name",isRowHeader:!0,isSortable:!0,cell:l=>e.jsx(o,{title:l.name,description:l.description})},{id:"type",label:"Type",isSortable:!0,cell:l=>e.jsx(o,{title:l.type,leadingIcon:e.jsx("span",{style:{fontSize:"16px"},children:"📦"})})},{id:"owner",label:"Owner",cell:l=>e.jsx(o,{title:l.owner,href:"#"})}];return e.jsx(i,{columnConfig:T,data:j,pagination:{type:"none"},selection:{mode:"multiple",behavior:"toggle",selected:a,onSelectionChange:t},sort:{descriptor:n,onSortChange:l=>C({column:String(l.column),direction:l.direction})}})}},d={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(o,{title:t.name})},{id:"type",label:"Type",cell:t=>e.jsx(o,{title:t.type})}];return e.jsx(i,{columnConfig:a,data:void 0,isPending:!0,pagination:{type:"none"}})}},u={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(o,{title:t.name})},{id:"type",label:"Type",cell:t=>e.jsx(o,{title:t.type})}];return e.jsx(i,{columnConfig:a,data:void 0,error:new Error("Failed to fetch data from the server"),pagination:{type:"none"}})}},g={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(o,{title:t.name})},{id:"owner",label:"Owner",cell:t=>e.jsx(o,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>e.jsx(o,{title:t.type})}];return e.jsx(i,{columnConfig:a,data:y.slice(0,5),isStale:!0,pagination:{type:"none"}})}},b={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:n=>e.jsx(o,{title:n.name})},{id:"owner",label:"Owner",cell:n=>e.jsx(o,{title:n.owner.name})},{id:"type",label:"Type",cell:n=>e.jsx(o,{title:n.type})}],{tableProps:t}=S({mode:"complete",getData:()=>y,paginationOptions:{pageSize:3,pageSizeOptions:[{label:"2 per page",value:2},{label:"3 per page",value:3},{label:"5 per page",value:5},{label:"7 per page",value:7}],onPageSizeChange:n=>{console.log("Page size changed to:",n)},onNextPage:()=>{console.log("Navigated to next page")},onPreviousPage:()=>{console.log("Navigated to previous page")}}});return e.jsx(i,{columnConfig:a,...t})}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
      label: 'Owner of the component or service in the organization',
      defaultWidth: 120,
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
    return <Table columnConfig={columns} data={undefined} isPending pagination={{
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
}`,...b.parameters?.docs?.source}}};const _e=["ProfileCells","EmptyState","NoPagination","SelectionWithDisabledRows","CellTextVariants","LoadingState","ErrorState","StaleState","CustomPageSizeOptions"];export{p as CellTextVariants,b as CustomPageSizeOptions,s as EmptyState,u as ErrorState,d as LoadingState,m as NoPagination,r as ProfileCells,c as SelectionWithDisabledRows,g as StaleState,_e as __namedExportsOrder,Ye as default};
