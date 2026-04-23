import{j as n,r as u}from"./iframe-izSSIzTR.js";import{t as le,s as f,d as g,a as v,b as y}from"./utils-CO8YdtHq.js";import{T as ae,a as oe,C as Y,b as ie,R as ee,c as o,u as r,d as s,e as U}from"./useTable-C4SLEIIJ.js";import{F as Z}from"./Flex-BmgJK1W7.js";import{S as ne}from"./SearchField-Bf1mIdEP.js";import{S as re}from"./Select-D1HLj3Pf.js";import{B as se}from"./Button-CEAPsvwC.js";import"./preload-helper-PPVm8Dsz.js";import"./BUIProvider-DHm8fNVT.js";import"./openLink-BZ37FDEF.js";import"./useResolvedHref-537MV3he.js";import"./useObjectRef-DA7QflCc.js";import"./Virtualizer-DdXV22pZ.js";import"./useCollection-DuuVA1d_.js";import"./useGlobalListeners-CynQJlR4.js";import"./Hidden-Z1-_rzje.js";import"./keyboard-PuRhgdyi.js";import"./FocusScope-C430Nj-p.js";import"./useEvent-C6O8PQe-.js";import"./I18nProvider-Dt5oCbl9.js";import"./usePress-BYzppgbW.js";import"./textSelection-DP5PjHic.js";import"./useControlledState-Bla-K4z3.js";import"./useOverlayTriggerState-b9H8BJqN.js";import"./utils-Cl9gINrl.js";import"./number-CfXc65k1.js";import"./index-DGFCpqz_.js";import"./Checkbox-D3DBdVGP.js";import"./Checkbox-C5aDsmm2.js";import"./FieldError-bPDpl4tm.js";import"./Text-B7PTVtbA.js";import"./useFormValidation-KKy4svAa.js";import"./Label-DiQKndYJ.js";import"./useField-Ds3mC8xn.js";import"./useLabel-C1C1CBQ9.js";import"./useLabels-DlA16iH6.js";import"./useHover-Dn05tM4n.js";import"./useToggle-D4fs1OlL.js";import"./useFormReset-BRuBz3cs.js";import"./useToggleState-BcHASl55.js";import"./VisuallyHidden-g7Ve-a9e.js";import"./Skeleton-IePTMuvz.js";import"./VisuallyHidden-fqiYK_EK.js";import"./TablePagination-BMdS1P5o.js";import"./Text-DdqvwTvZ.js";import"./ButtonIcon-BYMJLASR.js";import"./Button-CxBdRGKu.js";import"./useButton-cd_LBPNR.js";import"./Link-DbKfI0xJ.js";import"./useLink-BpjYw728.js";import"./getNodeText-D1CWbkC0.js";import"./ListBox-DB9taT5i.js";import"./getItemCount-CRf65XBI.js";import"./Autocomplete-CUty0TUf.js";import"./useLocalizedStringFormatter-CbcXejhq.js";import"./useListState-DmOJF73R.js";import"./useHighlightSelectionDescription-OtK2cKeS.js";import"./useUpdateEffect-lSF6CSSi.js";import"./useHasTabbableChild-CkhPe9Wm.js";import"./useGridSelectionCheckbox-BGeoFbBp.js";import"./Avatar-CEsHWO1Z.js";import"./Input-DB8OS-O0.js";import"./SearchField-C-1h_s6-.js";import"./useTextField-D2DQSV74.js";import"./FieldLabel-F6-7fl6A.js";import"./FieldError-ehaVnJGD.js";import"./Dialog-0jMX3lLJ.js";import"./Heading-DYvyXDrA.js";import"./animation-CuZPc9sJ.js";import"./definition-CkLKpoaa.js";import"./useFilter-HT3pDS3J.js";const Pn={title:"Backstage UI/Table/dev",...le},j={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,defaultWidth:"4fr",cell:e=>n.jsx(o,{title:e.name,description:e.description})},{id:"owner",label:"Owner",defaultWidth:"1fr",cell:e=>n.jsx(o,{title:e.owner.name})},{id:"type",label:"Type",defaultWidth:"1fr",cell:e=>n.jsx(o,{title:e.type})},{id:"lifecycle",label:"Lifecycle",defaultWidth:"1fr",cell:e=>n.jsx(o,{title:e.lifecycle})}],{tableProps:l}=r({mode:"complete",getData:()=>g,paginationOptions:{pageSize:5}});return n.jsx(s,{columnConfig:a,...l})}},D={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:e=>n.jsx(o,{title:e.name}),isSortable:!0},{id:"owner",label:"Owner",cell:e=>n.jsx(o,{title:e.owner.name}),isSortable:!0},{id:"type",label:"Type",cell:e=>n.jsx(o,{title:e.type}),isSortable:!0},{id:"lifecycle",label:"Lifecycle",cell:e=>n.jsx(o,{title:e.lifecycle}),isSortable:!0}],{tableProps:l}=r({mode:"complete",getData:()=>g,paginationOptions:{pageSize:5},initialSort:{column:"name",direction:"ascending"},sortFn:(e,{column:t,direction:i})=>[...e].sort((m,p)=>{let c,b;t==="name"?(c=m.name,b=p.name):t==="owner"?(c=m.owner.name,b=p.owner.name):t==="type"?(c=m.type,b=p.type):(c=m.lifecycle,b=p.lifecycle);const C=c.localeCompare(b);return i==="descending"?-C:C})});return n.jsx(s,{columnConfig:a,...l})}},P={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>n.jsx(o,{title:t.name}),isSortable:!0},{id:"owner",label:"Owner",cell:t=>n.jsx(o,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>n.jsx(o,{title:t.type})}],{tableProps:l,search:e}=r({mode:"complete",getData:()=>g,paginationOptions:{pageSize:5},searchFn:(t,i)=>{const m=i.toLowerCase();return t.filter(p=>p.name.toLowerCase().includes(m)||p.owner.name.toLowerCase().includes(m)||p.type.toLowerCase().includes(m))}});return n.jsxs("div",{children:[n.jsx(ne,{"aria-label":"Search",placeholder:"Search...",style:{marginBottom:"16px"},...e}),n.jsx(s,{columnConfig:a,emptyState:e.value?n.jsx("div",{children:"No results found"}):n.jsx("div",{children:"No data available"}),...l})]})}},O={render:()=>{const[a,l]=u.useState(new Set),e=[{id:"name",label:"Name",isRowHeader:!0,cell:i=>n.jsx(o,{title:i.name})},{id:"owner",label:"Owner",cell:i=>n.jsx(o,{title:i.owner.name})},{id:"type",label:"Type",cell:i=>n.jsx(o,{title:i.type})}],{tableProps:t}=r({mode:"complete",getData:()=>g,paginationOptions:{pageSize:5}});return n.jsx(s,{...t,columnConfig:e,selection:{mode:"multiple",selected:a,onSelectionChange:l}})}},R={render:()=>{const a=[{id:"name",label:"Band name",isRowHeader:!0,cell:e=>n.jsx(U,{name:e.name,src:e.image})},{id:"genre",label:"Genre",cell:e=>n.jsx(o,{title:e.genre})},{id:"yearFormed",label:"Year formed",cell:e=>n.jsx(o,{title:e.yearFormed.toString()})}],{tableProps:l}=r({mode:"complete",getData:()=>v,paginationOptions:{pageSize:5}});return n.jsx(s,{...l,columnConfig:a,rowConfig:{getHref:e=>`/bands/${e.id}`}})}},z={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>n.jsx(o,{title:t.name})},{id:"type",label:"Type",cell:t=>n.jsx(o,{title:t.type})}],{tableProps:l,reload:e}=r({mode:"complete",getData:()=>g,paginationOptions:{pageSize:5}});return n.jsxs("div",{children:[n.jsx(se,{onPress:()=>e(),children:"Refresh Data"}),n.jsx(s,{columnConfig:a,...l})]})}},H={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:e=>n.jsx(o,{title:e.name})},{id:"owner",label:"Owner",cell:e=>n.jsx(o,{title:e.owner.name})},{id:"type",label:"Type",cell:e=>n.jsx(o,{title:e.type})}],{tableProps:l}=r({mode:"offset",getData:async({offset:e,pageSize:t})=>(await new Promise(i=>setTimeout(i,500)),{data:g.slice(e,e+t),totalCount:g.length}),paginationOptions:{pageSize:5}});return n.jsx(s,{columnConfig:a,...l})}},L={render:()=>{const a=[{id:"name",label:"Band name",isRowHeader:!0,cell:e=>n.jsx(U,{name:e.name,src:e.image})},{id:"genre",label:"Genre",cell:e=>n.jsx(o,{title:e.genre})}],{tableProps:l}=r({mode:"cursor",getData:async({cursor:e,pageSize:t})=>{await new Promise(p=>setTimeout(p,500));const i=e?parseInt(e,10):0,m=i+t;return{data:v.slice(i,m),totalCount:v.length,nextCursor:m<v.length?String(m):void 0,prevCursor:i>0?String(Math.max(0,i-t)):void 0}},paginationOptions:{pageSize:5}});return n.jsx(s,{columnConfig:a,...l})}},k={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:e=>n.jsx(o,{title:e.name})},{id:"type",label:"Type",cell:e=>n.jsx(o,{title:e.type})},{id:"lifecycle",label:"Lifecycle",cell:e=>n.jsx(o,{title:e.lifecycle})}],{tableProps:l}=r({mode:"complete",getData:()=>g,paginationOptions:{pageSize:5}});return n.jsx(s,{...l,columnConfig:a,rowConfig:({item:e})=>n.jsx(ee,{id:String(e.id),columns:a,style:{background:e.lifecycle==="experimental"?"var(--bui-bg-warning)":void 0,borderLeft:e.lifecycle==="experimental"?"3px solid var(--bui-fg-warning)":"3px solid transparent"},children:t=>n.jsx(u.Fragment,{children:t.id==="name"?n.jsx(o,{title:e.name,description:e.description}):t.cell(e)},t.id)})})}},N={render:()=>{const a=g.slice(0,5);return n.jsxs(ae,{children:[n.jsxs(oe,{children:[n.jsx(Y,{isRowHeader:!0,children:"Name"}),n.jsx(Y,{children:"Owner"}),n.jsx(Y,{children:"Type"})]}),n.jsx(ie,{children:a.map(l=>n.jsxs(ee,{id:String(l.id),children:[n.jsx(o,{title:l.name}),n.jsx(o,{title:l.owner.name}),n.jsx(o,{title:l.type})]},l.id))})]})}},V={render:()=>{const a=[{id:"name",label:"Band name",isRowHeader:!0,cell:e=>n.jsx(U,{name:e.name,src:e.image,href:e.website})},{id:"genre",label:"Genre",cell:e=>n.jsx(o,{title:e.genre})},{id:"yearFormed",label:"Year formed",cell:e=>n.jsx(o,{title:e.yearFormed.toString()})},{id:"albums",label:"Albums",cell:e=>n.jsx(o,{title:e.albums.toString()})}],{tableProps:l}=r({mode:"complete",getData:()=>v,paginationOptions:{pageSize:5}});return n.jsx(s,{...l,columnConfig:a,rowConfig:{onClick:e=>alert(`Clicked: ${e.name}`)}})}},$={render:()=>{const[a,l]=u.useState(new Set),{tableProps:e}=r({mode:"complete",getData:()=>y,paginationOptions:{pageSize:10}});return n.jsx(s,{...e,columnConfig:f,selection:{mode:"single",behavior:"toggle",selected:a,onSelectionChange:l}})}},F={render:()=>{const[a,l]=u.useState(new Set),{tableProps:e}=r({mode:"complete",getData:()=>y,paginationOptions:{pageSize:10}});return n.jsx(s,{...e,columnConfig:f,selection:{mode:"multiple",behavior:"toggle",selected:a,onSelectionChange:l}})}},I={render:()=>{const[a,l]=u.useState(new Set),{tableProps:e}=r({mode:"complete",getData:()=>y,paginationOptions:{pageSize:10}});return n.jsx(s,{...e,columnConfig:f,selection:{mode:"multiple",behavior:"toggle",selected:a,onSelectionChange:l},rowConfig:{onClick:t=>alert(`Clicked: ${t.name}`)}})}},W={render:()=>{const[a,l]=u.useState(new Set),{tableProps:e}=r({mode:"complete",getData:()=>y,paginationOptions:{pageSize:10}});return n.jsx(s,{...e,columnConfig:f,selection:{mode:"multiple",behavior:"toggle",selected:a,onSelectionChange:l},rowConfig:{getHref:t=>`/items/${t.id}`}})}},B={render:()=>{const[a,l]=u.useState(new Set),{tableProps:e}=r({mode:"complete",getData:()=>g,paginationOptions:{pageSize:5}}),t=[{id:"name",label:"Name",isRowHeader:!0,cell:i=>n.jsx(o,{title:i.name})},{id:"owner",label:"Owner",cell:i=>n.jsx(o,{title:i.owner.name})},{id:"type",label:"Type",cell:i=>n.jsx(o,{title:i.type})}];return n.jsx(s,{...e,columnConfig:t,selection:{mode:"multiple",behavior:"toggle",selected:a,onSelectionChange:l}})}},A={render:()=>{const[a,l]=u.useState(new Set),{tableProps:e}=r({mode:"complete",getData:()=>y,paginationOptions:{pageSize:10}});return n.jsx(s,{...e,columnConfig:f,selection:{mode:"single",behavior:"replace",selected:a,onSelectionChange:l}})}},M={render:()=>{const[a,l]=u.useState(new Set),{tableProps:e}=r({mode:"complete",getData:()=>y,paginationOptions:{pageSize:10}});return n.jsx(s,{...e,columnConfig:f,selection:{mode:"multiple",behavior:"replace",selected:a,onSelectionChange:l}})}},_={render:()=>{const[a,l]=u.useState(new Set),{tableProps:e}=r({mode:"complete",getData:()=>y,paginationOptions:{pageSize:10}});return n.jsx(s,{...e,columnConfig:f,selection:{mode:"multiple",behavior:"replace",selected:a,onSelectionChange:l},rowConfig:{onClick:t=>alert(`Opening ${t.name}`)}})}},q={render:()=>{const[a,l]=u.useState(new Set),{tableProps:e}=r({mode:"complete",getData:()=>y,paginationOptions:{pageSize:10}});return n.jsx(s,{...e,columnConfig:f,selection:{mode:"multiple",behavior:"replace",selected:a,onSelectionChange:l},rowConfig:{getHref:t=>`/items/${t.id}`}})}},Q={render:()=>{const a=Array.from({length:500},(t,i)=>({id:String(i),name:`Service ${i}`,owner:{name:`Team ${i%10}`},type:["service","website","library"][i%3],lifecycle:["production","experimental"][i%2],description:`Description for service ${i}`})),l=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>n.jsx(o,{title:t.name,description:t.description})},{id:"owner",label:"Owner",cell:t=>n.jsx(o,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>n.jsx(o,{title:t.type})}],{tableProps:e}=r({mode:"complete",getData:()=>a,paginationOptions:{pageSize:50}});return n.jsx(s,{columnConfig:l,...e,virtualized:!0,style:{height:400}})}},G={render:()=>{const a=Array.from({length:500},(t,i)=>({id:String(i),name:`Service ${i}`,owner:{name:`Team ${i%10}`},type:["service","website","library"][i%3],lifecycle:["production","experimental"][i%2],description:`Description for service ${i}`})),l=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>n.jsx(o,{title:t.name,description:t.description})},{id:"owner",label:"Owner",cell:t=>n.jsx(o,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>n.jsx(o,{title:t.type})}],{tableProps:e}=r({mode:"complete",getData:()=>a,paginationOptions:{pageSize:50}});return n.jsx(s,{columnConfig:l,...e,virtualized:{rowHeight:56},style:{height:400}})}},E={render:()=>{const a=Array.from({length:500},(t,i)=>({id:String(i),name:`Service ${i}`,owner:{name:`Team ${i%10}`},type:["service","website","library"][i%3],lifecycle:["production","experimental"][i%2],description:i%5===0?`This is a much longer description for service ${i} that spans multiple lines to demonstrate variable height row rendering in the virtualized table`:`Description for service ${i}`})),l=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>n.jsx(o,{title:t.name,description:t.description})},{id:"owner",label:"Owner",cell:t=>n.jsx(o,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>n.jsx(o,{title:t.type})}],{tableProps:e}=r({mode:"complete",getData:()=>a,paginationOptions:{pageSize:50}});return n.jsx(s,{columnConfig:l,...e,virtualized:{estimatedRowHeight:48},style:{height:400}})}},T={render:()=>{const[a,l]=u.useState(new Set),e=[{value:"",label:"All types"},{value:"service",label:"Service"},{value:"website",label:"Website"},{value:"library",label:"Library"},{value:"documentation",label:"Documentation"},{value:"other",label:"Other"}],t=[{id:"name",label:"Name",isRowHeader:!0,isSortable:!0,cell:c=>n.jsx(o,{title:c.name,description:c.description})},{id:"owner",label:"Owner",isSortable:!0,cell:c=>n.jsx(o,{title:c.owner.name})},{id:"type",label:"Type",isSortable:!0,cell:c=>n.jsx(o,{title:c.type})},{id:"lifecycle",label:"Lifecycle",isSortable:!0,cell:c=>n.jsx(o,{title:c.lifecycle})}],{tableProps:i,search:m,filter:p}=r({mode:"offset",initialSort:{column:"name",direction:"ascending"},getData:async({offset:c,pageSize:b,sort:C,filter:J,search:K})=>{const te=Math.floor(c/b)+1;await new Promise(d=>setTimeout(d,300*te));let w=[...g];if(K){const d=K.toLowerCase();w=w.filter(S=>S.name.toLowerCase().includes(d)||S.owner.name.toLowerCase().includes(d)||S.description?.toLowerCase().includes(d))}return J?.type&&(w=w.filter(d=>d.type===J.type)),C&&w.sort((d,S)=>{let h,x;switch(C.column){case"owner":h=d.owner.name,x=S.owner.name;break;case"type":h=d.type,x=S.type;break;case"lifecycle":h=d.lifecycle,x=S.lifecycle;break;default:h=d.name,x=S.name}const X=h.localeCompare(x);return C.direction==="descending"?-X:X}),{data:w.slice(c,c+b),totalCount:w.length}},paginationOptions:{pageSize:10}});return n.jsxs(Z,{direction:"column",gap:"4",children:[n.jsxs(Z,{gap:"4",align:"end",children:[n.jsx(ne,{"aria-label":"Search",label:"Search",placeholder:"Search by name, owner, or description...",style:{width:300},...m}),n.jsx(re,{label:"Type",options:e,value:p.value?.type??"",onChange:c=>p.onChange({type:c===""?null:String(c)}),style:{width:180}})]}),n.jsx(s,{...i,columnConfig:t,selection:{mode:"multiple",behavior:"toggle",selected:a,onSelectionChange:l},emptyState:m.value||p.value?.type?n.jsx("div",{children:"No results match your filters"}):n.jsx("div",{children:"No data available"})})]})}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
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
}`,...P.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...V.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
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
    }} rowConfig={{
      onClick: item => alert(\`Clicked: \${item.name}\`)
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
      getHref: item => \`/items/\${item.id}\`
    }} />;
  }
}`,...W.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  render: () => {
    const largeData = Array.from({
      length: 500
    }, (_, i) => ({
      id: String(i),
      name: \`Service \${i}\`,
      owner: {
        name: \`Team \${i % 10}\`
      },
      type: ['service', 'website', 'library'][i % 3],
      lifecycle: ['production', 'experimental'][i % 2],
      description: \`Description for service \${i}\`
    }));
    const columns: ColumnConfig<(typeof largeData)[0]>[] = [{
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
    }];
    const {
      tableProps
    } = useTable({
      mode: 'complete',
      getData: () => largeData,
      paginationOptions: {
        pageSize: 50
      }
    });
    return <Table columnConfig={columns} {...tableProps} virtualized style={{
      height: 400
    }} />;
  }
}`,...Q.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: () => {
    const largeData = Array.from({
      length: 500
    }, (_, i) => ({
      id: String(i),
      name: \`Service \${i}\`,
      owner: {
        name: \`Team \${i % 10}\`
      },
      type: ['service', 'website', 'library'][i % 3],
      lifecycle: ['production', 'experimental'][i % 2],
      description: \`Description for service \${i}\`
    }));
    const columns: ColumnConfig<(typeof largeData)[0]>[] = [{
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
    }];
    const {
      tableProps
    } = useTable({
      mode: 'complete',
      getData: () => largeData,
      paginationOptions: {
        pageSize: 50
      }
    });
    return <Table columnConfig={columns} {...tableProps} virtualized={{
      rowHeight: 56
    }} style={{
      height: 400
    }} />;
  }
}`,...G.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => {
    const largeData = Array.from({
      length: 500
    }, (_, i) => ({
      id: String(i),
      name: \`Service \${i}\`,
      owner: {
        name: \`Team \${i % 10}\`
      },
      type: ['service', 'website', 'library'][i % 3],
      lifecycle: ['production', 'experimental'][i % 2],
      description: i % 5 === 0 ? \`This is a much longer description for service \${i} that spans multiple lines to demonstrate variable height row rendering in the virtualized table\` : \`Description for service \${i}\`
    }));
    const columns: ColumnConfig<(typeof largeData)[0]>[] = [{
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
    }];
    const {
      tableProps
    } = useTable({
      mode: 'complete',
      getData: () => largeData,
      paginationOptions: {
        pageSize: 50
      }
    });
    return <Table columnConfig={columns} {...tableProps} virtualized={{
      estimatedRowHeight: 48
    }} style={{
      height: 400
    }} />;
  }
}`,...E.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
- Type filter dropdown`,...T.parameters?.docs?.description}}};const On=["BasicLocalData","Sorting","Search","Selection","RowLinks","Reload","ServerSidePaginationOffset","ServerSidePaginationCursor","CustomRowRender","AtomicComponents","RowClick","SelectionSingleToggle","SelectionMultiToggle","SelectionWithRowClick","SelectionWithRowLinks","SelectionWithPagination","SelectionSingleReplace","SelectionMultiReplace","SelectionReplaceWithRowClick","SelectionReplaceWithRowLinks","VirtualizedTable","VirtualizedWithCustomRowHeight","VirtualizedWithEstimatedRowHeight","ComprehensiveServerSide"];export{N as AtomicComponents,j as BasicLocalData,T as ComprehensiveServerSide,k as CustomRowRender,z as Reload,V as RowClick,R as RowLinks,P as Search,O as Selection,M as SelectionMultiReplace,F as SelectionMultiToggle,_ as SelectionReplaceWithRowClick,q as SelectionReplaceWithRowLinks,A as SelectionSingleReplace,$ as SelectionSingleToggle,B as SelectionWithPagination,I as SelectionWithRowClick,W as SelectionWithRowLinks,L as ServerSidePaginationCursor,H as ServerSidePaginationOffset,D as Sorting,Q as VirtualizedTable,G as VirtualizedWithCustomRowHeight,E as VirtualizedWithEstimatedRowHeight,On as __namedExportsOrder,Pn as default};
