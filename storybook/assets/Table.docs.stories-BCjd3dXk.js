import{j as e,r as a}from"./iframe-C8yOC2Gz.js";import{t as T,u as p,T as d,s as b,e as f,C as S,f as j,g as h}from"./utils-D2oDlK-U.js";import{F as v}from"./Flex-arqN7lW6.js";import{R as x,a as m}from"./RadioGroup-Co9hKoyI.js";import{T as C}from"./Text-B2b0JVSQ.js";import"./preload-helper-PPVm8Dsz.js";import"./useStyles-Cp2nr9ip.js";import"./clsx-B-dksMZM.js";import"./useListState-h7zkOJgq.js";import"./useFocusable-Cf-uba3q.js";import"./useObjectRef-B28ZJtJV.js";import"./usePress-DlLbwG62.js";import"./useEvent-Bz7ZiiYU.js";import"./SelectionIndicator-Chk8fLVr.js";import"./context-xKD2YgYJ.js";import"./Hidden-Bf4vJGoG.js";import"./useControlledState-3OIQq_AY.js";import"./index-BPNZKYTF.js";import"./Checkbox-C_OXWnR5.js";import"./RSPContexts-BuW_aY7-.js";import"./utils-Bx2t-JSx.js";import"./Form-BeYU7OAG.js";import"./useToggleState-7KOUQ1k_.js";import"./useFormReset-TWxaP-8z.js";import"./useFocusRing-9VATBKEW.js";import"./VisuallyHidden-Db8cAXyC.js";import"./isExternalLink-DzQTpl4p.js";import"./index-CL1m9NR9.js";import"./VisuallyHidden-CSKsda0G.js";import"./TablePagination-ngoAE7z6.js";import"./Select-EpdT0Oki.js";import"./Dialog-C19JSOa_.js";import"./ListBox-DWrZHFSF.js";import"./Text-uBsvBm9f.js";import"./useLabel-CxDV84tc.js";import"./useLabels-DTMIxM_1.js";import"./useLocalizedStringFormatter-BEYUcJWC.js";import"./Button-C1EZ39_j.js";import"./Label-Cpe3tjrq.js";import"./OverlayArrow-B-VkW_rH.js";import"./FieldError-CILJVuEy.js";import"./Input-B-2MV5dK.js";import"./SearchField-p5hkHDnt.js";import"./FieldLabel-BtbX2-zx.js";import"./FieldError-BJcJCsXR.js";import"./ButtonIcon-BMeiW29z.js";import"./Button.module-D8OjmJLb.js";import"./Link-DiCE4SC-.js";import"./useLink-x5cfDSAd.js";import"./Avatar-DQg107ju.js";import"./useHighlightSelectionDescription-Cxb0SOrf.js";import"./useHasTabbableChild-emFBPVC7.js";import"./useSurface-HU3pbKvv.js";const je={title:"Backstage UI/Table/docs",...T},l={render:()=>{const o=[{id:"name",label:"Band name",isRowHeader:!0,cell:t=>e.jsx(f,{name:t.name,src:t.image,href:t.website})},{id:"genre",label:"Genre",cell:t=>e.jsx(S,{title:t.genre})},{id:"yearFormed",label:"Year formed",cell:t=>e.jsx(S,{title:t.yearFormed.toString()})},{id:"albums",label:"Albums",cell:t=>e.jsx(S,{title:t.albums.toString()})}],{tableProps:n}=p({mode:"complete",getData:()=>j,paginationOptions:{pageSize:5}});return e.jsx(d,{columnConfig:o,...n})}},r={render:()=>{const[o,n]=a.useState(new Set),{tableProps:t}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsx(d,{...t,columnConfig:b,selection:{mode:"multiple",behavior:"toggle",selected:o,onSelectionChange:n},rowConfig:{onClick:i=>alert(`Clicked: ${i.name}`)}})}},s={render:()=>{const[o,n]=a.useState("multiple"),[t,i]=a.useState(new Set),{tableProps:g}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...g,columnConfig:b,selection:{mode:o,behavior:"toggle",selected:t,onSelectionChange:i}}),e.jsxs("div",{children:[e.jsx(C,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection mode:"}),e.jsxs(x,{"aria-label":"Selection mode",orientation:"horizontal",value:o,onChange:u=>{n(u),i(new Set)},children:[e.jsx(m,{value:"single",children:"single"}),e.jsx(m,{value:"multiple",children:"multiple"})]})]})]})}},c={render:()=>{const[o,n]=a.useState("toggle"),[t,i]=a.useState(new Set),{tableProps:g}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...g,columnConfig:b,selection:{mode:"multiple",behavior:o,selected:t,onSelectionChange:i}}),e.jsxs("div",{children:[e.jsx(C,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection behavior:"}),e.jsxs(x,{"aria-label":"Selection behavior",orientation:"horizontal",value:o,onChange:u=>{n(u),i(new Set)},children:[e.jsx(m,{value:"toggle",children:"toggle"}),e.jsx(m,{value:"replace",children:"replace"})]})]})]})}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>('multiple');
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
    return <Flex direction="column" gap="8">
        <Table {...tableProps} columnConfig={selectionColumns} selection={{
        mode: selectionMode,
        behavior: 'toggle',
        selected,
        onSelectionChange: setSelected
      }} />
        <div>
          <Text as="h4" style={{
          marginBottom: 'var(--bui-space-2)'
        }}>
            Selection mode:
          </Text>
          <RadioGroup aria-label="Selection mode" orientation="horizontal" value={selectionMode} onChange={value => {
          setSelectionMode(value as 'single' | 'multiple');
          setSelected(new Set());
        }}>
            <Radio value="single">single</Radio>
            <Radio value="multiple">multiple</Radio>
          </RadioGroup>
        </div>
      </Flex>;
  }
}`,...s.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [selectionBehavior, setSelectionBehavior] = useState<'toggle' | 'replace'>('toggle');
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
    return <Flex direction="column" gap="8">
        <Table {...tableProps} columnConfig={selectionColumns} selection={{
        mode: 'multiple',
        behavior: selectionBehavior,
        selected,
        onSelectionChange: setSelected
      }} />
        <div>
          <Text as="h4" style={{
          marginBottom: 'var(--bui-space-2)'
        }}>
            Selection behavior:
          </Text>
          <RadioGroup aria-label="Selection behavior" orientation="horizontal" value={selectionBehavior} onChange={value => {
          setSelectionBehavior(value as 'toggle' | 'replace');
          setSelected(new Set());
        }}>
            <Radio value="toggle">toggle</Radio>
            <Radio value="replace">replace</Radio>
          </RadioGroup>
        </div>
      </Flex>;
  }
}`,...c.parameters?.docs?.source}}};const Re=["TableRockBand","SelectionToggleWithActions","SelectionModePlayground","SelectionBehaviorPlayground"];export{c as SelectionBehaviorPlayground,s as SelectionModePlayground,r as SelectionToggleWithActions,l as TableRockBand,Re as __namedExportsOrder,je as default};
