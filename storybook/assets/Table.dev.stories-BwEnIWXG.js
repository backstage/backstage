import{bR as e,ca as p}from"./iframe-DogXi1kP.js";import{t as ae,d as b,s as y,a as v,b as f}from"./utils-BsgqF4qt.js";import{e as oe,d as ie,b as J,c as re,R as ne,a as o,u as c,T as m,C as K}from"./useTable-Be4UwtRW.js";import{F as te}from"./Flex-Bi-SKTgz.js";import{S as U}from"./SearchField-WluvfdGm.js";import{S as se}from"./Select-mDMlc7hP.js";import{B as ce}from"./Button-DOk-0Wn9.js";import"./preload-helper-PPVm8Dsz.js";import"./BUIProvider-coEk1xkK.js";import"./openLink-CxuZpafj.js";import"./useResolvedHref-BFQ7w248.js";import"./useObjectRef-UHrM_yCs.js";import"./Virtualizer-CbI-wsqg.js";import"./useCollection-D7sNZtry.js";import"./useFocusRing-mENG_ikp.js";import"./Hidden-CYdnfqbh.js";import"./keyboard-a1n3wmz-.js";import"./FocusScope-C_GT869N.js";import"./useEvent-EwjaUY4k.js";import"./I18nProvider-Cag9fozJ.js";import"./usePress-PepYZ5yJ.js";import"./textSelection-QdGxsqrV.js";import"./useControlledState-CrzRLYRc.js";import"./useOverlayTriggerState-NZ_YQKiz.js";import"./utils-AxfqVSE9.js";import"./number-C2ZI7feN.js";import"./index-RV6Ph9vd.js";import"./Checkbox-BaVHiHF1.js";import"./Checkbox-Bo9ggDuK.js";import"./FieldError-CzpSx-Mx.js";import"./Text-BRIb-OAb.js";import"./useFormValidation-BIYlJHZ1.js";import"./Label-BT3yvL3F.js";import"./useField-DTPdncVL.js";import"./useLabel-DvnqIlMC.js";import"./useLabels-DnC-SBWU.js";import"./useToggle-BZ2oU_Ty.js";import"./useFormReset-CXIeSoiQ.js";import"./useToggleState-D-PVak1T.js";import"./useHover-ox9S2Piy.js";import"./VisuallyHidden-BwKEPC3N.js";import"./Skeleton-OxlxzLgT.js";import"./VisuallyHidden-CMhaGwvP.js";import"./TablePagination-CEdWo31V.js";import"./Text-BbRcKCRf.js";import"./ButtonIcon-C7uVqlJx.js";import"./Button-Fh9tm360.js";import"./useButton-C2CjCUzA.js";import"./Link-D1uGA1pu.js";import"./useLink-C5PjbgXa.js";import"./getNodeText-8Y9Za0Fs.js";import"./ListBox-CpFc4rcf.js";import"./getItemCount-C0QHxlzQ.js";import"./Autocomplete-DYW-F-Tj.js";import"./useLocalizedStringFormatter-CfgpiWB3.js";import"./useListState-Y13CpHKJ.js";import"./useHighlightSelectionDescription-qNyLFXDK.js";import"./useUpdateEffect-DmuMjo48.js";import"./useHasTabbableChild-Dlx45nME.js";import"./useGridSelectionCheckbox-q-R9q_zJ.js";import"./Avatar-BVZZcxVW.js";import"./Input-BStAHKnh.js";import"./SearchField-bPygfAon.js";import"./useTextField-D7_hM5Yb.js";import"./FieldLabel-DFPXv5Zo.js";import"./FieldError-VyUtu5uM.js";import"./Dialog-CuUASSK4.js";import"./Heading-CeGRyyrD.js";import"./animation-NVFnR0bW.js";import"./definition-Bl2138zY.js";import"./useFilter-CBfUSc_L.js";const Pt={title:"Backstage UI/Table/dev",...ae},D={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,defaultWidth:"4fr",cell:t=>e.jsx(o,{title:t.name,description:t.description})},{id:"owner",label:"Owner",defaultWidth:"1fr",cell:t=>e.jsx(o,{title:t.owner.name})},{id:"type",label:"Type",defaultWidth:"1fr",cell:t=>e.jsx(o,{title:t.type})},{id:"lifecycle",label:"Lifecycle",defaultWidth:"1fr",cell:t=>e.jsx(o,{title:t.lifecycle})}],{tableProps:l}=c({mode:"complete",getData:()=>b,paginationOptions:{pageSize:5}});return e.jsx(m,{columnConfig:a,...l})}},j={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(o,{title:t.name}),isSortable:!0},{id:"owner",label:"Owner",cell:t=>e.jsx(o,{title:t.owner.name}),isSortable:!0},{id:"type",label:"Type",cell:t=>e.jsx(o,{title:t.type}),isSortable:!0},{id:"lifecycle",label:"Lifecycle",cell:t=>e.jsx(o,{title:t.lifecycle}),isSortable:!0}],{tableProps:l}=c({mode:"complete",getData:()=>b,paginationOptions:{pageSize:5},initialSort:{column:"name",direction:"ascending"},sortFn:(t,{column:n,direction:i})=>[...t].sort((s,d)=>{let r,u;n==="name"?(r=s.name,u=d.name):n==="owner"?(r=s.owner.name,u=d.owner.name):n==="type"?(r=s.type,u=d.type):(r=s.lifecycle,u=d.lifecycle);const C=r.localeCompare(u);return i==="descending"?-C:C})});return e.jsx(m,{columnConfig:a,...l})}},P={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:n=>e.jsx(o,{title:n.name}),isSortable:!0},{id:"owner",label:"Owner",cell:n=>e.jsx(o,{title:n.owner.name})},{id:"type",label:"Type",cell:n=>e.jsx(o,{title:n.type})}],{tableProps:l,search:t}=c({mode:"complete",getData:()=>b,paginationOptions:{pageSize:5},searchFn:(n,i)=>{const s=i.toLowerCase();return n.filter(d=>d.name.toLowerCase().includes(s)||d.owner.name.toLowerCase().includes(s)||d.type.toLowerCase().includes(s))}});return e.jsxs("div",{children:[e.jsx(U,{"aria-label":"Search",placeholder:"Search...",style:{marginBottom:"16px"},...t}),e.jsx(m,{columnConfig:a,emptyState:t.value?e.jsx("div",{children:"No results found"}):e.jsx("div",{children:"No data available"}),...l})]})}},O={render:()=>{const a=p.useMemo(()=>{const s=[];for(let d=0;d<50;d++)for(const r of b)s.push({...r,id:`${r.id}-${d}`});return s},[]),l=[{id:"name",label:"Name",isRowHeader:!0,cell:s=>e.jsx(o,{title:s.name})},{id:"owner",label:"Owner",cell:s=>e.jsx(o,{title:s.owner.name})},{id:"type",label:"Type",cell:s=>e.jsx(o,{title:s.type})}],t=(s,d)=>{const r=d.toLowerCase();return s.filter(u=>u.name.toLowerCase().includes(r)||u.owner.name.toLowerCase().includes(r)||u.type.toLowerCase().includes(r))},n=c({mode:"complete",data:a,paginationOptions:{pageSize:10},searchFn:t}),i=c({mode:"complete",data:a,paginationOptions:{pageSize:10},searchFn:t,searchDebounceMs:200});return e.jsxs("div",{style:{display:"grid",gap:"32px"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:"8px"},children:"Immediate (searchDebounceMs: 0)"}),e.jsx(U,{"aria-label":"Immediate search",placeholder:"Type to search...",style:{marginBottom:"16px"},...n.search}),e.jsx(m,{columnConfig:l,...n.tableProps})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:"8px"},children:"Debounced (searchDebounceMs: 200)"}),e.jsx(U,{"aria-label":"Debounced search",placeholder:"Type to search...",style:{marginBottom:"16px"},...i.search}),e.jsx(m,{columnConfig:l,...i.tableProps})]})]})}},R={render:()=>{const[a,l]=p.useState(new Set),t=[{id:"name",label:"Name",isRowHeader:!0,cell:i=>e.jsx(o,{title:i.name})},{id:"owner",label:"Owner",cell:i=>e.jsx(o,{title:i.owner.name})},{id:"type",label:"Type",cell:i=>e.jsx(o,{title:i.type})}],{tableProps:n}=c({mode:"complete",getData:()=>b,paginationOptions:{pageSize:5}});return e.jsx(m,{...n,columnConfig:t,selection:{mode:"multiple",selected:a,onSelectionChange:l}})}},z={render:()=>{const a=[{id:"name",label:"Band name",isRowHeader:!0,cell:t=>e.jsx(K,{name:t.name,src:t.image})},{id:"genre",label:"Genre",cell:t=>e.jsx(o,{title:t.genre})},{id:"yearFormed",label:"Year formed",cell:t=>e.jsx(o,{title:t.yearFormed.toString()})}],{tableProps:l}=c({mode:"complete",getData:()=>v,paginationOptions:{pageSize:5}});return e.jsx(m,{...l,columnConfig:a,rowConfig:{getHref:t=>`/bands/${t.id}`}})}},H={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:n=>e.jsx(o,{title:n.name})},{id:"type",label:"Type",cell:n=>e.jsx(o,{title:n.type})}],{tableProps:l,reload:t}=c({mode:"complete",getData:()=>b,paginationOptions:{pageSize:5}});return e.jsxs("div",{children:[e.jsx(ce,{onPress:()=>t(),children:"Refresh Data"}),e.jsx(m,{columnConfig:a,...l})]})}},L={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(o,{title:t.name})},{id:"owner",label:"Owner",cell:t=>e.jsx(o,{title:t.owner.name})},{id:"type",label:"Type",cell:t=>e.jsx(o,{title:t.type})}],{tableProps:l}=c({mode:"offset",getData:async({offset:t,pageSize:n})=>(await new Promise(i=>setTimeout(i,500)),{data:b.slice(t,t+n),totalCount:b.length}),paginationOptions:{pageSize:5}});return e.jsx(m,{columnConfig:a,...l})}},$={render:()=>{const a=[{id:"name",label:"Band name",isRowHeader:!0,cell:t=>e.jsx(K,{name:t.name,src:t.image})},{id:"genre",label:"Genre",cell:t=>e.jsx(o,{title:t.genre})}],{tableProps:l}=c({mode:"cursor",getData:async({cursor:t,pageSize:n})=>{await new Promise(d=>setTimeout(d,500));const i=t?parseInt(t,10):0,s=i+n;return{data:v.slice(i,s),totalCount:v.length,nextCursor:s<v.length?String(s):void 0,prevCursor:i>0?String(Math.max(0,i-n)):void 0}},paginationOptions:{pageSize:5}});return e.jsx(m,{columnConfig:a,...l})}},k={render:()=>{const a=[{id:"name",label:"Name",isRowHeader:!0,cell:t=>e.jsx(o,{title:t.name})},{id:"type",label:"Type",cell:t=>e.jsx(o,{title:t.type})},{id:"lifecycle",label:"Lifecycle",cell:t=>e.jsx(o,{title:t.lifecycle})}],{tableProps:l}=c({mode:"complete",getData:()=>b,paginationOptions:{pageSize:5}});return e.jsx(m,{...l,columnConfig:a,rowConfig:({item:t})=>e.jsx(ne,{id:String(t.id),columns:a,style:{background:t.lifecycle==="experimental"?"var(--bui-bg-warning)":void 0,borderLeft:t.lifecycle==="experimental"?"3px solid var(--bui-fg-warning)":"3px solid transparent"},children:n=>e.jsx(p.Fragment,{children:n.id==="name"?e.jsx(o,{title:t.name,description:t.description}):n.cell(t)},n.id)})})}},N={render:()=>{const a=b.slice(0,5);return e.jsxs(oe,{children:[e.jsxs(ie,{children:[e.jsx(J,{isRowHeader:!0,children:"Name"}),e.jsx(J,{children:"Owner"}),e.jsx(J,{children:"Type"})]}),e.jsx(re,{children:a.map(l=>e.jsxs(ne,{id:String(l.id),children:[e.jsx(o,{title:l.name}),e.jsx(o,{title:l.owner.name}),e.jsx(o,{title:l.type})]},l.id))})]})}},I={render:()=>{const a=[{id:"name",label:"Band name",isRowHeader:!0,cell:t=>e.jsx(K,{name:t.name,src:t.image,href:t.website})},{id:"genre",label:"Genre",cell:t=>e.jsx(o,{title:t.genre})},{id:"yearFormed",label:"Year formed",cell:t=>e.jsx(o,{title:t.yearFormed.toString()})},{id:"albums",label:"Albums",cell:t=>e.jsx(o,{title:t.albums.toString()})}],{tableProps:l}=c({mode:"complete",getData:()=>v,paginationOptions:{pageSize:5}});return e.jsx(m,{...l,columnConfig:a,rowConfig:{onClick:t=>alert(`Clicked: ${t.name}`)}})}},V={render:()=>{const[a,l]=p.useState(new Set),{tableProps:t}=c({mode:"complete",getData:()=>f,paginationOptions:{pageSize:10}});return e.jsx(m,{...t,columnConfig:y,selection:{mode:"single",behavior:"toggle",selected:a,onSelectionChange:l}})}},F={render:()=>{const[a,l]=p.useState(new Set),{tableProps:t}=c({mode:"complete",getData:()=>f,paginationOptions:{pageSize:10}});return e.jsx(m,{...t,columnConfig:y,selection:{mode:"multiple",behavior:"toggle",selected:a,onSelectionChange:l}})}},B={render:()=>{const[a,l]=p.useState(new Set),{tableProps:t}=c({mode:"complete",getData:()=>f,paginationOptions:{pageSize:10}});return e.jsx(m,{...t,columnConfig:y,selection:{mode:"multiple",behavior:"toggle",selected:a,onSelectionChange:l},rowConfig:{onClick:n=>alert(`Clicked: ${n.name}`)}})}},W={render:()=>{const[a,l]=p.useState(new Set),{tableProps:t}=c({mode:"complete",getData:()=>f,paginationOptions:{pageSize:10}});return e.jsx(m,{...t,columnConfig:y,selection:{mode:"multiple",behavior:"toggle",selected:a,onSelectionChange:l},rowConfig:{getHref:n=>`/items/${n.id}`}})}},M={render:()=>{const[a,l]=p.useState(new Set),{tableProps:t}=c({mode:"complete",getData:()=>b,paginationOptions:{pageSize:5}}),n=[{id:"name",label:"Name",isRowHeader:!0,cell:i=>e.jsx(o,{title:i.name})},{id:"owner",label:"Owner",cell:i=>e.jsx(o,{title:i.owner.name})},{id:"type",label:"Type",cell:i=>e.jsx(o,{title:i.type})}];return e.jsx(m,{...t,columnConfig:n,selection:{mode:"multiple",behavior:"toggle",selected:a,onSelectionChange:l}})}},A={render:()=>{const[a,l]=p.useState(new Set),{tableProps:t}=c({mode:"complete",getData:()=>f,paginationOptions:{pageSize:10}});return e.jsx(m,{...t,columnConfig:y,selection:{mode:"single",behavior:"replace",selected:a,onSelectionChange:l}})}},Q={render:()=>{const[a,l]=p.useState(new Set),{tableProps:t}=c({mode:"complete",getData:()=>f,paginationOptions:{pageSize:10}});return e.jsx(m,{...t,columnConfig:y,selection:{mode:"multiple",behavior:"replace",selected:a,onSelectionChange:l}})}},q={render:()=>{const[a,l]=p.useState(new Set),{tableProps:t}=c({mode:"complete",getData:()=>f,paginationOptions:{pageSize:10}});return e.jsx(m,{...t,columnConfig:y,selection:{mode:"multiple",behavior:"replace",selected:a,onSelectionChange:l},rowConfig:{onClick:n=>alert(`Opening ${n.name}`)}})}},_={render:()=>{const[a,l]=p.useState(new Set),{tableProps:t}=c({mode:"complete",getData:()=>f,paginationOptions:{pageSize:10}});return e.jsx(m,{...t,columnConfig:y,selection:{mode:"multiple",behavior:"replace",selected:a,onSelectionChange:l},rowConfig:{getHref:n=>`/items/${n.id}`}})}},G={render:()=>{const a=Array.from({length:500},(n,i)=>({id:String(i),name:`Service ${i}`,owner:{name:`Team ${i%10}`},type:["service","website","library"][i%3],lifecycle:["production","experimental"][i%2],description:`Description for service ${i}`})),l=[{id:"name",label:"Name",isRowHeader:!0,cell:n=>e.jsx(o,{title:n.name,description:n.description})},{id:"owner",label:"Owner",cell:n=>e.jsx(o,{title:n.owner.name})},{id:"type",label:"Type",cell:n=>e.jsx(o,{title:n.type})}],{tableProps:t}=c({mode:"complete",getData:()=>a,paginationOptions:{pageSize:50}});return e.jsx(m,{columnConfig:l,...t,virtualized:!0,style:{height:400}})}},E={render:()=>{const a=Array.from({length:500},(n,i)=>({id:String(i),name:`Service ${i}`,owner:{name:`Team ${i%10}`},type:["service","website","library"][i%3],lifecycle:["production","experimental"][i%2],description:`Description for service ${i}`})),l=[{id:"name",label:"Name",isRowHeader:!0,cell:n=>e.jsx(o,{title:n.name,description:n.description})},{id:"owner",label:"Owner",cell:n=>e.jsx(o,{title:n.owner.name})},{id:"type",label:"Type",cell:n=>e.jsx(o,{title:n.type})}],{tableProps:t}=c({mode:"complete",getData:()=>a,paginationOptions:{pageSize:50}});return e.jsx(m,{columnConfig:l,...t,virtualized:{rowHeight:56},style:{height:400}})}},Y={render:()=>{const a=Array.from({length:500},(n,i)=>({id:String(i),name:`Service ${i}`,owner:{name:`Team ${i%10}`},type:["service","website","library"][i%3],lifecycle:["production","experimental"][i%2],description:i%5===0?`This is a much longer description for service ${i} that spans multiple lines to demonstrate variable height row rendering in the virtualized table`:`Description for service ${i}`})),l=[{id:"name",label:"Name",isRowHeader:!0,cell:n=>e.jsx(o,{title:n.name,description:n.description})},{id:"owner",label:"Owner",cell:n=>e.jsx(o,{title:n.owner.name})},{id:"type",label:"Type",cell:n=>e.jsx(o,{title:n.type})}],{tableProps:t}=c({mode:"complete",getData:()=>a,paginationOptions:{pageSize:50}});return e.jsx(m,{columnConfig:l,...t,virtualized:{estimatedRowHeight:48},style:{height:400}})}},T={render:()=>{const[a,l]=p.useState(new Set),t=[{value:"",label:"All types"},{value:"service",label:"Service"},{value:"website",label:"Website"},{value:"library",label:"Library"},{value:"documentation",label:"Documentation"},{value:"other",label:"Other"}],n=[{id:"name",label:"Name",isRowHeader:!0,isSortable:!0,cell:r=>e.jsx(o,{title:r.name,description:r.description})},{id:"owner",label:"Owner",isSortable:!0,cell:r=>e.jsx(o,{title:r.owner.name})},{id:"type",label:"Type",isSortable:!0,cell:r=>e.jsx(o,{title:r.type})},{id:"lifecycle",label:"Lifecycle",isSortable:!0,cell:r=>e.jsx(o,{title:r.lifecycle})}],{tableProps:i,search:s,filter:d}=c({mode:"offset",initialSort:{column:"name",direction:"ascending"},getData:async({offset:r,pageSize:u,sort:C,filter:X,search:Z})=>{const le=Math.floor(r/u)+1;await new Promise(g=>setTimeout(g,300*le));let w=[...b];if(Z){const g=Z.toLowerCase();w=w.filter(S=>S.name.toLowerCase().includes(g)||S.owner.name.toLowerCase().includes(g)||S.description?.toLowerCase().includes(g))}return X?.type&&(w=w.filter(g=>g.type===X.type)),C&&w.sort((g,S)=>{let h,x;switch(C.column){case"owner":h=g.owner.name,x=S.owner.name;break;case"type":h=g.type,x=S.type;break;case"lifecycle":h=g.lifecycle,x=S.lifecycle;break;default:h=g.name,x=S.name}const ee=h.localeCompare(x);return C.direction==="descending"?-ee:ee}),{data:w.slice(r,r+u),totalCount:w.length}},paginationOptions:{pageSize:10}});return e.jsxs(te,{direction:"column",gap:"4",children:[e.jsxs(te,{gap:"4",align:"end",children:[e.jsx(U,{"aria-label":"Search",label:"Search",placeholder:"Search by name, owner, or description...",style:{width:300},...s}),e.jsx(se,{label:"Type",options:t,value:d.value?.type??"",onChange:r=>d.onChange({type:r===""?null:String(r)}),style:{width:180}})]}),e.jsx(m,{...i,columnConfig:n,selection:{mode:"multiple",behavior:"toggle",selected:a,onSelectionChange:l},emptyState:s.value||d.value?.type?e.jsx("div",{children:"No results match your filters"}):e.jsx("div",{children:"No data available"})})]})}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
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
}`,...R.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
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
}`,...z.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
}`,...H.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
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
}`,...L.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
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
}`,...$.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
}`,...B.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
      mode: 'single',
      behavior: 'replace',
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
      mode: 'multiple',
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
    }} rowConfig={{
      onClick: item => alert(\`Opening \${item.name}\`)
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
      getHref: item => \`/items/\${item.id}\`
    }} />;
  }
}`,..._.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
    return <Table columnConfig={columns} {...tableProps} virtualized={{
      rowHeight: 56
    }} style={{
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
}`,...Y.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
- Type filter dropdown`,...T.parameters?.docs?.description}}};const Ot=["BasicLocalData","Sorting","Search","SearchWithDebounce","Selection","RowLinks","Reload","ServerSidePaginationOffset","ServerSidePaginationCursor","CustomRowRender","AtomicComponents","RowClick","SelectionSingleToggle","SelectionMultiToggle","SelectionWithRowClick","SelectionWithRowLinks","SelectionWithPagination","SelectionSingleReplace","SelectionMultiReplace","SelectionReplaceWithRowClick","SelectionReplaceWithRowLinks","VirtualizedTable","VirtualizedWithCustomRowHeight","VirtualizedWithEstimatedRowHeight","ComprehensiveServerSide"];export{N as AtomicComponents,D as BasicLocalData,T as ComprehensiveServerSide,k as CustomRowRender,H as Reload,I as RowClick,z as RowLinks,P as Search,O as SearchWithDebounce,R as Selection,Q as SelectionMultiReplace,F as SelectionMultiToggle,q as SelectionReplaceWithRowClick,_ as SelectionReplaceWithRowLinks,A as SelectionSingleReplace,V as SelectionSingleToggle,M as SelectionWithPagination,B as SelectionWithRowClick,W as SelectionWithRowLinks,$ as ServerSidePaginationCursor,L as ServerSidePaginationOffset,j as Sorting,G as VirtualizedTable,E as VirtualizedWithCustomRowHeight,Y as VirtualizedWithEstimatedRowHeight,Ot as __namedExportsOrder,Pt as default};
