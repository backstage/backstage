import{j as t,r as u}from"./iframe-BLrGTSaW.js";import{t as ie,d as p,s as f,a as v,b as y}from"./utils-CtfFs_Rb.js";import{T as oe,a as re,C as K,b as se,R as le,c as a,u as c,d as m,e as X}from"./useTable-bzR29DQs.js";import{F as ne}from"./Flex-hMrNBQCA.js";import{S as J}from"./SearchField-CW5dANIB.js";import{S as ce}from"./Select-CFdG8r_i.js";import{B as me}from"./Button-BHKVjaU3.js";import"./preload-helper-PPVm8Dsz.js";import"./TestRouter-aUMcUa6c.js";import"./index-CAEKkElr.js";import"./BUIProvider-DbVXx7ab.js";import"./useObjectRef-ZSOSKmjG.js";import"./Virtualizer-CIsShc4t.js";import"./useCollection-D37zMv_s.js";import"./useFocusRing-BB9hpzXx.js";import"./Hidden-mL7bCk3G.js";import"./keyboard-D3SBllk2.js";import"./getMetaValue-CAHBYg8p.js";import"./FocusScope-C-33xK2Z.js";import"./useEvent-C0Msdpds.js";import"./I18nProvider-q6Gkr_5S.js";import"./usePress-DBe51dZ5.js";import"./textSelection-DRK0jW1V.js";import"./useControlledState-DB6Fhmvl.js";import"./useOverlayTriggerState-BbSgKNtq.js";import"./utils-DY5RBqiV.js";import"./number-y3IrGTZu.js";import"./BUIRoutingProvider-DBWr1Axe.js";import"./index-Csl_cXug.js";import"./Checkbox-DK9pL5G4.js";import"./Checkbox-C0_uLdUs.js";import"./FieldError-4Ao0Q7ll.js";import"./Text-BojrXTqg.js";import"./Form-CUwMEZbK.js";import"./useFormValidation-DKsM2ztO.js";import"./Label-CubIRV2P.js";import"./useField-BDehp1MI.js";import"./useLabel-CLI3Xr7r.js";import"./useLabels-CSSt0rmf.js";import"./useToggle-D-nUVBuN.js";import"./useFormReset-Dw6LrR2q.js";import"./useSlot-CnKJnjfB.js";import"./useToggleState-C1svYYws.js";import"./useHover-SA74TXF1.js";import"./VisuallyHidden-Da6yBUmy.js";import"./Skeleton-CLWF7fRd.js";import"./Text-D5gP-IGT.js";import"./VisuallyHidden-DJ1P_bLd.js";import"./TablePagination-B_eBmSmp.js";import"./ButtonIcon-KOwfGuV9.js";import"./Button-DRJWcbqL.js";import"./useButton-DzeSStJg.js";import"./Link-BMLKSF9h.js";import"./useLink-B1t0RWWb.js";import"./getNodeText-BmvvdM47.js";import"./ListBox-CfCrhkUW.js";import"./useLoadMoreSentinel-zi8f4IaM.js";import"./Autocomplete-HxKAEOXF.js";import"./useLocalizedStringFormatter-DQdAryoN.js";import"./SelectionIndicator-P55eaM0I.js";import"./useListState-9pEU39WA.js";import"./useHighlightSelectionDescription-CcOO4bZ8.js";import"./useUpdateEffect-CuVSlhgn.js";import"./useHasTabbableChild-C39BSEln.js";import"./useGridSelectionCheckbox-CHkFCk7S.js";import"./useMove-Dmilfuw_.js";import"./Avatar-D-i9edD4.js";import"./Input-Cwi8rIcD.js";import"./SearchField-CG8SQMGH.js";import"./useTextField-ByHjNULi.js";import"./FieldLabel-BTnYHa4F.js";import"./FieldError-BklSVPo8.js";import"./Dialog-PPsdl47e.js";import"./Heading-Dk8FWKf-.js";import"./animation-BTuqI_dB.js";import"./useFilter-BVf2WfPH.js";import"./useCollectionAdapter-BwsQ_fCt.js";import"./Popover-CvLOCkSt.js";const $t={title:"Backstage UI/Table/dev",...ie,parameters:{docs:{description:{component:"Tables display structured data in rows and columns. Columns can support sorting, resizing, custom widths, and custom cell content."}}}},D={render:()=>{const i=[{id:"name",label:"Name",isRowHeader:!0,defaultWidth:"4fr",cell:e=>t.jsx(a,{title:e.name,description:e.description})},{id:"owner",label:"Owner",defaultWidth:"1fr",cell:e=>t.jsx(a,{title:e.owner.name})},{id:"type",label:"Type",defaultWidth:"1fr",cell:e=>t.jsx(a,{title:e.type})},{id:"lifecycle",label:"Lifecycle",defaultWidth:"1fr",cell:e=>t.jsx(a,{title:e.lifecycle})}],{tableProps:l}=c({mode:"complete",getData:()=>p,paginationOptions:{pageSize:5}});return t.jsx(m,{columnConfig:i,...l})}},j={render:()=>{const i=[{id:"name",label:"Name",isRowHeader:!0,isResizable:!0,defaultWidth:"3fr",minWidth:200,cell:e=>t.jsx(a,{title:e.name,description:e.description})},{id:"owner",label:"Owner",isResizable:!0,defaultWidth:"2fr",minWidth:120,maxWidth:300,cell:e=>t.jsx(a,{title:e.owner.name})},{id:"type",label:"Type",isResizable:!0,defaultWidth:"1fr",minWidth:80,maxWidth:200,cell:e=>t.jsx(a,{title:e.type})},{id:"lifecycle",label:"Lifecycle",isResizable:!0,defaultWidth:"1fr",minWidth:80,maxWidth:200,cell:e=>t.jsx(a,{title:e.lifecycle})}],{tableProps:l}=c({mode:"complete",getData:()=>p,paginationOptions:{pageSize:5}});return t.jsx(m,{columnConfig:i,...l})}},P={render:()=>{const i=[{id:"name",label:"Name",isRowHeader:!0,cell:e=>t.jsx(a,{title:e.name}),isSortable:!0},{id:"owner",label:"Owner",cell:e=>t.jsx(a,{title:e.owner.name}),isSortable:!0},{id:"type",label:"Type",cell:e=>t.jsx(a,{title:e.type}),isSortable:!0},{id:"lifecycle",label:"Lifecycle",cell:e=>t.jsx(a,{title:e.lifecycle}),isSortable:!0}],{tableProps:l}=c({mode:"complete",getData:()=>p,paginationOptions:{pageSize:5},initialSort:{column:"name",direction:"ascending"},sortFn:(e,{column:n,direction:o})=>[...e].sort((s,d)=>{let r,g;n==="name"?(r=s.name,g=d.name):n==="owner"?(r=s.owner.name,g=d.owner.name):n==="type"?(r=s.type,g=d.type):(r=s.lifecycle,g=d.lifecycle);const C=r.localeCompare(g);return o==="descending"?-C:C})});return t.jsx(m,{columnConfig:i,...l})}},R={render:()=>{const i=[{id:"name",label:"Name",isRowHeader:!0,cell:n=>t.jsx(a,{title:n.name}),isSortable:!0},{id:"owner",label:"Owner",cell:n=>t.jsx(a,{title:n.owner.name})},{id:"type",label:"Type",cell:n=>t.jsx(a,{title:n.type})}],{tableProps:l,search:e}=c({mode:"complete",getData:()=>p,paginationOptions:{pageSize:5},searchFn:(n,o)=>{const s=o.toLowerCase();return n.filter(d=>d.name.toLowerCase().includes(s)||d.owner.name.toLowerCase().includes(s)||d.type.toLowerCase().includes(s))}});return t.jsxs("div",{children:[t.jsx(J,{"aria-label":"Search",placeholder:"Search...",style:{marginBottom:"16px"},...e}),t.jsx(m,{columnConfig:i,emptyState:e.value?t.jsx("div",{children:"No results found"}):t.jsx("div",{children:"No data available"}),...l})]})}},O={render:()=>{const i=u.useMemo(()=>{const s=[];for(let d=0;d<50;d++)for(const r of p)s.push({...r,id:`${r.id}-${d}`});return s},[]),l=[{id:"name",label:"Name",isRowHeader:!0,cell:s=>t.jsx(a,{title:s.name})},{id:"owner",label:"Owner",cell:s=>t.jsx(a,{title:s.owner.name})},{id:"type",label:"Type",cell:s=>t.jsx(a,{title:s.type})}],e=(s,d)=>{const r=d.toLowerCase();return s.filter(g=>g.name.toLowerCase().includes(r)||g.owner.name.toLowerCase().includes(r)||g.type.toLowerCase().includes(r))},n=c({mode:"complete",data:i,paginationOptions:{pageSize:10},searchFn:e}),o=c({mode:"complete",data:i,paginationOptions:{pageSize:10},searchFn:e,searchDebounceMs:200});return t.jsxs("div",{style:{display:"grid",gap:"32px"},children:[t.jsxs("div",{children:[t.jsx("h3",{style:{marginBottom:"8px"},children:"Immediate (searchDebounceMs: 0)"}),t.jsx(J,{"aria-label":"Immediate search",placeholder:"Type to search...",style:{marginBottom:"16px"},...n.search}),t.jsx(m,{columnConfig:l,...n.tableProps})]}),t.jsxs("div",{children:[t.jsx("h3",{style:{marginBottom:"8px"},children:"Debounced (searchDebounceMs: 200)"}),t.jsx(J,{"aria-label":"Debounced search",placeholder:"Type to search...",style:{marginBottom:"16px"},...o.search}),t.jsx(m,{columnConfig:l,...o.tableProps})]})]})}},z={render:()=>{const[i,l]=u.useState(new Set),e=[{id:"name",label:"Name",isRowHeader:!0,cell:o=>t.jsx(a,{title:o.name})},{id:"owner",label:"Owner",cell:o=>t.jsx(a,{title:o.owner.name})},{id:"type",label:"Type",cell:o=>t.jsx(a,{title:o.type})}],{tableProps:n}=c({mode:"complete",getData:()=>p,paginationOptions:{pageSize:5}});return t.jsx(m,{...n,columnConfig:e,selection:{mode:"multiple",selected:i,onSelectionChange:l}})}},H={render:()=>{const i=[{id:"name",label:"Band name",isRowHeader:!0,cell:e=>t.jsx(X,{name:e.name,src:e.image})},{id:"genre",label:"Genre",cell:e=>t.jsx(a,{title:e.genre})},{id:"yearFormed",label:"Year formed",cell:e=>t.jsx(a,{title:e.yearFormed.toString()})}],{tableProps:l}=c({mode:"complete",getData:()=>v,paginationOptions:{pageSize:5}});return t.jsx(m,{...l,columnConfig:i,rowConfig:{getHref:e=>`/bands/${e.id}`}})}},W={render:()=>{const i=[{id:"name",label:"Name",isRowHeader:!0,cell:n=>t.jsx(a,{title:n.name})},{id:"type",label:"Type",cell:n=>t.jsx(a,{title:n.type})}],{tableProps:l,reload:e}=c({mode:"complete",getData:()=>p,paginationOptions:{pageSize:5}});return t.jsxs("div",{children:[t.jsx(me,{onPress:()=>e(),children:"Refresh Data"}),t.jsx(m,{columnConfig:i,...l})]})}},L={render:()=>{const i=[{id:"name",label:"Name",isRowHeader:!0,cell:e=>t.jsx(a,{title:e.name})},{id:"owner",label:"Owner",cell:e=>t.jsx(a,{title:e.owner.name})},{id:"type",label:"Type",cell:e=>t.jsx(a,{title:e.type})}],{tableProps:l}=c({mode:"offset",getData:async({offset:e,pageSize:n})=>(await new Promise(o=>setTimeout(o,500)),{data:p.slice(e,e+n),totalCount:p.length}),paginationOptions:{pageSize:5}});return t.jsx(m,{columnConfig:i,...l})}},N={render:()=>{const i=[{id:"name",label:"Band name",isRowHeader:!0,cell:e=>t.jsx(X,{name:e.name,src:e.image})},{id:"genre",label:"Genre",cell:e=>t.jsx(a,{title:e.genre})}],{tableProps:l}=c({mode:"cursor",getData:async({cursor:e,pageSize:n})=>{await new Promise(d=>setTimeout(d,500));const o=e?parseInt(e,10):0,s=o+n;return{data:v.slice(o,s),totalCount:v.length,nextCursor:s<v.length?String(s):void 0,prevCursor:o>0?String(Math.max(0,o-n)):void 0}},paginationOptions:{pageSize:5}});return t.jsx(m,{columnConfig:i,...l})}},$={render:()=>{const i=[{id:"name",label:"Name",isRowHeader:!0,cell:e=>t.jsx(a,{title:e.name})},{id:"type",label:"Type",cell:e=>t.jsx(a,{title:e.type})},{id:"lifecycle",label:"Lifecycle",cell:e=>t.jsx(a,{title:e.lifecycle})}],{tableProps:l}=c({mode:"complete",getData:()=>p,paginationOptions:{pageSize:5}});return t.jsx(m,{...l,columnConfig:i,rowConfig:({item:e})=>t.jsx(le,{id:String(e.id),columns:i,style:{background:e.lifecycle==="experimental"?"var(--bui-warning-bg-subdued)":void 0,borderLeft:e.lifecycle==="experimental"?"3px solid var(--bui-fg-warning)":"3px solid transparent"},children:n=>t.jsx(u.Fragment,{children:n.id==="name"?t.jsx(a,{title:e.name,description:e.description}):n.cell(e)},n.id)})})}},k={render:()=>{const i=p.slice(0,5);return t.jsxs(oe,{children:[t.jsxs(re,{children:[t.jsx(K,{isRowHeader:!0,children:"Name"}),t.jsx(K,{children:"Owner"}),t.jsx(K,{children:"Type"})]}),t.jsx(se,{children:i.map(l=>t.jsxs(le,{id:String(l.id),children:[t.jsx(a,{title:l.name}),t.jsx(a,{title:l.owner.name}),t.jsx(a,{title:l.type})]},l.id))})]})}},I={render:()=>{const i=[{id:"name",label:"Band name",isRowHeader:!0,cell:e=>t.jsx(X,{name:e.name,src:e.image,href:e.website})},{id:"genre",label:"Genre",cell:e=>t.jsx(a,{title:e.genre})},{id:"yearFormed",label:"Year formed",cell:e=>t.jsx(a,{title:e.yearFormed.toString()})},{id:"albums",label:"Albums",cell:e=>t.jsx(a,{title:e.albums.toString()})}],{tableProps:l}=c({mode:"complete",getData:()=>v,paginationOptions:{pageSize:5}});return t.jsx(m,{...l,columnConfig:i,rowConfig:{onClick:e=>alert(`Clicked: ${e.name}`)}})}},V={render:()=>{const[i,l]=u.useState(new Set),{tableProps:e}=c({mode:"complete",getData:()=>y,paginationOptions:{pageSize:10}});return t.jsx(m,{...e,columnConfig:f,selection:{mode:"single",behavior:"toggle",selected:i,onSelectionChange:l}})}},F={render:()=>{const[i,l]=u.useState(new Set),{tableProps:e}=c({mode:"complete",getData:()=>y,paginationOptions:{pageSize:10}});return t.jsx(m,{...e,columnConfig:f,selection:{mode:"multiple",behavior:"toggle",selected:i,onSelectionChange:l}})}},B={render:()=>{const[i,l]=u.useState(new Set),{tableProps:e}=c({mode:"complete",getData:()=>y,paginationOptions:{pageSize:10}});return t.jsx(m,{...e,columnConfig:f,selection:{mode:"multiple",behavior:"toggle",selected:i,onSelectionChange:l},rowConfig:{onClick:n=>alert(`Clicked: ${n.name}`)}})}},M={render:()=>{const[i,l]=u.useState(new Set),{tableProps:e}=c({mode:"complete",getData:()=>y,paginationOptions:{pageSize:10}});return t.jsx(m,{...e,columnConfig:f,selection:{mode:"multiple",behavior:"toggle",selected:i,onSelectionChange:l},rowConfig:{getHref:n=>`/items/${n.id}`}})}},A={render:()=>{const[i,l]=u.useState(new Set),{tableProps:e}=c({mode:"complete",getData:()=>p,paginationOptions:{pageSize:5}}),n=[{id:"name",label:"Name",isRowHeader:!0,cell:o=>t.jsx(a,{title:o.name})},{id:"owner",label:"Owner",cell:o=>t.jsx(a,{title:o.owner.name})},{id:"type",label:"Type",cell:o=>t.jsx(a,{title:o.type})}];return t.jsx(m,{...e,columnConfig:n,selection:{mode:"multiple",behavior:"toggle",selected:i,onSelectionChange:l}})}},Q={render:()=>{const[i,l]=u.useState(new Set),{tableProps:e}=c({mode:"complete",getData:()=>y,paginationOptions:{pageSize:10}});return t.jsx(m,{...e,columnConfig:f,selection:{mode:"single",behavior:"replace",selected:i,onSelectionChange:l}})}},q={render:()=>{const[i,l]=u.useState(new Set),{tableProps:e}=c({mode:"complete",getData:()=>y,paginationOptions:{pageSize:10}});return t.jsx(m,{...e,columnConfig:f,selection:{mode:"multiple",behavior:"replace",selected:i,onSelectionChange:l}})}},_={render:()=>{const[i,l]=u.useState(new Set),{tableProps:e}=c({mode:"complete",getData:()=>y,paginationOptions:{pageSize:10}});return t.jsx(m,{...e,columnConfig:f,selection:{mode:"multiple",behavior:"replace",selected:i,onSelectionChange:l},rowConfig:{onClick:n=>alert(`Opening ${n.name}`)}})}},G={render:()=>{const[i,l]=u.useState(new Set),{tableProps:e}=c({mode:"complete",getData:()=>y,paginationOptions:{pageSize:10}});return t.jsx(m,{...e,columnConfig:f,selection:{mode:"multiple",behavior:"replace",selected:i,onSelectionChange:l},rowConfig:{getHref:n=>`/items/${n.id}`}})}},E={render:()=>{const i=Array.from({length:500},(n,o)=>({id:String(o),name:`Service ${o}`,owner:{name:`Team ${o%10}`},type:["service","website","library"][o%3],lifecycle:["production","experimental"][o%2],description:`Description for service ${o}`})),l=[{id:"name",label:"Name",isRowHeader:!0,cell:n=>t.jsx(a,{title:n.name,description:n.description})},{id:"owner",label:"Owner",cell:n=>t.jsx(a,{title:n.owner.name})},{id:"type",label:"Type",cell:n=>t.jsx(a,{title:n.type})}],{tableProps:e}=c({mode:"complete",getData:()=>i,paginationOptions:{pageSize:50}});return t.jsx(m,{columnConfig:l,...e,virtualized:!0,style:{height:400}})}},Y={render:()=>{const i=Array.from({length:500},(n,o)=>({id:String(o),name:`Service ${o}`,owner:{name:`Team ${o%10}`},type:["service","website","library"][o%3],lifecycle:["production","experimental"][o%2],description:`Description for service ${o}`})),l=[{id:"name",label:"Name",isRowHeader:!0,cell:n=>t.jsx(a,{title:n.name,description:n.description})},{id:"owner",label:"Owner",cell:n=>t.jsx(a,{title:n.owner.name})},{id:"type",label:"Type",cell:n=>t.jsx(a,{title:n.type})}],{tableProps:e}=c({mode:"complete",getData:()=>i,paginationOptions:{pageSize:50}});return t.jsx(m,{columnConfig:l,...e,virtualized:{rowHeight:56},style:{height:400}})}},U={render:()=>{const i=Array.from({length:500},(n,o)=>({id:String(o),name:`Service ${o}`,owner:{name:`Team ${o%10}`},type:["service","website","library"][o%3],lifecycle:["production","experimental"][o%2],description:o%5===0?`This is a much longer description for service ${o} that spans multiple lines to demonstrate variable height row rendering in the virtualized table`:`Description for service ${o}`})),l=[{id:"name",label:"Name",isRowHeader:!0,cell:n=>t.jsx(a,{title:n.name,description:n.description})},{id:"owner",label:"Owner",cell:n=>t.jsx(a,{title:n.owner.name})},{id:"type",label:"Type",cell:n=>t.jsx(a,{title:n.type})}],{tableProps:e}=c({mode:"complete",getData:()=>i,paginationOptions:{pageSize:50}});return t.jsx(m,{columnConfig:l,...e,virtualized:{estimatedRowHeight:48},style:{height:400}})}},T={render:()=>{const[i,l]=u.useState(new Set),e=[{value:"",label:"All types"},{value:"service",label:"Service"},{value:"website",label:"Website"},{value:"library",label:"Library"},{value:"documentation",label:"Documentation"},{value:"other",label:"Other"}],n=[{id:"name",label:"Name",isRowHeader:!0,isSortable:!0,cell:r=>t.jsx(a,{title:r.name,description:r.description})},{id:"owner",label:"Owner",isSortable:!0,cell:r=>t.jsx(a,{title:r.owner.name})},{id:"type",label:"Type",isSortable:!0,cell:r=>t.jsx(a,{title:r.type})},{id:"lifecycle",label:"Lifecycle",isSortable:!0,cell:r=>t.jsx(a,{title:r.lifecycle})}],{tableProps:o,search:s,filter:d}=c({mode:"offset",initialSort:{column:"name",direction:"ascending"},getData:async({offset:r,pageSize:g,sort:C,filter:Z,search:ee})=>{const ae=Math.floor(r/g)+1;await new Promise(b=>setTimeout(b,300*ae));let w=[...p];if(ee){const b=ee.toLowerCase();w=w.filter(S=>S.name.toLowerCase().includes(b)||S.owner.name.toLowerCase().includes(b)||S.description?.toLowerCase().includes(b))}return Z?.type&&(w=w.filter(b=>b.type===Z.type)),C&&w.sort((b,S)=>{let h,x;switch(C.column){case"owner":h=b.owner.name,x=S.owner.name;break;case"type":h=b.type,x=S.type;break;case"lifecycle":h=b.lifecycle,x=S.lifecycle;break;default:h=b.name,x=S.name}const te=h.localeCompare(x);return C.direction==="descending"?-te:te}),{data:w.slice(r,r+g),totalCount:w.length}},paginationOptions:{pageSize:10}});return t.jsxs(ne,{direction:"column",gap:"4",children:[t.jsxs(ne,{gap:"4",align:"end",children:[t.jsx(J,{"aria-label":"Search",label:"Search",placeholder:"Search by name, owner, or description...",style:{width:300},...s}),t.jsx(ce,{label:"Type",options:e,value:d.value?.type??"",onChange:r=>d.onChange({type:r===""?null:String(r)}),style:{width:180}})]}),t.jsx(m,{...o,columnConfig:n,selection:{mode:"multiple",behavior:"toggle",selected:i,onSelectionChange:l},emptyState:s.value||d.value?.type?t.jsx("div",{children:"No results match your filters"}):t.jsx("div",{children:"No data available"})})]})}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => {
    const columns: ColumnConfig<Data1Item>[] = [{
      id: 'name',
      label: 'Name',
      isRowHeader: true,
      isResizable: true,
      defaultWidth: '3fr',
      minWidth: 200,
      cell: item => <CellText title={item.name} description={item.description} />
    }, {
      id: 'owner',
      label: 'Owner',
      isResizable: true,
      defaultWidth: '2fr',
      minWidth: 120,
      maxWidth: 300,
      cell: item => <CellText title={item.owner.name} />
    }, {
      id: 'type',
      label: 'Type',
      isResizable: true,
      defaultWidth: '1fr',
      minWidth: 80,
      maxWidth: 200,
      cell: item => <CellText title={item.type} />
    }, {
      id: 'lifecycle',
      label: 'Lifecycle',
      isResizable: true,
      defaultWidth: '1fr',
      minWidth: 80,
      maxWidth: 200,
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
}`,...P.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => {
    // Amplify the ~100-row mocked dataset to several thousand rows so the
    // perf difference between debounced and non-debounced typing is visible.
    const largeData = useMemo(() => {
      const result: Data1Item[] = [];
      for (let i = 0; i < 50; i++) {
        for (const item of data1) {
          result.push({
            ...item,
            id: \`\${item.id}-\${i}\`
          });
        }
      }
      return result;
    }, []);
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
    const searchFn = (items: Data1Item[], query: string) => {
      const lowerQuery = query.toLowerCase();
      return items.filter(item => item.name.toLowerCase().includes(lowerQuery) || item.owner.name.toLowerCase().includes(lowerQuery) || item.type.toLowerCase().includes(lowerQuery));
    };
    const immediate = useTable({
      mode: 'complete',
      data: largeData,
      paginationOptions: {
        pageSize: 10
      },
      searchFn
    });
    const debounced = useTable({
      mode: 'complete',
      data: largeData,
      paginationOptions: {
        pageSize: 10
      },
      searchFn,
      searchDebounceMs: 200
    });
    return <div style={{
      display: 'grid',
      gap: '32px'
    }}>
        <div>
          <h3 style={{
          marginBottom: '8px'
        }}>
            Immediate (searchDebounceMs: 0)
          </h3>
          <SearchField aria-label="Immediate search" placeholder="Type to search..." style={{
          marginBottom: '16px'
        }} {...immediate.search} />
          <Table columnConfig={columns} {...immediate.tableProps} />
        </div>
        <div>
          <h3 style={{
          marginBottom: '8px'
        }}>
            Debounced (searchDebounceMs: 200)
          </h3>
          <SearchField aria-label="Debounced search" placeholder="Type to search..." style={{
          marginBottom: '16px'
        }} {...debounced.search} />
          <Table columnConfig={columns} {...debounced.tableProps} />
        </div>
      </div>;
  }
}`,...O.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
      background: item.lifecycle === 'experimental' ? 'var(--bui-warning-bg-subdued)' : undefined,
      borderLeft: item.lifecycle === 'experimental' ? '3px solid var(--bui-fg-warning)' : '3px solid transparent'
    }}>
            {column => <Fragment key={column.id}>
                {column.id === 'name' ? <CellText title={item.name} description={item.description} /> : column.cell(item)}
              </Fragment>}
          </Row>} />;
  }
}`,...$.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...I.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
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
      mode: 'multiple',
      behavior: 'toggle',
      selected,
      onSelectionChange: setSelected
    }} />;
  }
}`,...F.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}};Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
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
}`,...Q.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
}`,...q.parameters?.docs?.source}}};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
}`,...E.parameters?.docs?.source}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
}`,...Y.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
- Type filter dropdown`,...T.parameters?.docs?.description}}};const kt=["BasicLocalData","ResizableColumns","Sorting","Search","SearchWithDebounce","Selection","RowLinks","Reload","ServerSidePaginationOffset","ServerSidePaginationCursor","CustomRowRender","AtomicComponents","RowClick","SelectionSingleToggle","SelectionMultiToggle","SelectionWithRowClick","SelectionWithRowLinks","SelectionWithPagination","SelectionSingleReplace","SelectionMultiReplace","SelectionReplaceWithRowClick","SelectionReplaceWithRowLinks","VirtualizedTable","VirtualizedWithCustomRowHeight","VirtualizedWithEstimatedRowHeight","ComprehensiveServerSide"];export{k as AtomicComponents,D as BasicLocalData,T as ComprehensiveServerSide,$ as CustomRowRender,W as Reload,j as ResizableColumns,I as RowClick,H as RowLinks,R as Search,O as SearchWithDebounce,z as Selection,q as SelectionMultiReplace,F as SelectionMultiToggle,_ as SelectionReplaceWithRowClick,G as SelectionReplaceWithRowLinks,Q as SelectionSingleReplace,V as SelectionSingleToggle,A as SelectionWithPagination,B as SelectionWithRowClick,M as SelectionWithRowLinks,N as ServerSidePaginationCursor,L as ServerSidePaginationOffset,P as Sorting,E as VirtualizedTable,Y as VirtualizedWithCustomRowHeight,U as VirtualizedWithEstimatedRowHeight,kt as __namedExportsOrder,$t as default};
