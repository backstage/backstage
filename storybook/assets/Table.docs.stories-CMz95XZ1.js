import{j as e,r as a}from"./iframe-C9MahRWh.js";import{t as T,u as p,T as d,s as b,e as f,C as S,f as j,g as h}from"./utils-BPoCUZIj.js";import{F as v}from"./Flex-uCAvDUYI.js";import{R as x,a as m}from"./RadioGroup-C0zxsXAz.js";import{T as C}from"./Text-Ds4BlgoA.js";import"./preload-helper-PPVm8Dsz.js";import"./useStyles-dPvM8hXG.js";import"./clsx-B-dksMZM.js";import"./SelectionManager-DamogtHS.js";import"./useFocusable-BxBTINdj.js";import"./useObjectRef-ZyJjxF3k.js";import"./usePress-D3t2rjAm.js";import"./useEvent-C6Sb9yqZ.js";import"./SelectionIndicator-OZWzwoCk.js";import"./context-DKtu6Y3b.js";import"./Hidden-Cxji9ok1.js";import"./useControlledState-DAZtEiJa.js";import"./index-xrcBWgHF.js";import"./Checkbox-DMCZmCml.js";import"./RSPContexts-CXbBlmuv.js";import"./utils-CihhLEPA.js";import"./Form-CCqm_2ta.js";import"./useToggle-mWeWuyIj.js";import"./useFormReset-CSNKtU7Y.js";import"./useToggleState-D7NTpPN4.js";import"./useFocusRing-h-EBRLdi.js";import"./VisuallyHidden-8kms9qlt.js";import"./isExternalLink-DzQTpl4p.js";import"./index-Y3I5MZ_O.js";import"./VisuallyHidden-Dp9DhCBU.js";import"./TablePagination-DBFO_eQw.js";import"./Select-B0SVowMA.js";import"./Dialog-HfZhZ_A_.js";import"./Button-Cs6MCcdk.js";import"./Label-BOqyD8Cj.js";import"./useLabel-6F2fj9na.js";import"./useLabels-Bh8yyRcA.js";import"./useButton-BqQfga0C.js";import"./OverlayArrow-3A2vqwi_.js";import"./Separator-5JHOJtug.js";import"./Text-mBfUsCyZ.js";import"./useLocalizedStringFormatter-CiST5XCR.js";import"./FieldError-CDpMIjqv.js";import"./ListBox-UQKE5hMG.js";import"./useListState-DfnliTnv.js";import"./useField-CBlSzLbg.js";import"./Popover.module-O5UoF8fw.js";import"./Autocomplete-BP3DnqxF.js";import"./Input-BQw1JYf4.js";import"./SearchField-D7A3wJe3.js";import"./FieldLabel-B99Qg1SG.js";import"./FieldError-68hVUEeT.js";import"./ButtonIcon-VaEdfXWT.js";import"./Button.module-DkEJAzA0.js";import"./Link-baAia4GQ.js";import"./useLink-BunHRSwx.js";import"./Avatar-Cfo2hl8I.js";import"./useHighlightSelectionDescription-D56tDwHr.js";import"./useHasTabbableChild-CBcWj9A9.js";import"./useSurface-CzmEEkbu.js";const ze={title:"Backstage UI/Table/docs",...T},l={render:()=>{const o=[{id:"name",label:"Band name",isRowHeader:!0,cell:t=>e.jsx(f,{name:t.name,src:t.image,href:t.website})},{id:"genre",label:"Genre",cell:t=>e.jsx(S,{title:t.genre})},{id:"yearFormed",label:"Year formed",cell:t=>e.jsx(S,{title:t.yearFormed.toString()})},{id:"albums",label:"Albums",cell:t=>e.jsx(S,{title:t.albums.toString()})}],{tableProps:i}=p({mode:"complete",getData:()=>j,paginationOptions:{pageSize:5}});return e.jsx(d,{columnConfig:o,...i})}},r={render:()=>{const[o,i]=a.useState(new Set),{tableProps:t}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsx(d,{...t,columnConfig:b,selection:{mode:"multiple",behavior:"toggle",selected:o,onSelectionChange:i},rowConfig:{onClick:n=>alert(`Clicked: ${n.name}`)}})}},s={render:()=>{const[o,i]=a.useState("multiple"),[t,n]=a.useState(new Set),{tableProps:g}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...g,columnConfig:b,selection:{mode:o,behavior:"toggle",selected:t,onSelectionChange:n}}),e.jsxs("div",{children:[e.jsx(C,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection mode:"}),e.jsxs(x,{"aria-label":"Selection mode",orientation:"horizontal",value:o,onChange:u=>{i(u),n(new Set)},children:[e.jsx(m,{value:"single",children:"single"}),e.jsx(m,{value:"multiple",children:"multiple"})]})]})]})}},c={render:()=>{const[o,i]=a.useState("toggle"),[t,n]=a.useState(new Set),{tableProps:g}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...g,columnConfig:b,selection:{mode:"multiple",behavior:o,selected:t,onSelectionChange:n}}),e.jsxs("div",{children:[e.jsx(C,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection behavior:"}),e.jsxs(x,{"aria-label":"Selection behavior",orientation:"horizontal",value:o,onChange:u=>{i(u),n(new Set)},children:[e.jsx(m,{value:"toggle",children:"toggle"}),e.jsx(m,{value:"replace",children:"replace"})]})]})]})}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};const Fe=["TableRockBand","SelectionToggleWithActions","SelectionModePlayground","SelectionBehaviorPlayground"];export{c as SelectionBehaviorPlayground,s as SelectionModePlayground,r as SelectionToggleWithActions,l as TableRockBand,Fe as __namedExportsOrder,ze as default};
