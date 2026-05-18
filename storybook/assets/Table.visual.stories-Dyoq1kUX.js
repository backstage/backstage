import{r as x,j as e}from"./iframe-t9H7a1GP.js";import{t as w,d as y,s as f,a as h,b as v}from"./utils-B7fha5Kr.js";import{d as i,u as S,c as o,e as j}from"./useTable-w7nbcvP-.js";import"./preload-helper-PPVm8Dsz.js";import"./BUIProvider-DkLDzyw8.js";import"./openLink-B2Zr3UoO.js";import"./useResolvedHref-ByM8xp8i.js";import"./useObjectRef-D-LfZK3P.js";import"./Virtualizer-MQkCRMxU.js";import"./useCollection-CYvCL1ii.js";import"./useFocusRing-DNWvY8RS.js";import"./Hidden-CpRkSTHD.js";import"./keyboard-CM4wuuwl.js";import"./FocusScope-B32KV7sa.js";import"./useEvent-Ch2RdOnN.js";import"./I18nProvider-IedlwoY8.js";import"./usePress-C_lRFzPq.js";import"./textSelection-Dq7X0EAE.js";import"./useControlledState-DpMbG7KC.js";import"./useOverlayTriggerState-NopRWek4.js";import"./utils-B_HK0fZy.js";import"./number-DYBOfH25.js";import"./index-B2o8Nitq.js";import"./Flex-DeJYVe0t.js";import"./Checkbox-C_sMwBm2.js";import"./Checkbox-CsrDY3ga.js";import"./FieldError-CTPduq9I.js";import"./Text-BFIdZobh.js";import"./useFormValidation-C7fFAsQQ.js";import"./Label-BJGo-8TB.js";import"./useField-BjWwUXpF.js";import"./useLabel-DKCkml_f.js";import"./useLabels-C5_jB9N4.js";import"./useToggle-BKs5U_s2.js";import"./useFormReset-AFJ5yClQ.js";import"./useToggleState-CekNMUJz.js";import"./useHover-qr3gz19p.js";import"./VisuallyHidden-Ber9pqXl.js";import"./Skeleton-CrBlYM6a.js";import"./VisuallyHidden-B_L3roXX.js";import"./TablePagination-BTfsVQbO.js";import"./Select-DPnPDEad.js";import"./Dialog-DNGu89DR.js";import"./Button-BO1t6O6T.js";import"./useButton-rKZR3HiN.js";import"./Heading-DhXyn_3i.js";import"./Autocomplete-BaTK0OPO.js";import"./useLocalizedStringFormatter-DhiAY8I9.js";import"./getItemCount-DtWFxvPb.js";import"./animation-Cm5xaXnR.js";import"./ListBox-DWfVfPEa.js";import"./useListState-DZw3CQnM.js";import"./definition-BXG790Cl.js";import"./Input-ChvyHnwH.js";import"./SearchField-Dz0UyMzp.js";import"./useTextField-C-ULO0ld.js";import"./useFilter-CECzPmg3.js";import"./FieldLabel-Bwlgvu3A.js";import"./FieldError-DtkF0abN.js";import"./Text-nAVLbsLA.js";import"./ButtonIcon-jExiQj3w.js";import"./Link-pcc2pQhC.js";import"./useLink-CGWzLOJ8.js";import"./getNodeText-DbS2Az2E.js";import"./useHighlightSelectionDescription-B-kukgmP.js";import"./useUpdateEffect-B-QhrU-R.js";import"./useHasTabbableChild-DByHCsNa.js";import"./useGridSelectionCheckbox-Ce1apKGm.js";import"./Avatar-C_TVCKZe.js";const Le={title:"Backstage UI/Table/visual",...w},r={render:()=>{const a=[{id:"name",label:"Band name",isRowHeader:!0,cell:n=>e.jsx(j,{name:n.name,src:n.image,href:n.website})},{id:"genre",label:"Genre",cell:n=>e.jsx(o,{title:n.genre})},{id:"yearFormed",label:"Year formed",cell:n=>e.jsx(o,{title:n.yearFormed.toString()})},{id:"albums",label:"Albums",cell:n=>e.jsx(o,{title:n.albums.toString()})}],{tableProps:t}=S({mode:"complete",getData:()=>h,paginationOptions:{pageSize:5}});return e.jsx(i,{columnConfig:a,...t})}},s={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:n=>e.jsx(o,{title:n.name})},{id:"type",label:"Type",cell:n=>e.jsx(o,{title:n.type})}],{tableProps:t}=S({mode:"complete",getData:()=>[],paginationOptions:{pageSize:5}});return e.jsx(i,{columnConfig:a,...t,emptyState:e.jsx("div",{children:"No data available"})})}},m={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(o,{title:t.name})},{id:"owner",label:"Owner of the component or service in the organization",defaultWidth:120,cell:t=>e.jsx(o,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>e.jsx(o,{title:t.type})}];return e.jsx(i,{columnConfig:a,data:y.slice(0,10),pagination:{type:"none"}})}},c={render:()=>{const[a,t]=x.useState(new Set),{tableProps:n}=S({mode:"complete",getData:()=>v,paginationOptions:{pageSize:10}});return e.jsx(i,{...n,columnConfig:f,selection:{mode:"multiple",behavior:"toggle",selected:a,onSelectionChange:t},rowConfig:{getIsDisabled:C=>C.id===2}})}},P=[{id:1,name:"Authentication Service",description:"Handles user login and session management",type:"service",owner:"Platform Team"},{id:2,name:"A very long component name that should be truncated when it exceeds the available column width",description:"This is also a very long description that demonstrates text truncation behavior in the table cells",type:"library",owner:"Frontend Team"},{id:3,name:"API Gateway",description:"Routes and validates API requests",type:"service",owner:"Backend Team"}],p={render:()=>{const[a,t]=x.useState(new Set(["1","3"])),[n,C]=x.useState({column:"name",direction:"ascending"}),T=[{id:"name",label:"Name",isRowHeader:!0,isSortable:!0,cell:l=>e.jsx(o,{title:l.name,description:l.description})},{id:"type",label:"Type",isSortable:!0,cell:l=>e.jsx(o,{title:l.type,leadingIcon:e.jsx("span",{style:{fontSize:"16px"},children:"📦"})})},{id:"owner",label:"Owner",cell:l=>e.jsx(o,{title:l.owner,href:"#"})}];return e.jsx(i,{columnConfig:T,data:P,pagination:{type:"none"},selection:{mode:"multiple",behavior:"toggle",selected:a,onSelectionChange:t},sort:{descriptor:n,onSortChange:l=>C({column:String(l.column),direction:l.direction})}})}},d={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(o,{title:t.name})},{id:"type",label:"Type",cell:t=>e.jsx(o,{title:t.type})}];return e.jsx(i,{columnConfig:a,data:void 0,isPending:!0,pagination:{type:"none"}})}},u={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(o,{title:t.name})},{id:"type",label:"Type",cell:t=>e.jsx(o,{title:t.type})}];return e.jsx(i,{columnConfig:a,data:void 0,error:new Error("Failed to fetch data from the server"),pagination:{type:"none"}})}},g={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(o,{title:t.name})},{id:"owner",label:"Owner",cell:t=>e.jsx(o,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>e.jsx(o,{title:t.type})}];return e.jsx(i,{columnConfig:a,data:y.slice(0,5),isStale:!0,pagination:{type:"none"}})}},b={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:n=>e.jsx(o,{title:n.name})},{id:"owner",label:"Owner",cell:n=>e.jsx(o,{title:n.owner.name})},{id:"type",label:"Type",cell:n=>e.jsx(o,{title:n.type})}],{tableProps:t}=S({mode:"complete",getData:()=>y,paginationOptions:{pageSize:3,pageSizeOptions:[{label:"2 per page",value:2},{label:"3 per page",value:3},{label:"5 per page",value:5},{label:"7 per page",value:7}],onPageSizeChange:n=>{console.log("Page size changed to:",n)},onNextPage:()=>{console.log("Navigated to next page")},onPreviousPage:()=>{console.log("Navigated to previous page")}}});return e.jsx(i,{columnConfig:a,...t})}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}};const Ye=["ProfileCells","EmptyState","NoPagination","SelectionWithDisabledRows","CellTextVariants","LoadingState","ErrorState","StaleState","CustomPageSizeOptions"];export{p as CellTextVariants,b as CustomPageSizeOptions,s as EmptyState,u as ErrorState,d as LoadingState,m as NoPagination,r as ProfileCells,c as SelectionWithDisabledRows,g as StaleState,Ye as __namedExportsOrder,Le as default};
