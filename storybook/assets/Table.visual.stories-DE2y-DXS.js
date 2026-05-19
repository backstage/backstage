import{r as x,j as e}from"./iframe-BCuiGO18.js";import{t as w,d as y,s as f,a as h,b as v}from"./utils-DGP4wDrA.js";import{d as i,u as S,c as o,e as j}from"./useTable-BAs9PoJv.js";import"./preload-helper-PPVm8Dsz.js";import"./BUIProvider-DVdVOrKl.js";import"./openLink-qumaaci0.js";import"./useResolvedHref-BM9nXUlO.js";import"./useObjectRef-4ckOICrI.js";import"./Virtualizer-Dq6StmEu.js";import"./useCollection-BFYgTRUF.js";import"./useFocusRing-DLmUbRy9.js";import"./Hidden-CQxh535z.js";import"./keyboard-CW4oFFyD.js";import"./FocusScope-C9frp5S3.js";import"./useEvent-4on_clb_.js";import"./I18nProvider-PVYTewA5.js";import"./usePress-BvVw0-yf.js";import"./textSelection-B2Nn6fLe.js";import"./useControlledState-BCKq2N8L.js";import"./useOverlayTriggerState-FMs9pAOe.js";import"./utils-Dk-My0Vp.js";import"./number-K2-BhP7Z.js";import"./index-CZoZdV61.js";import"./Flex-Dgv-ETOp.js";import"./Checkbox-CtmfuTgN.js";import"./Checkbox-Cqi3upjh.js";import"./FieldError-BHS-ts2M.js";import"./Text-D_YSa9DZ.js";import"./useFormValidation-DDQUNMCB.js";import"./Label-CP3Gf_jA.js";import"./useField-XKRN51sf.js";import"./useLabel-Cghjfl30.js";import"./useLabels-DNIhmQLC.js";import"./useToggle-B0FatEHn.js";import"./useFormReset-C5fpnI1D.js";import"./useToggleState-UqsOBUFT.js";import"./useHover-DAnXmX41.js";import"./VisuallyHidden-D8FM7PxL.js";import"./Skeleton-gwgeq7NZ.js";import"./VisuallyHidden-COkXnbZQ.js";import"./TablePagination-Dt5PNrZq.js";import"./Select-Bmw23Vrz.js";import"./Dialog-BVA8Etyl.js";import"./Button-D45nAvky.js";import"./useButton-wJ1TOWtu.js";import"./Heading-p3ccHffT.js";import"./Autocomplete-CblQiv1-.js";import"./useLocalizedStringFormatter-DYH9mEAL.js";import"./getItemCount-V0Dhj5LC.js";import"./animation-G_BOhArD.js";import"./ListBox-CdC0FzRK.js";import"./useListState-CxjrO4Uy.js";import"./definition-CpmdpZG4.js";import"./Input-YrcqhNjP.js";import"./SearchField-CgRHBJcu.js";import"./useTextField-D88sn5Bj.js";import"./useFilter-mXUQlKFC.js";import"./FieldLabel-skXYA8du.js";import"./FieldError-ALlgHKsB.js";import"./Text-DMbKVHIB.js";import"./ButtonIcon-VFIrmix7.js";import"./Link-Ch47eojL.js";import"./useLink-Drk5Ft_h.js";import"./getNodeText-CMopUeQo.js";import"./useHighlightSelectionDescription-8cvAx5fF.js";import"./useUpdateEffect-YXkcz00p.js";import"./useHasTabbableChild-BsIxHqfb.js";import"./useGridSelectionCheckbox-BBA3aBu9.js";import"./Avatar-C6YhJM-r.js";const Le={title:"Backstage UI/Table/visual",...w},r={render:()=>{const a=[{id:"name",label:"Band name",isRowHeader:!0,cell:n=>e.jsx(j,{name:n.name,src:n.image,href:n.website})},{id:"genre",label:"Genre",cell:n=>e.jsx(o,{title:n.genre})},{id:"yearFormed",label:"Year formed",cell:n=>e.jsx(o,{title:n.yearFormed.toString()})},{id:"albums",label:"Albums",cell:n=>e.jsx(o,{title:n.albums.toString()})}],{tableProps:t}=S({mode:"complete",getData:()=>h,paginationOptions:{pageSize:5}});return e.jsx(i,{columnConfig:a,...t})}},s={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:n=>e.jsx(o,{title:n.name})},{id:"type",label:"Type",cell:n=>e.jsx(o,{title:n.type})}],{tableProps:t}=S({mode:"complete",getData:()=>[],paginationOptions:{pageSize:5}});return e.jsx(i,{columnConfig:a,...t,emptyState:e.jsx("div",{children:"No data available"})})}},m={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(o,{title:t.name})},{id:"owner",label:"Owner of the component or service in the organization",defaultWidth:120,cell:t=>e.jsx(o,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>e.jsx(o,{title:t.type})}];return e.jsx(i,{columnConfig:a,data:y.slice(0,10),pagination:{type:"none"}})}},c={render:()=>{const[a,t]=x.useState(new Set),{tableProps:n}=S({mode:"complete",getData:()=>v,paginationOptions:{pageSize:10}});return e.jsx(i,{...n,columnConfig:f,selection:{mode:"multiple",behavior:"toggle",selected:a,onSelectionChange:t},rowConfig:{getIsDisabled:C=>C.id===2}})}},P=[{id:1,name:"Authentication Service",description:"Handles user login and session management",type:"service",owner:"Platform Team"},{id:2,name:"A very long component name that should be truncated when it exceeds the available column width",description:"This is also a very long description that demonstrates text truncation behavior in the table cells",type:"library",owner:"Frontend Team"},{id:3,name:"API Gateway",description:"Routes and validates API requests",type:"service",owner:"Backend Team"}],p={render:()=>{const[a,t]=x.useState(new Set(["1","3"])),[n,C]=x.useState({column:"name",direction:"ascending"}),T=[{id:"name",label:"Name",isRowHeader:!0,isSortable:!0,cell:l=>e.jsx(o,{title:l.name,description:l.description})},{id:"type",label:"Type",isSortable:!0,cell:l=>e.jsx(o,{title:l.type,leadingIcon:e.jsx("span",{style:{fontSize:"16px"},children:"📦"})})},{id:"owner",label:"Owner",cell:l=>e.jsx(o,{title:l.owner,href:"#"})}];return e.jsx(i,{columnConfig:T,data:P,pagination:{type:"none"},selection:{mode:"multiple",behavior:"toggle",selected:a,onSelectionChange:t},sort:{descriptor:n,onSortChange:l=>C({column:String(l.column),direction:l.direction})}})}},d={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(o,{title:t.name})},{id:"type",label:"Type",cell:t=>e.jsx(o,{title:t.type})}];return e.jsx(i,{columnConfig:a,data:void 0,isPending:!0,pagination:{type:"none"}})}},u={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(o,{title:t.name})},{id:"type",label:"Type",cell:t=>e.jsx(o,{title:t.type})}];return e.jsx(i,{columnConfig:a,data:void 0,error:new Error("Failed to fetch data from the server"),pagination:{type:"none"}})}},g={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(o,{title:t.name})},{id:"owner",label:"Owner",cell:t=>e.jsx(o,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>e.jsx(o,{title:t.type})}];return e.jsx(i,{columnConfig:a,data:y.slice(0,5),isStale:!0,pagination:{type:"none"}})}},b={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:n=>e.jsx(o,{title:n.name})},{id:"owner",label:"Owner",cell:n=>e.jsx(o,{title:n.owner.name})},{id:"type",label:"Type",cell:n=>e.jsx(o,{title:n.type})}],{tableProps:t}=S({mode:"complete",getData:()=>y,paginationOptions:{pageSize:3,pageSizeOptions:[{label:"2 per page",value:2},{label:"3 per page",value:3},{label:"5 per page",value:5},{label:"7 per page",value:7}],onPageSizeChange:n=>{console.log("Page size changed to:",n)},onNextPage:()=>{console.log("Navigated to next page")},onPreviousPage:()=>{console.log("Navigated to previous page")}}});return e.jsx(i,{columnConfig:a,...t})}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
