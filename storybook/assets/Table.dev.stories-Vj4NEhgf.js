import{j as n,r as u}from"./iframe-DFN6SAj3.js";import{d as g}from"./mocked-data1-Bs2nnhCk.js";import{t as ee,u as s,T as c,R as K,C as a,a as ne,b as te,c as G,d as le,s as C,e as Y,f as v,g as f}from"./utils-CURS6FZb.js";import{S as X}from"./SearchField-B-eFgtGv.js";import{F as J}from"./Flex-Dc6Fn51M.js";import{B as ae}from"./Button-Bukakr8I.js";import{S as oe}from"./Select-BRidrB8C.js";import"./preload-helper-PPVm8Dsz.js";import"./useStyles-DaQj56o8.js";import"./clsx-B-dksMZM.js";import"./useListState-Dq8yYTzv.js";import"./useFocusable-BqV40-mu.js";import"./useObjectRef-Dg08NMj-.js";import"./usePress-vdIMkS3w.js";import"./useEvent-DGXsBPji.js";import"./SelectionIndicator-CO7nDxl9.js";import"./context-DAG0vsnX.js";import"./Hidden-B4o_BYU0.js";import"./useControlledState-Brt6Ny7j.js";import"./index-CWKYqCX3.js";import"./Checkbox-CoSt-O7a.js";import"./RSPContexts-B9rhbHT1.js";import"./utils-Bfjqt0Ay.js";import"./Form-B41r19Qw.js";import"./useToggle-CyWk4YId.js";import"./useFormReset-CQb_uMIr.js";import"./useToggleState-NGf5lFJ8.js";import"./useFocusRing-BJ5ZSrxY.js";import"./VisuallyHidden-LKIi0bVz.js";import"./isExternalLink-DzQTpl4p.js";import"./index-BUG12Py2.js";import"./VisuallyHidden-GJApReGl.js";import"./TablePagination-DvcwDpJy.js";import"./ButtonIcon-B0ZX66hT.js";import"./Button-CewZAUMg.js";import"./Label-DSJtZte4.js";import"./useLabel-DH47co1_.js";import"./useLabels-8yrTN_aE.js";import"./useButton-4oKFdG4C.js";import"./Button.module-DkEJAzA0.js";import"./Text-DZ5o8eVF.js";import"./Link-DDSMAdIk.js";import"./useLink-DpagGf2g.js";import"./Avatar-DvF3DF1w.js";import"./ListBox-C9Gc4fMw.js";import"./Text-wo0eSwpS.js";import"./useHighlightSelectionDescription-BkpJ4RZ2.js";import"./useLocalizedStringFormatter-B9AAQgKo.js";import"./useHasTabbableChild-DSTncWf_.js";import"./Input-CGJSOyE7.js";import"./SearchField-BNsmZb9W.js";import"./FieldError-CqUjgKGD.js";import"./FieldLabel-CC6OPSaD.js";import"./FieldError-Bw3II3bl.js";import"./useSurface-CpQk2yDD.js";import"./Dialog-_0O8mKte.js";import"./OverlayArrow-D1Fd-dyl.js";const mn={title:"Backstage UI/Table/dev",...ee},j={render:()=>{const l=[{id:"name",label:"Name",isRowHeader:!0,cell:e=>n.jsx(a,{title:e.name,description:e.description})},{id:"owner",label:"Owner",cell:e=>n.jsx(a,{title:e.owner.name})},{id:"type",label:"Type",cell:e=>n.jsx(a,{title:e.type})},{id:"lifecycle",label:"Lifecycle",cell:e=>n.jsx(a,{title:e.lifecycle})}],{tableProps:t}=s({mode:"complete",getData:()=>g,paginationOptions:{pageSize:5}});return n.jsx(c,{columnConfig:l,...t})}},P={render:()=>{const l=[{id:"name",label:"Name",isRowHeader:!0,cell:e=>n.jsx(a,{title:e.name}),isSortable:!0},{id:"owner",label:"Owner",cell:e=>n.jsx(a,{title:e.owner.name}),isSortable:!0},{id:"type",label:"Type",cell:e=>n.jsx(a,{title:e.type}),isSortable:!0},{id:"lifecycle",label:"Lifecycle",cell:e=>n.jsx(a,{title:e.lifecycle}),isSortable:!0}],{tableProps:t}=s({mode:"complete",getData:()=>g,paginationOptions:{pageSize:5},initialSort:{column:"name",direction:"ascending"},sortFn:(e,{column:o,direction:i})=>[...e].sort((m,d)=>{let r,b;o==="name"?(r=m.name,b=d.name):o==="owner"?(r=m.owner.name,b=d.owner.name):o==="type"?(r=m.type,b=d.type):(r=m.lifecycle,b=d.lifecycle);const y=r.localeCompare(b);return i==="descending"?-y:y})});return n.jsx(c,{columnConfig:l,...t})}},D={render:()=>{const l=[{id:"name",label:"Name",isRowHeader:!0,cell:o=>n.jsx(a,{title:o.name}),isSortable:!0},{id:"owner",label:"Owner",cell:o=>n.jsx(a,{title:o.owner.name})},{id:"type",label:"Type",cell:o=>n.jsx(a,{title:o.type})}],{tableProps:t,search:e}=s({mode:"complete",getData:()=>g,paginationOptions:{pageSize:5},searchFn:(o,i)=>{const m=i.toLowerCase();return o.filter(d=>d.name.toLowerCase().includes(m)||d.owner.name.toLowerCase().includes(m)||d.type.toLowerCase().includes(m))}});return n.jsxs("div",{children:[n.jsx(X,{"aria-label":"Search",placeholder:"Search...",style:{marginBottom:"16px"},...e}),n.jsx(c,{columnConfig:l,emptyState:e.value?n.jsx("div",{children:"No results found"}):n.jsx("div",{children:"No data available"}),...t})]})}},O={render:()=>{const[l,t]=u.useState(new Set),e=[{id:"name",label:"Name",isRowHeader:!0,cell:i=>n.jsx(a,{title:i.name})},{id:"owner",label:"Owner",cell:i=>n.jsx(a,{title:i.owner.name})},{id:"type",label:"Type",cell:i=>n.jsx(a,{title:i.type})}],{tableProps:o}=s({mode:"complete",getData:()=>g,paginationOptions:{pageSize:5}});return n.jsx(c,{...o,columnConfig:e,selection:{mode:"multiple",selected:l,onSelectionChange:t}})}},R={render:()=>{const l=[{id:"name",label:"Band name",isRowHeader:!0,cell:e=>n.jsx(Y,{name:e.name,src:e.image})},{id:"genre",label:"Genre",cell:e=>n.jsx(a,{title:e.genre})},{id:"yearFormed",label:"Year formed",cell:e=>n.jsx(a,{title:e.yearFormed.toString()})}],{tableProps:t}=s({mode:"complete",getData:()=>v,paginationOptions:{pageSize:5}});return n.jsx(c,{...t,columnConfig:l,rowConfig:{getHref:e=>`/bands/${e.id}`}})}},z={render:()=>{const l=[{id:"name",label:"Name",isRowHeader:!0,cell:o=>n.jsx(a,{title:o.name})},{id:"type",label:"Type",cell:o=>n.jsx(a,{title:o.type})}],{tableProps:t,reload:e}=s({mode:"complete",getData:()=>g,paginationOptions:{pageSize:5}});return n.jsxs("div",{children:[n.jsx(ae,{onPress:()=>e(),children:"Refresh Data"}),n.jsx(c,{columnConfig:l,...t})]})}},L={render:()=>{const l=[{id:"name",label:"Name",isRowHeader:!0,cell:e=>n.jsx(a,{title:e.name})},{id:"owner",label:"Owner",cell:e=>n.jsx(a,{title:e.owner.name})},{id:"type",label:"Type",cell:e=>n.jsx(a,{title:e.type})}],{tableProps:t}=s({mode:"offset",getData:async({offset:e,pageSize:o})=>(await new Promise(i=>setTimeout(i,500)),{data:g.slice(e,e+o),totalCount:g.length}),paginationOptions:{pageSize:5}});return n.jsx(c,{columnConfig:l,...t})}},k={render:()=>{const l=[{id:"name",label:"Band name",isRowHeader:!0,cell:e=>n.jsx(Y,{name:e.name,src:e.image})},{id:"genre",label:"Genre",cell:e=>n.jsx(a,{title:e.genre})}],{tableProps:t}=s({mode:"cursor",getData:async({cursor:e,pageSize:o})=>{await new Promise(d=>setTimeout(d,500));const i=e?parseInt(e,10):0,m=i+o;return{data:v.slice(i,m),totalCount:v.length,nextCursor:m<v.length?String(m):void 0,prevCursor:i>0?String(Math.max(0,i-o)):void 0}},paginationOptions:{pageSize:5}});return n.jsx(c,{columnConfig:l,...t})}},H={render:()=>{const l=[{id:"name",label:"Name",isRowHeader:!0,cell:e=>n.jsx(a,{title:e.name})},{id:"type",label:"Type",cell:e=>n.jsx(a,{title:e.type})},{id:"lifecycle",label:"Lifecycle",cell:e=>n.jsx(a,{title:e.lifecycle})}],{tableProps:t}=s({mode:"complete",getData:()=>g,paginationOptions:{pageSize:5}});return n.jsx(c,{...t,columnConfig:l,rowConfig:({item:e})=>n.jsx(K,{id:String(e.id),columns:l,style:{background:e.lifecycle==="experimental"?"var(--bui-bg-warning)":void 0,borderLeft:e.lifecycle==="experimental"?"3px solid var(--bui-fg-warning)":"3px solid transparent"},children:o=>n.jsx(u.Fragment,{children:o.id==="name"?n.jsx(a,{title:e.name,description:e.description}):o.cell(e)},o.id)})})}},N={render:()=>{const l=g.slice(0,5);return n.jsxs(ne,{children:[n.jsxs(te,{children:[n.jsx(G,{isRowHeader:!0,children:"Name"}),n.jsx(G,{children:"Owner"}),n.jsx(G,{children:"Type"})]}),n.jsx(le,{children:l.map(t=>n.jsxs(K,{id:String(t.id),children:[n.jsx(a,{title:t.name}),n.jsx(a,{title:t.owner.name}),n.jsx(a,{title:t.type})]},t.id))})]})}},V={render:()=>{const l=[{id:"name",label:"Band name",isRowHeader:!0,cell:e=>n.jsx(Y,{name:e.name,src:e.image,href:e.website})},{id:"genre",label:"Genre",cell:e=>n.jsx(a,{title:e.genre})},{id:"yearFormed",label:"Year formed",cell:e=>n.jsx(a,{title:e.yearFormed.toString()})},{id:"albums",label:"Albums",cell:e=>n.jsx(a,{title:e.albums.toString()})}],{tableProps:t}=s({mode:"complete",getData:()=>v,paginationOptions:{pageSize:5}});return n.jsx(c,{...t,columnConfig:l,rowConfig:{onClick:e=>alert(`Clicked: ${e.name}`)}})}},F={render:()=>{const[l,t]=u.useState(new Set),{tableProps:e}=s({mode:"complete",getData:()=>f,paginationOptions:{pageSize:10}});return n.jsx(c,{...e,columnConfig:C,selection:{mode:"single",behavior:"toggle",selected:l,onSelectionChange:t}})}},I={render:()=>{const[l,t]=u.useState(new Set),{tableProps:e}=s({mode:"complete",getData:()=>f,paginationOptions:{pageSize:10}});return n.jsx(c,{...e,columnConfig:C,selection:{mode:"multiple",behavior:"toggle",selected:l,onSelectionChange:t}})}},B={render:()=>{const[l,t]=u.useState(new Set),{tableProps:e}=s({mode:"complete",getData:()=>f,paginationOptions:{pageSize:10}});return n.jsx(c,{...e,columnConfig:C,selection:{mode:"multiple",behavior:"toggle",selected:l,onSelectionChange:t},rowConfig:{onClick:o=>alert(`Clicked: ${o.name}`)}})}},$={render:()=>{const[l,t]=u.useState(new Set),{tableProps:e}=s({mode:"complete",getData:()=>f,paginationOptions:{pageSize:10}});return n.jsx(c,{...e,columnConfig:C,selection:{mode:"multiple",behavior:"toggle",selected:l,onSelectionChange:t},rowConfig:{getHref:o=>`/items/${o.id}`}})}},W={render:()=>{const[l,t]=u.useState(new Set),{tableProps:e}=s({mode:"complete",getData:()=>g,paginationOptions:{pageSize:5}}),o=[{id:"name",label:"Name",isRowHeader:!0,cell:i=>n.jsx(a,{title:i.name})},{id:"owner",label:"Owner",cell:i=>n.jsx(a,{title:i.owner.name})},{id:"type",label:"Type",cell:i=>n.jsx(a,{title:i.type})}];return n.jsx(c,{...e,columnConfig:o,selection:{mode:"multiple",behavior:"toggle",selected:l,onSelectionChange:t}})}},M={render:()=>{const[l,t]=u.useState(new Set),{tableProps:e}=s({mode:"complete",getData:()=>f,paginationOptions:{pageSize:10}});return n.jsx(c,{...e,columnConfig:C,selection:{mode:"single",behavior:"replace",selected:l,onSelectionChange:t}})}},A={render:()=>{const[l,t]=u.useState(new Set),{tableProps:e}=s({mode:"complete",getData:()=>f,paginationOptions:{pageSize:10}});return n.jsx(c,{...e,columnConfig:C,selection:{mode:"multiple",behavior:"replace",selected:l,onSelectionChange:t}})}},q={render:()=>{const[l,t]=u.useState(new Set),{tableProps:e}=s({mode:"complete",getData:()=>f,paginationOptions:{pageSize:10}});return n.jsx(c,{...e,columnConfig:C,selection:{mode:"multiple",behavior:"replace",selected:l,onSelectionChange:t},rowConfig:{onClick:o=>alert(`Opening ${o.name}`)}})}},Q={render:()=>{const[l,t]=u.useState(new Set),{tableProps:e}=s({mode:"complete",getData:()=>f,paginationOptions:{pageSize:10}});return n.jsx(c,{...e,columnConfig:C,selection:{mode:"multiple",behavior:"replace",selected:l,onSelectionChange:t},rowConfig:{getHref:o=>`/items/${o.id}`}})}},T={render:()=>{const[l,t]=u.useState(new Set),e=[{value:"",label:"All types"},{value:"service",label:"Service"},{value:"website",label:"Website"},{value:"library",label:"Library"},{value:"documentation",label:"Documentation"},{value:"other",label:"Other"}],o=[{id:"name",label:"Name",isRowHeader:!0,isSortable:!0,cell:r=>n.jsx(a,{title:r.name,description:r.description})},{id:"owner",label:"Owner",isSortable:!0,cell:r=>n.jsx(a,{title:r.owner.name})},{id:"type",label:"Type",isSortable:!0,cell:r=>n.jsx(a,{title:r.type})},{id:"lifecycle",label:"Lifecycle",isSortable:!0,cell:r=>n.jsx(a,{title:r.lifecycle})}],{tableProps:i,search:m,filter:d}=s({mode:"offset",initialSort:{column:"name",direction:"ascending"},getData:async({offset:r,pageSize:b,sort:y,filter:E,search:_})=>{const Z=Math.floor(r/b)+1;await new Promise(p=>setTimeout(p,300*Z));let w=[...g];if(_){const p=_.toLowerCase();w=w.filter(S=>S.name.toLowerCase().includes(p)||S.owner.name.toLowerCase().includes(p)||S.description?.toLowerCase().includes(p))}return E?.type&&(w=w.filter(p=>p.type===E.type)),y&&w.sort((p,S)=>{let x,h;switch(y.column){case"owner":x=p.owner.name,h=S.owner.name;break;case"type":x=p.type,h=S.type;break;case"lifecycle":x=p.lifecycle,h=S.lifecycle;break;default:x=p.name,h=S.name}const U=x.localeCompare(h);return y.direction==="descending"?-U:U}),{data:w.slice(r,r+b),totalCount:w.length}},paginationOptions:{pageSize:10}});return n.jsxs(J,{direction:"column",gap:"4",children:[n.jsxs(J,{gap:"4",align:"end",children:[n.jsx(X,{"aria-label":"Search",label:"Search",placeholder:"Search by name, owner, or description...",style:{width:300},...m}),n.jsx(oe,{label:"Type",options:e,value:d.value?.type??"",onChange:r=>d.onChange({type:r===""?null:String(r)}),style:{width:180}})]}),n.jsx(c,{...i,columnConfig:o,selection:{mode:"multiple",behavior:"toggle",selected:l,onSelectionChange:t},emptyState:m.value||d.value?.type?n.jsx("div",{children:"No results match your filters"}):n.jsx("div",{children:"No data available"})})]})}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => {
    const columns: ColumnConfig<Data1Item>[] = [{
      id: 'name',
      label: 'Name',
      isRowHeader: true,
      cell: item => <CellText title={item.name} description={item.description} />
    }, {
      id: 'owner',
      label: 'Owner',
      cell: item => <CellText title={item.owner.name} />
    }, {
      id: 'type',
      label: 'Type',
      cell: item => <CellText title={item.type} />
    }, {
      id: 'lifecycle',
      label: 'Lifecycle',
      cell: item => <CellText title={item.lifecycle} />
    }];
    const {
      tableProps
    } = useTable({
      mode: 'complete',
      getData: () => data1,
      paginationOptions: {
        pageSize: 5
      }
    });
    return <Table columnConfig={columns} {...tableProps} />;
  }
}`,...j.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: () => {
    const columns: ColumnConfig<Data1Item>[] = [{
      id: 'name',
      label: 'Name',
      isRowHeader: true,
      cell: item => <CellText title={item.name} />,
      isSortable: true
    }, {
      id: 'owner',
      label: 'Owner',
      cell: item => <CellText title={item.owner.name} />,
      isSortable: true
    }, {
      id: 'type',
      label: 'Type',
      cell: item => <CellText title={item.type} />,
      isSortable: true
    }, {
      id: 'lifecycle',
      label: 'Lifecycle',
      cell: item => <CellText title={item.lifecycle} />,
      isSortable: true
    }];
    const {
      tableProps
    } = useTable({
      mode: 'complete',
      getData: () => data1,
      paginationOptions: {
        pageSize: 5
      },
      initialSort: {
        column: 'name',
        direction: 'ascending'
      },
      sortFn: (items, {
        column,
        direction
      }) => {
        return [...items].sort((a, b) => {
          let aVal: string;
          let bVal: string;
          if (column === 'name') {
            aVal = a.name;
            bVal = b.name;
          } else if (column === 'owner') {
            aVal = a.owner.name;
            bVal = b.owner.name;
          } else if (column === 'type') {
            aVal = a.type;
            bVal = b.type;
          } else {
            aVal = a.lifecycle;
            bVal = b.lifecycle;
          }
          const cmp = aVal.localeCompare(bVal);
          return direction === 'descending' ? -cmp : cmp;
        });
      }
    });
    return <Table columnConfig={columns} {...tableProps} />;
  }
}`,...P.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => {
    const columns: ColumnConfig<Data1Item>[] = [{
      id: 'name',
      label: 'Name',
      isRowHeader: true,
      cell: item => <CellText title={item.name} />,
      isSortable: true
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
      tableProps,
      search
    } = useTable({
      mode: 'complete',
      getData: () => data1,
      paginationOptions: {
        pageSize: 5
      },
      searchFn: (items, query) => {
        const lowerQuery = query.toLowerCase();
        return items.filter(item => item.name.toLowerCase().includes(lowerQuery) || item.owner.name.toLowerCase().includes(lowerQuery) || item.type.toLowerCase().includes(lowerQuery));
      }
    });
    return <div>
        <SearchField aria-label="Search" placeholder="Search..." style={{
        marginBottom: '16px'
      }} {...search} />
        <Table columnConfig={columns} emptyState={search.value ? <div>No results found</div> : <div>No data available</div>} {...tableProps} />
      </div>;
  }
}`,...D.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = useState<Set<string | number> | 'all'>(new Set());
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
        pageSize: 5
      }
    });
    return <Table {...tableProps} columnConfig={columns} selection={{
      mode: 'multiple',
      selected,
      onSelectionChange: setSelected
    }} />;
  }
}`,...O.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: () => {
    const columns: ColumnConfig<Data4Item>[] = [{
      id: 'name',
      label: 'Band name',
      isRowHeader: true,
      cell: item => <CellProfile name={item.name} src={item.image} />
    }, {
      id: 'genre',
      label: 'Genre',
      cell: item => <CellText title={item.genre} />
    }, {
      id: 'yearFormed',
      label: 'Year formed',
      cell: item => <CellText title={item.yearFormed.toString()} />
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
    return <Table {...tableProps} columnConfig={columns} rowConfig={{
      getHref: item => \`/bands/\${item.id}\`
    }} />;
  }
}`,...R.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
      tableProps,
      reload
    } = useTable({
      mode: 'complete',
      getData: () => data1,
      paginationOptions: {
        pageSize: 5
      }
    });
    return <div>
        <Button onPress={() => reload()}>Refresh Data</Button>
        <Table columnConfig={columns} {...tableProps} />
      </div>;
  }
}`,...z.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
      mode: 'offset',
      getData: async ({
        offset,
        pageSize
      }) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
          data: data1.slice(offset, offset + pageSize),
          totalCount: data1.length
        };
      },
      paginationOptions: {
        pageSize: 5
      }
    });
    return <Table columnConfig={columns} {...tableProps} />;
  }
}`,...L.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => {
    const columns: ColumnConfig<Data4Item>[] = [{
      id: 'name',
      label: 'Band name',
      isRowHeader: true,
      cell: item => <CellProfile name={item.name} src={item.image} />
    }, {
      id: 'genre',
      label: 'Genre',
      cell: item => <CellText title={item.genre} />
    }];
    const {
      tableProps
    } = useTable({
      mode: 'cursor',
      getData: async ({
        cursor,
        pageSize
      }) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const startIndex = cursor ? parseInt(cursor, 10) : 0;
        const nextIndex = startIndex + pageSize;
        return {
          data: data4.slice(startIndex, nextIndex),
          totalCount: data4.length,
          nextCursor: nextIndex < data4.length ? String(nextIndex) : undefined,
          prevCursor: startIndex > 0 ? String(Math.max(0, startIndex - pageSize)) : undefined
        };
      },
      paginationOptions: {
        pageSize: 5
      }
    });
    return <Table columnConfig={columns} {...tableProps} />;
  }
}`,...k.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
    }, {
      id: 'lifecycle',
      label: 'Lifecycle',
      cell: item => <CellText title={item.lifecycle} />
    }];
    const {
      tableProps
    } = useTable({
      mode: 'complete',
      getData: () => data1,
      paginationOptions: {
        pageSize: 5
      }
    });
    return <Table {...tableProps} columnConfig={columns} rowConfig={({
      item
    }) => <Row id={String(item.id)} columns={columns} style={{
      background: item.lifecycle === 'experimental' ? 'var(--bui-bg-warning)' : undefined,
      borderLeft: item.lifecycle === 'experimental' ? '3px solid var(--bui-fg-warning)' : '3px solid transparent'
    }}>
            {column => <Fragment key={column.id}>
                {column.id === 'name' ? <CellText title={item.name} description={item.description} /> : column.cell(item)}
              </Fragment>}
          </Row>} />;
  }
}`,...H.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: () => {
    const displayData = data1.slice(0, 5);
    return <TableRoot>
        <TableHeader>
          <Column isRowHeader>Name</Column>
          <Column>Owner</Column>
          <Column>Type</Column>
        </TableHeader>
        <TableBody>
          {displayData.map(item => <Row key={item.id} id={String(item.id)}>
              <CellText title={item.name} />
              <CellText title={item.owner.name} />
              <CellText title={item.type} />
            </Row>)}
        </TableBody>
      </TableRoot>;
  }
}`,...N.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
    return <Table {...tableProps} columnConfig={columns} rowConfig={{
      onClick: item => alert(\`Clicked: \${item.name}\`)
    }} />;
  }
}`,...V.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
      mode: 'single',
      behavior: 'toggle',
      selected,
      onSelectionChange: setSelected
    }} />;
  }
}`,...F.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
    }} />;
  }
}`,...I.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
      onClick: item => alert(\`Clicked: \${item.name}\`)
    }} />;
  }
}`,...B.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
      getHref: item => \`/items/\${item.id}\`
    }} />;
  }
}`,...$.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = useState<Set<string | number> | 'all'>(new Set());
    const {
      tableProps
    } = useTable({
      mode: 'complete',
      getData: () => data1,
      paginationOptions: {
        pageSize: 5
      }
    });
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
    return <Table {...tableProps} columnConfig={columns} selection={{
      mode: 'multiple',
      behavior: 'toggle',
      selected,
      onSelectionChange: setSelected
    }} />;
  }
}`,...W.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
      mode: 'single',
      behavior: 'replace',
      selected,
      onSelectionChange: setSelected
    }} />;
  }
}`,...M.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
      behavior: 'replace',
      selected,
      onSelectionChange: setSelected
    }} />;
  }
}`,...A.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
      behavior: 'replace',
      selected,
      onSelectionChange: setSelected
    }} rowConfig={{
      onClick: item => alert(\`Opening \${item.name}\`)
    }} />;
  }
}`,...q.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
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
      behavior: 'replace',
      selected,
      onSelectionChange: setSelected
    }} rowConfig={{
      getHref: item => \`/items/\${item.id}\`
    }} />;
  }
}`,...Q.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = useState<Set<string | number> | 'all'>(new Set());
    const typeOptions = [{
      value: '',
      label: 'All types'
    }, {
      value: 'service',
      label: 'Service'
    }, {
      value: 'website',
      label: 'Website'
    }, {
      value: 'library',
      label: 'Library'
    }, {
      value: 'documentation',
      label: 'Documentation'
    }, {
      value: 'other',
      label: 'Other'
    }];
    const columns: ColumnConfig<Data1Item>[] = [{
      id: 'name',
      label: 'Name',
      isRowHeader: true,
      isSortable: true,
      cell: item => <CellText title={item.name} description={item.description} />
    }, {
      id: 'owner',
      label: 'Owner',
      isSortable: true,
      cell: item => <CellText title={item.owner.name} />
    }, {
      id: 'type',
      label: 'Type',
      isSortable: true,
      cell: item => <CellText title={item.type} />
    }, {
      id: 'lifecycle',
      label: 'Lifecycle',
      isSortable: true,
      cell: item => <CellText title={item.lifecycle} />
    }];
    const {
      tableProps,
      search,
      filter
    } = useTable<Data1Item, TypeFilter>({
      mode: 'offset',
      initialSort: {
        column: 'name',
        direction: 'ascending'
      },
      getData: async ({
        offset,
        pageSize,
        sort,
        filter: typeFilter,
        search: searchQuery
      }) => {
        // Simulate server-side filtering, sorting, and pagination
        // with slower and slower responses
        const page = Math.floor(offset / pageSize) + 1;
        await new Promise(resolve => setTimeout(resolve, 300 * page));
        let filtered = [...data1];

        // Apply search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(item => item.name.toLowerCase().includes(query) || item.owner.name.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query));
        }

        // Apply type filter
        if (typeFilter?.type) {
          filtered = filtered.filter(item => item.type === typeFilter.type);
        }

        // Apply sorting
        if (sort) {
          filtered.sort((a, b) => {
            let aVal: string;
            let bVal: string;
            switch (sort.column) {
              case 'owner':
                aVal = a.owner.name;
                bVal = b.owner.name;
                break;
              case 'type':
                aVal = a.type;
                bVal = b.type;
                break;
              case 'lifecycle':
                aVal = a.lifecycle;
                bVal = b.lifecycle;
                break;
              default:
                aVal = a.name;
                bVal = b.name;
            }
            const cmp = aVal.localeCompare(bVal);
            return sort.direction === 'descending' ? -cmp : cmp;
          });
        }
        return {
          data: filtered.slice(offset, offset + pageSize),
          totalCount: filtered.length
        };
      },
      paginationOptions: {
        pageSize: 10
      }
    });
    return <Flex direction="column" gap="4">
        <Flex gap="4" align="end">
          <SearchField aria-label="Search" label="Search" placeholder="Search by name, owner, or description..." style={{
          width: 300
        }} {...search} />
          <Select label="Type" options={typeOptions} value={filter.value?.type ?? ''} onChange={key => filter.onChange({
          type: key === '' ? null : String(key)
        })} style={{
          width: 180
        }} />
        </Flex>
        <Table {...tableProps} columnConfig={columns} selection={{
        mode: 'multiple',
        behavior: 'toggle',
        selected,
        onSelectionChange: setSelected
      }} emptyState={search.value || filter.value?.type ? <div>No results match your filters</div> : <div>No data available</div>} />
      </Flex>;
  }
}`,...T.parameters?.docs?.source},description:{story:`Comprehensive example showcasing a common complex use case:
- Server-side offset pagination
- Search/filtering
- Sorting
- Multi-selection
- Type filter dropdown`,...T.parameters?.docs?.description}}};const dn=["BasicLocalData","Sorting","Search","Selection","RowLinks","Reload","ServerSidePaginationOffset","ServerSidePaginationCursor","CustomRowRender","AtomicComponents","RowClick","SelectionSingleToggle","SelectionMultiToggle","SelectionWithRowClick","SelectionWithRowLinks","SelectionWithPagination","SelectionSingleReplace","SelectionMultiReplace","SelectionReplaceWithRowClick","SelectionReplaceWithRowLinks","ComprehensiveServerSide"];export{N as AtomicComponents,j as BasicLocalData,T as ComprehensiveServerSide,H as CustomRowRender,z as Reload,V as RowClick,R as RowLinks,D as Search,O as Selection,A as SelectionMultiReplace,I as SelectionMultiToggle,q as SelectionReplaceWithRowClick,Q as SelectionReplaceWithRowLinks,M as SelectionSingleReplace,F as SelectionSingleToggle,W as SelectionWithPagination,B as SelectionWithRowClick,$ as SelectionWithRowLinks,k as ServerSidePaginationCursor,L as ServerSidePaginationOffset,P as Sorting,dn as __namedExportsOrder,mn as default};
