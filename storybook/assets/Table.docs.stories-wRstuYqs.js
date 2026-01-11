import{j as e,r as a}from"./iframe-C0ztlCqi.js";import{t as T,u as p,T as d,s as b,e as f,C as S,f as j,g as h}from"./utils-B3rCDxbz.js";import{F as v}from"./Flex-B9_ax4iV.js";import{R as x,a as m}from"./RadioGroup-DtxJFqcI.js";import{T as C}from"./Text-DSRe2kRR.js";import"./preload-helper-PPVm8Dsz.js";import"./useStyles-bcBiCLvk.js";import"./clsx-B-dksMZM.js";import"./useListState-BHmd_hq3.js";import"./useFocusable-p9KH-L6o.js";import"./useObjectRef-BAHpeK2Q.js";import"./usePress-fHIUjFT4.js";import"./useEvent-DAQIiB1Y.js";import"./SelectionIndicator-B9GSDWu_.js";import"./context-ygftJK3M.js";import"./Hidden-C3YE5RBw.js";import"./useControlledState-DKD8Bzg_.js";import"./index-CIEZIaXg.js";import"./Checkbox-CCrxgA9j.js";import"./RSPContexts-CRqlmdBJ.js";import"./utils-B9M6naxZ.js";import"./Form-BLhOaFKt.js";import"./useToggleState-Cv0TBcAa.js";import"./useFormReset-MnwCBEfI.js";import"./useFocusRing-CLfDArqe.js";import"./VisuallyHidden-Be1RBRhL.js";import"./isExternalLink-DzQTpl4p.js";import"./index-BSDdaq1o.js";import"./VisuallyHidden-DOS1vdbG.js";import"./TablePagination-8ciNjo0p.js";import"./Select-C0W7xAS2.js";import"./Dialog-D97Sujj3.js";import"./ListBox-DbLszOcl.js";import"./Text-DzxxxCNE.js";import"./useLabel-DNM1VLp0.js";import"./useLabels-DqGmhYUK.js";import"./useLocalizedStringFormatter-DGWBU-cc.js";import"./Button-jzeujd6P.js";import"./Label-UlVG4KZ1.js";import"./OverlayArrow-CJ27zK1U.js";import"./FieldError-C52Lo7W0.js";import"./Input-CiH0F3Hu.js";import"./SearchField-e6Sz3mqM.js";import"./FieldLabel-CvAIRPKv.js";import"./FieldError-CT-xm674.js";import"./ButtonIcon-7TmQB7KR.js";import"./Button.module-D8OjmJLb.js";import"./Link-BG3_67Eo.js";import"./useLink-D9Z8BhZk.js";import"./Avatar-DlZfubJL.js";import"./useHighlightSelectionDescription-11LvOHCv.js";import"./useHasTabbableChild-C3OEOcbA.js";import"./useSurface-BpKxdcc1.js";const je={title:"Backstage UI/Table/docs",...T},l={render:()=>{const o=[{id:"name",label:"Band name",isRowHeader:!0,cell:t=>e.jsx(f,{name:t.name,src:t.image,href:t.website})},{id:"genre",label:"Genre",cell:t=>e.jsx(S,{title:t.genre})},{id:"yearFormed",label:"Year formed",cell:t=>e.jsx(S,{title:t.yearFormed.toString()})},{id:"albums",label:"Albums",cell:t=>e.jsx(S,{title:t.albums.toString()})}],{tableProps:n}=p({mode:"complete",getData:()=>j,paginationOptions:{pageSize:5}});return e.jsx(d,{columnConfig:o,...n})}},r={render:()=>{const[o,n]=a.useState(new Set),{tableProps:t}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsx(d,{...t,columnConfig:b,selection:{mode:"multiple",behavior:"toggle",selected:o,onSelectionChange:n},rowConfig:{onClick:i=>alert(`Clicked: ${i.name}`)}})}},s={render:()=>{const[o,n]=a.useState("multiple"),[t,i]=a.useState(new Set),{tableProps:g}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...g,columnConfig:b,selection:{mode:o,behavior:"toggle",selected:t,onSelectionChange:i}}),e.jsxs("div",{children:[e.jsx(C,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection mode:"}),e.jsxs(x,{"aria-label":"Selection mode",orientation:"horizontal",value:o,onChange:u=>{n(u),i(new Set)},children:[e.jsx(m,{value:"single",children:"single"}),e.jsx(m,{value:"multiple",children:"multiple"})]})]})]})}},c={render:()=>{const[o,n]=a.useState("toggle"),[t,i]=a.useState(new Set),{tableProps:g}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...g,columnConfig:b,selection:{mode:"multiple",behavior:o,selected:t,onSelectionChange:i}}),e.jsxs("div",{children:[e.jsx(C,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection behavior:"}),e.jsxs(x,{"aria-label":"Selection behavior",orientation:"horizontal",value:o,onChange:u=>{n(u),i(new Set)},children:[e.jsx(m,{value:"toggle",children:"toggle"}),e.jsx(m,{value:"replace",children:"replace"})]})]})]})}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
