import{c8 as w,bQ as e}from"./iframe-Zd-YI-2K.js";import{t as T,d as c,s as v,a as j,b as P}from"./utils-DGKrTnNu.js";import{T as o,u as s,a as n,C as D}from"./useTable-CtjipU3U.js";import{T as S}from"./Text-CFiK0v-x.js";import"./preload-helper-PPVm8Dsz.js";import"./BUIProvider-4zqAwNHJ.js";import"./BUIRoutingProvider-C6YoxI9h.js";import"./openLink-Bn8ArFiV.js";import"./useResolvedHref-DdfPjt6A.js";import"./useObjectRef-CSGev21E.js";import"./Virtualizer-BDEY7Q3f.js";import"./useCollection-56kX9o5o.js";import"./useFocusRing-B2ToGNzb.js";import"./Hidden-5-RKz3aG.js";import"./keyboard-D9WPU0OD.js";import"./FocusScope-D-eoOKQj.js";import"./useEvent-Bvwyi-gT.js";import"./I18nProvider-BhAOc9Ga.js";import"./usePress-B_YcD4zB.js";import"./textSelection-P_IOG6mD.js";import"./useControlledState-DInYdsj6.js";import"./useOverlayTriggerState-B-jymaAe.js";import"./utils-B9HGNt0C.js";import"./number-DiAqIE8i.js";import"./index-CirsuCpW.js";import"./Flex-CHjpui5g.js";import"./Checkbox-DBXP1n1M.js";import"./Checkbox-2YaOgX3E.js";import"./FieldError-5PqzcpId.js";import"./Text-BJ1H8aMC.js";import"./useFormValidation-DCAqIXhc.js";import"./Label-YhzAN0Eo.js";import"./useField-Cx2viaGD.js";import"./useLabel-CKKQW7cE.js";import"./useLabels-Qd-JAFm0.js";import"./useToggle-EUIkpi2-.js";import"./useFormReset-CiFp_S2j.js";import"./useToggleState-DHf1BqLL.js";import"./useHover-BUmLyoKK.js";import"./VisuallyHidden-Do0nVhed.js";import"./Skeleton-CpfVVKI5.js";import"./VisuallyHidden-BHUevxsB.js";import"./TablePagination-9hrF-hwn.js";import"./Select-D6J4yYEB.js";import"./Button-BPK5A0ph.js";import"./useButton-BzU-QnhQ.js";import"./ListBox-CwRQCJrJ.js";import"./getItemCount-DPCKm2BS.js";import"./Autocomplete-DTC98uk5.js";import"./useLocalizedStringFormatter-1rTSaIVc.js";import"./useListState-Ba_x5rtm.js";import"./Dialog-6paZnkzR.js";import"./Heading-BJB_7RPS.js";import"./animation-BuTCjKPk.js";import"./Input-DNefN7x7.js";import"./SearchField-DHbszZZe.js";import"./useTextField-BK-HcGoi.js";import"./useFilter-B360iIVa.js";import"./useCollectionAdapter-CkR5h81X.js";import"./Avatar-j5zsmd-v.js";import"./FieldLabel-BFHnaWne.js";import"./FieldError-DcteGN6b.js";import"./Popover-Ewo1ut50.js";import"./ButtonIcon-8KnJDrRQ.js";import"./Link-Bi3ecWei.js";import"./useLink-DriAbYNv.js";import"./getNodeText-Cl4qhgiQ.js";import"./useHighlightSelectionDescription-DvAQBghl.js";import"./useUpdateEffect-BJDOdxIV.js";import"./useHasTabbableChild-EPF6yVuS.js";import"./useGridSelectionCheckbox-jvP_FCRV.js";const Me={title:"Backstage UI/Table/visual",...T},d={render:()=>{const l=[{id:"name",label:"Band name",isRowHeader:!0,cell:i=>e.jsx(D,{name:i.name,src:i.image,href:i.website})},{id:"genre",label:"Genre",cell:i=>e.jsx(n,{title:i.genre})},{id:"yearFormed",label:"Year formed",cell:i=>e.jsx(n,{title:i.yearFormed.toString()})},{id:"albums",label:"Albums",cell:i=>e.jsx(n,{title:i.albums.toString()})}],{tableProps:t}=s({mode:"complete",getData:()=>j,paginationOptions:{pageSize:5}});return e.jsx(o,{columnConfig:l,...t})}},p={render:()=>{const l=[{id:"name",label:"Name",isRowHeader:!0,cell:i=>e.jsx(n,{title:i.name})},{id:"type",label:"Type",cell:i=>e.jsx(n,{title:i.type})}],{tableProps:t}=s({mode:"complete",getData:()=>[],paginationOptions:{pageSize:5}});return e.jsx(o,{columnConfig:l,...t,emptyState:e.jsx("div",{children:"No data available"})})}},u={render:()=>{const l=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(n,{title:t.name})},{id:"owner",label:"Owner of the component or service in the organization",defaultWidth:120,cell:t=>e.jsx(n,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>e.jsx(n,{title:t.type})}];return e.jsx(o,{columnConfig:l,data:c.slice(0,10),pagination:{type:"none"}})}},g={render:()=>{const[l,t]=w.useState(new Set),{tableProps:i}=s({mode:"complete",getData:()=>P,paginationOptions:{pageSize:10}});return e.jsx(o,{...i,columnConfig:v,selection:{mode:"multiple",behavior:"toggle",selected:l,onSelectionChange:t},rowConfig:{getIsDisabled:m=>m.id===2}})}},W=[{id:1,name:"Authentication Service",description:"Handles user login and session management",type:"service",owner:"Platform Team"},{id:2,name:"A very long component name that should be truncated when it exceeds the available column width",description:"This is also a very long description that demonstrates text truncation behavior in the table cells",type:"library",owner:"Frontend Team"},{id:3,name:"API Gateway",description:"Routes and validates API requests",type:"service",owner:"Backend Team"}],b={render:()=>{const[l,t]=w.useState(new Set(["1","3"])),[i,m]=w.useState({column:"name",direction:"ascending"}),a=[{id:"name",label:"Name",isRowHeader:!0,isSortable:!0,cell:r=>e.jsx(n,{title:r.name,description:r.description})},{id:"type",label:"Type",isSortable:!0,cell:r=>e.jsx(n,{title:r.type,leadingIcon:e.jsx("span",{style:{fontSize:"16px"},children:"📦"})})},{id:"owner",label:"Owner",cell:r=>e.jsx(n,{title:r.owner,href:"#"})}];return e.jsx(o,{columnConfig:a,data:W,pagination:{type:"none"},selection:{mode:"multiple",behavior:"toggle",selected:l,onSelectionChange:t},sort:{descriptor:i,onSortChange:r=>m({column:String(r.column),direction:r.direction})}})}},x={render:()=>{const l=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(n,{title:t.name})},{id:"type",label:"Type",cell:t=>e.jsx(n,{title:t.type})}];return e.jsx(o,{columnConfig:l,data:void 0,isPending:!0,pagination:{type:"none"}})}},f={render:()=>{const l=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(n,{title:t.name})},{id:"type",label:"Type",cell:t=>e.jsx(n,{title:t.type})}];return e.jsx(o,{columnConfig:l,data:void 0,error:new Error("Failed to fetch data from the server"),pagination:{type:"none"}})}},y={render:()=>{const l=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(n,{title:t.name})},{id:"owner",label:"Owner",cell:t=>e.jsx(n,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>e.jsx(n,{title:t.type})}];return e.jsx(o,{columnConfig:l,data:c.slice(0,5),isStale:!0,pagination:{type:"none"}})}},C={render:()=>{const l=[{id:"name",label:"Name",isRowHeader:!0,cell:i=>e.jsx(n,{title:i.name})},{id:"owner",label:"Owner",cell:i=>e.jsx(n,{title:i.owner.name})},{id:"type",label:"Type",cell:i=>e.jsx(n,{title:i.type})}],{tableProps:t}=s({mode:"complete",getData:()=>c,paginationOptions:{pageSize:3,pageSizeOptions:[{label:"2 per page",value:2},{label:"3 per page",value:3},{label:"5 per page",value:5},{label:"7 per page",value:7}],onPageSizeChange:i=>{console.log("Page size changed to:",i)},onNextPage:()=>{console.log("Navigated to next page")},onPreviousPage:()=>{console.log("Navigated to previous page")}}});return e.jsx(o,{columnConfig:l,...t})}},h={render:()=>{const l=[{id:"name",label:"Name (3fr)",isRowHeader:!0,width:"3fr",cell:a=>e.jsx(n,{title:a.name,description:a.description})},{id:"owner",label:"Owner (2fr)",width:"2fr",cell:a=>e.jsx(n,{title:a.owner.name})},{id:"type",label:"Type (1fr)",width:"1fr",cell:a=>e.jsx(n,{title:a.type})},{id:"lifecycle",label:"Lifecycle (1fr)",width:"1fr",cell:a=>e.jsx(n,{title:a.lifecycle})}],t=[{id:"name",label:"Name (3fr, min 200px)",isRowHeader:!0,defaultWidth:"3fr",minWidth:200,cell:a=>e.jsx(n,{title:a.name,description:a.description})},{id:"owner",label:"Owner (2fr, 120–300px)",defaultWidth:"2fr",minWidth:120,maxWidth:300,cell:a=>e.jsx(n,{title:a.owner.name})},{id:"type",label:"Type (1fr, 80–150px)",defaultWidth:"1fr",minWidth:80,maxWidth:150,cell:a=>e.jsx(n,{title:a.type})},{id:"lifecycle",label:"Lifecycle (1fr, 80–150px)",defaultWidth:"1fr",minWidth:80,maxWidth:150,cell:a=>e.jsx(n,{title:a.lifecycle})}],i=s({mode:"complete",getData:()=>c,paginationOptions:{pageSize:5}}),m=s({mode:"complete",getData:()=>c,paginationOptions:{pageSize:5}});return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:32},children:[e.jsxs("div",{children:[e.jsx(S,{variant:"body-large",color:"secondary",children:"Fixed ratios with width — columns keep their proportions"}),e.jsx(o,{columnConfig:l,...i.tableProps})]}),e.jsxs("div",{children:[e.jsx(S,{variant:"body-large",color:"secondary",children:"Resizable with defaultWidth — fr ratios with pixel min/max constraints"}),e.jsx(o,{columnConfig:t,...m.tableProps})]})]})}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
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
}`,...b.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const fixedColumns: ColumnConfig<Data1Item>[] = [{
      id: 'name',
      label: 'Name (3fr)',
      isRowHeader: true,
      width: '3fr',
      cell: item => <CellText title={item.name} description={item.description} />
    }, {
      id: 'owner',
      label: 'Owner (2fr)',
      width: '2fr',
      cell: item => <CellText title={item.owner.name} />
    }, {
      id: 'type',
      label: 'Type (1fr)',
      width: '1fr',
      cell: item => <CellText title={item.type} />
    }, {
      id: 'lifecycle',
      label: 'Lifecycle (1fr)',
      width: '1fr',
      cell: item => <CellText title={item.lifecycle} />
    }];
    const constrainedColumns: ColumnConfig<Data1Item>[] = [{
      id: 'name',
      label: 'Name (3fr, min 200px)',
      isRowHeader: true,
      defaultWidth: '3fr',
      minWidth: 200,
      cell: item => <CellText title={item.name} description={item.description} />
    }, {
      id: 'owner',
      label: 'Owner (2fr, 120–300px)',
      defaultWidth: '2fr',
      minWidth: 120,
      maxWidth: 300,
      cell: item => <CellText title={item.owner.name} />
    }, {
      id: 'type',
      label: 'Type (1fr, 80–150px)',
      defaultWidth: '1fr',
      minWidth: 80,
      maxWidth: 150,
      cell: item => <CellText title={item.type} />
    }, {
      id: 'lifecycle',
      label: 'Lifecycle (1fr, 80–150px)',
      defaultWidth: '1fr',
      minWidth: 80,
      maxWidth: 150,
      cell: item => <CellText title={item.lifecycle} />
    }];
    const fixed = useTable({
      mode: 'complete',
      getData: () => data1,
      paginationOptions: {
        pageSize: 5
      }
    });
    const constrained = useTable({
      mode: 'complete',
      getData: () => data1,
      paginationOptions: {
        pageSize: 5
      }
    });
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 32
    }}>
        <div>
          <Text variant="body-large" color="secondary">
            Fixed ratios with width — columns keep their proportions
          </Text>
          <Table columnConfig={fixedColumns} {...fixed.tableProps} />
        </div>
        <div>
          <Text variant="body-large" color="secondary">
            Resizable with defaultWidth — fr ratios with pixel min/max
            constraints
          </Text>
          <Table columnConfig={constrainedColumns} {...constrained.tableProps} />
        </div>
      </div>;
  }
}`,...h.parameters?.docs?.source}}};const Qe=["ProfileCells","EmptyState","NoPagination","SelectionWithDisabledRows","CellTextVariants","LoadingState","ErrorState","StaleState","CustomPageSizeOptions","ColumnWidthsWithFr"];export{b as CellTextVariants,h as ColumnWidthsWithFr,C as CustomPageSizeOptions,p as EmptyState,f as ErrorState,x as LoadingState,u as NoPagination,d as ProfileCells,g as SelectionWithDisabledRows,y as StaleState,Qe as __namedExportsOrder,Me as default};
