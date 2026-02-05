import{j as t,r as u}from"./iframe-M9O-K8SB.js";import{d as g}from"./mocked-data1-Bs2nnhCk.js";import{t as ee,u as s,T as c,R as K,C as a,a as te,b as ne,c as G,d as le,s as f,e as Y,f as v,g as C}from"./utils-BtExbgr9.js";import{S as X}from"./SearchField-DWbSv7at.js";import{F as J}from"./Flex-Bz2InqMs.js";import{B as ae}from"./Button-BbTpZl37.js";import{S as oe}from"./Select-CLJvQpV8.js";import"./preload-helper-PPVm8Dsz.js";import"./useStyles-BRwt6BXn.js";import"./clsx-B-dksMZM.js";import"./SelectionManager-AOhnTTKk.js";import"./useFocusable-BwFERnd_.js";import"./useObjectRef-BPFp5snO.js";import"./useEvent-BRbGx-1q.js";import"./SelectionIndicator-yhlvspp_.js";import"./context-Bv6kxITJ.js";import"./usePress-ByOsZuB9.js";import"./Hidden-DTd05gNK.js";import"./useControlledState-DzBnLbpE.js";import"./index-BKJKY9Wv.js";import"./Checkbox-DhqAra5M.js";import"./RSPContexts-BdpIjeVF.js";import"./utils-BXllfVt4.js";import"./Form-BBJy9cFl.js";import"./useToggle-BKqGrEu-.js";import"./useFormReset-DJISnqgL.js";import"./useToggleState-O3dGrC2P.js";import"./useFocusRing-COnCKKka.js";import"./VisuallyHidden-BvkZfodz.js";import"./InternalLinkProvider-Bi_DmABW.js";import"./index-CuiKZooy.js";import"./VisuallyHidden-CNdUZnnh.js";import"./TablePagination-DO4pHlE_.js";import"./ButtonIcon-CDy8Bm8x.js";import"./Button-Dkbd3KcU.js";import"./Label-o9S_v-xF.js";import"./useLabel-COjMvP6r.js";import"./useLabels-C3g0X61E.js";import"./useButton-F9hepFpV.js";import"./defineComponent-BmABoWOu.js";import"./useSurface-CJaN3YoD.js";import"./Text-RD33cT1s.js";import"./Link-DZChSlvh.js";import"./useLink-B9gmuu0v.js";import"./Avatar-xG2q_nzt.js";import"./ListBox-B40TMSiq.js";import"./Separator-CPZLX6dD.js";import"./Text-B7PuQZMK.js";import"./useListState-DtLAZGwv.js";import"./OverlayArrow-CcKR7RW9.js";import"./useHighlightSelectionDescription-R_dBsfQd.js";import"./useLocalizedStringFormatter-C4c9cZU5.js";import"./useHasTabbableChild-D6MbJ94R.js";import"./Input-MCe13Yrn.js";import"./useField-BgIPqRrs.js";import"./SearchField-DGocqKEX.js";import"./FieldError-BifbfugT.js";import"./FieldLabel-Dm8Ex6MU.js";import"./FieldError-Dr6Rp0Rr.js";import"./Dialog-DGmZero8.js";import"./animation-D5pTcXzL.js";import"./Popover.module-CIIeSXYs.js";import"./Autocomplete-Ce9rXoi_.js";const bt={title:"Backstage UI/Table/dev",...ee},j={render:()=>{const l=[{id:"name",label:"Name",isRowHeader:!0,defaultWidth:"4fr",cell:e=>t.jsx(a,{title:e.name,description:e.description})},{id:"owner",label:"Owner",defaultWidth:"1fr",cell:e=>t.jsx(a,{title:e.owner.name})},{id:"type",label:"Type",defaultWidth:"1fr",cell:e=>t.jsx(a,{title:e.type})},{id:"lifecycle",label:"Lifecycle",defaultWidth:"1fr",cell:e=>t.jsx(a,{title:e.lifecycle})}],{tableProps:n}=s({mode:"complete",getData:()=>g,paginationOptions:{pageSize:5}});return t.jsx(c,{columnConfig:l,...n})}},P={render:()=>{const l=[{id:"name",label:"Name",isRowHeader:!0,cell:e=>t.jsx(a,{title:e.name}),isSortable:!0},{id:"owner",label:"Owner",cell:e=>t.jsx(a,{title:e.owner.name}),isSortable:!0},{id:"type",label:"Type",cell:e=>t.jsx(a,{title:e.type}),isSortable:!0},{id:"lifecycle",label:"Lifecycle",cell:e=>t.jsx(a,{title:e.lifecycle}),isSortable:!0}],{tableProps:n}=s({mode:"complete",getData:()=>g,paginationOptions:{pageSize:5},initialSort:{column:"name",direction:"ascending"},sortFn:(e,{column:o,direction:i})=>[...e].sort((m,d)=>{let r,b;o==="name"?(r=m.name,b=d.name):o==="owner"?(r=m.owner.name,b=d.owner.name):o==="type"?(r=m.type,b=d.type):(r=m.lifecycle,b=d.lifecycle);const y=r.localeCompare(b);return i==="descending"?-y:y})});return t.jsx(c,{columnConfig:l,...n})}},D={render:()=>{const l=[{id:"name",label:"Name",isRowHeader:!0,cell:o=>t.jsx(a,{title:o.name}),isSortable:!0},{id:"owner",label:"Owner",cell:o=>t.jsx(a,{title:o.owner.name})},{id:"type",label:"Type",cell:o=>t.jsx(a,{title:o.type})}],{tableProps:n,search:e}=s({mode:"complete",getData:()=>g,paginationOptions:{pageSize:5},searchFn:(o,i)=>{const m=i.toLowerCase();return o.filter(d=>d.name.toLowerCase().includes(m)||d.owner.name.toLowerCase().includes(m)||d.type.toLowerCase().includes(m))}});return t.jsxs("div",{children:[t.jsx(X,{"aria-label":"Search",placeholder:"Search...",style:{marginBottom:"16px"},...e}),t.jsx(c,{columnConfig:l,emptyState:e.value?t.jsx("div",{children:"No results found"}):t.jsx("div",{children:"No data available"}),...n})]})}},O={render:()=>{const[l,n]=u.useState(new Set),e=[{id:"name",label:"Name",isRowHeader:!0,cell:i=>t.jsx(a,{title:i.name})},{id:"owner",label:"Owner",cell:i=>t.jsx(a,{title:i.owner.name})},{id:"type",label:"Type",cell:i=>t.jsx(a,{title:i.type})}],{tableProps:o}=s({mode:"complete",getData:()=>g,paginationOptions:{pageSize:5}});return t.jsx(c,{...o,columnConfig:e,selection:{mode:"multiple",selected:l,onSelectionChange:n}})}},R={render:()=>{const l=[{id:"name",label:"Band name",isRowHeader:!0,cell:e=>t.jsx(Y,{name:e.name,src:e.image})},{id:"genre",label:"Genre",cell:e=>t.jsx(a,{title:e.genre})},{id:"yearFormed",label:"Year formed",cell:e=>t.jsx(a,{title:e.yearFormed.toString()})}],{tableProps:n}=s({mode:"complete",getData:()=>v,paginationOptions:{pageSize:5}});return t.jsx(c,{...n,columnConfig:l,rowConfig:{getHref:e=>`/bands/${e.id}`}})}},z={render:()=>{const l=[{id:"name",label:"Name",isRowHeader:!0,cell:o=>t.jsx(a,{title:o.name})},{id:"type",label:"Type",cell:o=>t.jsx(a,{title:o.type})}],{tableProps:n,reload:e}=s({mode:"complete",getData:()=>g,paginationOptions:{pageSize:5}});return t.jsxs("div",{children:[t.jsx(ae,{onPress:()=>e(),children:"Refresh Data"}),t.jsx(c,{columnConfig:l,...n})]})}},L={render:()=>{const l=[{id:"name",label:"Name",isRowHeader:!0,cell:e=>t.jsx(a,{title:e.name})},{id:"owner",label:"Owner",cell:e=>t.jsx(a,{title:e.owner.name})},{id:"type",label:"Type",cell:e=>t.jsx(a,{title:e.type})}],{tableProps:n}=s({mode:"offset",getData:async({offset:e,pageSize:o})=>(await new Promise(i=>setTimeout(i,500)),{data:g.slice(e,e+o),totalCount:g.length}),paginationOptions:{pageSize:5}});return t.jsx(c,{columnConfig:l,...n})}},k={render:()=>{const l=[{id:"name",label:"Band name",isRowHeader:!0,cell:e=>t.jsx(Y,{name:e.name,src:e.image})},{id:"genre",label:"Genre",cell:e=>t.jsx(a,{title:e.genre})}],{tableProps:n}=s({mode:"cursor",getData:async({cursor:e,pageSize:o})=>{await new Promise(d=>setTimeout(d,500));const i=e?parseInt(e,10):0,m=i+o;return{data:v.slice(i,m),totalCount:v.length,nextCursor:m<v.length?String(m):void 0,prevCursor:i>0?String(Math.max(0,i-o)):void 0}},paginationOptions:{pageSize:5}});return t.jsx(c,{columnConfig:l,...n})}},H={render:()=>{const l=[{id:"name",label:"Name",isRowHeader:!0,cell:e=>t.jsx(a,{title:e.name})},{id:"type",label:"Type",cell:e=>t.jsx(a,{title:e.type})},{id:"lifecycle",label:"Lifecycle",cell:e=>t.jsx(a,{title:e.lifecycle})}],{tableProps:n}=s({mode:"complete",getData:()=>g,paginationOptions:{pageSize:5}});return t.jsx(c,{...n,columnConfig:l,rowConfig:({item:e})=>t.jsx(K,{id:String(e.id),columns:l,style:{background:e.lifecycle==="experimental"?"var(--bui-bg-warning)":void 0,borderLeft:e.lifecycle==="experimental"?"3px solid var(--bui-fg-warning)":"3px solid transparent"},children:o=>t.jsx(u.Fragment,{children:o.id==="name"?t.jsx(a,{title:e.name,description:e.description}):o.cell(e)},o.id)})})}},N={render:()=>{const l=g.slice(0,5);return t.jsxs(te,{children:[t.jsxs(ne,{children:[t.jsx(G,{isRowHeader:!0,children:"Name"}),t.jsx(G,{children:"Owner"}),t.jsx(G,{children:"Type"})]}),t.jsx(le,{children:l.map(n=>t.jsxs(K,{id:String(n.id),children:[t.jsx(a,{title:n.name}),t.jsx(a,{title:n.owner.name}),t.jsx(a,{title:n.type})]},n.id))})]})}},V={render:()=>{const l=[{id:"name",label:"Band name",isRowHeader:!0,cell:e=>t.jsx(Y,{name:e.name,src:e.image,href:e.website})},{id:"genre",label:"Genre",cell:e=>t.jsx(a,{title:e.genre})},{id:"yearFormed",label:"Year formed",cell:e=>t.jsx(a,{title:e.yearFormed.toString()})},{id:"albums",label:"Albums",cell:e=>t.jsx(a,{title:e.albums.toString()})}],{tableProps:n}=s({mode:"complete",getData:()=>v,paginationOptions:{pageSize:5}});return t.jsx(c,{...n,columnConfig:l,rowConfig:{onClick:e=>alert(`Clicked: ${e.name}`)}})}},F={render:()=>{const[l,n]=u.useState(new Set),{tableProps:e}=s({mode:"complete",getData:()=>C,paginationOptions:{pageSize:10}});return t.jsx(c,{...e,columnConfig:f,selection:{mode:"single",behavior:"toggle",selected:l,onSelectionChange:n}})}},I={render:()=>{const[l,n]=u.useState(new Set),{tableProps:e}=s({mode:"complete",getData:()=>C,paginationOptions:{pageSize:10}});return t.jsx(c,{...e,columnConfig:f,selection:{mode:"multiple",behavior:"toggle",selected:l,onSelectionChange:n}})}},W={render:()=>{const[l,n]=u.useState(new Set),{tableProps:e}=s({mode:"complete",getData:()=>C,paginationOptions:{pageSize:10}});return t.jsx(c,{...e,columnConfig:f,selection:{mode:"multiple",behavior:"toggle",selected:l,onSelectionChange:n},rowConfig:{onClick:o=>alert(`Clicked: ${o.name}`)}})}},B={render:()=>{const[l,n]=u.useState(new Set),{tableProps:e}=s({mode:"complete",getData:()=>C,paginationOptions:{pageSize:10}});return t.jsx(c,{...e,columnConfig:f,selection:{mode:"multiple",behavior:"toggle",selected:l,onSelectionChange:n},rowConfig:{getHref:o=>`/items/${o.id}`}})}},$={render:()=>{const[l,n]=u.useState(new Set),{tableProps:e}=s({mode:"complete",getData:()=>g,paginationOptions:{pageSize:5}}),o=[{id:"name",label:"Name",isRowHeader:!0,cell:i=>t.jsx(a,{title:i.name})},{id:"owner",label:"Owner",cell:i=>t.jsx(a,{title:i.owner.name})},{id:"type",label:"Type",cell:i=>t.jsx(a,{title:i.type})}];return t.jsx(c,{...e,columnConfig:o,selection:{mode:"multiple",behavior:"toggle",selected:l,onSelectionChange:n}})}},M={render:()=>{const[l,n]=u.useState(new Set),{tableProps:e}=s({mode:"complete",getData:()=>C,paginationOptions:{pageSize:10}});return t.jsx(c,{...e,columnConfig:f,selection:{mode:"single",behavior:"replace",selected:l,onSelectionChange:n}})}},A={render:()=>{const[l,n]=u.useState(new Set),{tableProps:e}=s({mode:"complete",getData:()=>C,paginationOptions:{pageSize:10}});return t.jsx(c,{...e,columnConfig:f,selection:{mode:"multiple",behavior:"replace",selected:l,onSelectionChange:n}})}},q={render:()=>{const[l,n]=u.useState(new Set),{tableProps:e}=s({mode:"complete",getData:()=>C,paginationOptions:{pageSize:10}});return t.jsx(c,{...e,columnConfig:f,selection:{mode:"multiple",behavior:"replace",selected:l,onSelectionChange:n},rowConfig:{onClick:o=>alert(`Opening ${o.name}`)}})}},Q={render:()=>{const[l,n]=u.useState(new Set),{tableProps:e}=s({mode:"complete",getData:()=>C,paginationOptions:{pageSize:10}});return t.jsx(c,{...e,columnConfig:f,selection:{mode:"multiple",behavior:"replace",selected:l,onSelectionChange:n},rowConfig:{getHref:o=>`/items/${o.id}`}})}},T={render:()=>{const[l,n]=u.useState(new Set),e=[{value:"",label:"All types"},{value:"service",label:"Service"},{value:"website",label:"Website"},{value:"library",label:"Library"},{value:"documentation",label:"Documentation"},{value:"other",label:"Other"}],o=[{id:"name",label:"Name",isRowHeader:!0,isSortable:!0,cell:r=>t.jsx(a,{title:r.name,description:r.description})},{id:"owner",label:"Owner",isSortable:!0,cell:r=>t.jsx(a,{title:r.owner.name})},{id:"type",label:"Type",isSortable:!0,cell:r=>t.jsx(a,{title:r.type})},{id:"lifecycle",label:"Lifecycle",isSortable:!0,cell:r=>t.jsx(a,{title:r.lifecycle})}],{tableProps:i,search:m,filter:d}=s({mode:"offset",initialSort:{column:"name",direction:"ascending"},getData:async({offset:r,pageSize:b,sort:y,filter:E,search:_})=>{const Z=Math.floor(r/b)+1;await new Promise(p=>setTimeout(p,300*Z));let w=[...g];if(_){const p=_.toLowerCase();w=w.filter(S=>S.name.toLowerCase().includes(p)||S.owner.name.toLowerCase().includes(p)||S.description?.toLowerCase().includes(p))}return E?.type&&(w=w.filter(p=>p.type===E.type)),y&&w.sort((p,S)=>{let x,h;switch(y.column){case"owner":x=p.owner.name,h=S.owner.name;break;case"type":x=p.type,h=S.type;break;case"lifecycle":x=p.lifecycle,h=S.lifecycle;break;default:x=p.name,h=S.name}const U=x.localeCompare(h);return y.direction==="descending"?-U:U}),{data:w.slice(r,r+b),totalCount:w.length}},paginationOptions:{pageSize:10}});return t.jsxs(J,{direction:"column",gap:"4",children:[t.jsxs(J,{gap:"4",align:"end",children:[t.jsx(X,{"aria-label":"Search",label:"Search",placeholder:"Search by name, owner, or description...",style:{width:300},...m}),t.jsx(oe,{label:"Type",options:e,value:d.value?.type??"",onChange:r=>d.onChange({type:r===""?null:String(r)}),style:{width:180}})]}),t.jsx(c,{...i,columnConfig:o,selection:{mode:"multiple",behavior:"toggle",selected:l,onSelectionChange:n},emptyState:m.value||d.value?.type?t.jsx("div",{children:"No results match your filters"}):t.jsx("div",{children:"No data available"})})]})}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => {
    const columns: ColumnConfig<Data1Item>[] = [{
      id: 'name',
      label: 'Name',
      isRowHeader: true,
      defaultWidth: '4fr',
      cell: item => <CellText title={item.name} description={item.description} />
    }, {
      id: 'owner',
      label: 'Owner',
      defaultWidth: '1fr',
      cell: item => <CellText title={item.owner.name} />
    }, {
      id: 'type',
      label: 'Type',
      defaultWidth: '1fr',
      cell: item => <CellText title={item.type} />
    }, {
      id: 'lifecycle',
      label: 'Lifecycle',
      defaultWidth: '1fr',
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
}`,...I.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
- Type filter dropdown`,...T.parameters?.docs?.description}}};const St=["BasicLocalData","Sorting","Search","Selection","RowLinks","Reload","ServerSidePaginationOffset","ServerSidePaginationCursor","CustomRowRender","AtomicComponents","RowClick","SelectionSingleToggle","SelectionMultiToggle","SelectionWithRowClick","SelectionWithRowLinks","SelectionWithPagination","SelectionSingleReplace","SelectionMultiReplace","SelectionReplaceWithRowClick","SelectionReplaceWithRowLinks","ComprehensiveServerSide"];export{N as AtomicComponents,j as BasicLocalData,T as ComprehensiveServerSide,H as CustomRowRender,z as Reload,V as RowClick,R as RowLinks,D as Search,O as Selection,A as SelectionMultiReplace,I as SelectionMultiToggle,q as SelectionReplaceWithRowClick,Q as SelectionReplaceWithRowLinks,M as SelectionSingleReplace,F as SelectionSingleToggle,$ as SelectionWithPagination,W as SelectionWithRowClick,B as SelectionWithRowLinks,k as ServerSidePaginationCursor,L as ServerSidePaginationOffset,P as Sorting,St as __namedExportsOrder,bt as default};
