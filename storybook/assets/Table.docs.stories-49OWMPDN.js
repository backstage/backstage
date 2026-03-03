import{j as e,r as a}from"./iframe-BmigQEv-.js";import{t as C,s as b,d as T,a as h}from"./utils-BmfvFU7H.js";import{u as p,T as d,e as j,C as S}from"./useTable-BYxzIGiU.js";import{F as v}from"./Flex-CdYh-JsR.js";import{R as f,a as m}from"./RadioGroup-Dtwx6KHW.js";import{T as x}from"./Text-Driy7dm4.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BfwtKwvN.js";import"./SelectionManager-B7bIZ1KI.js";import"./useFocusable-BuB5xXaU.js";import"./useObjectRef-DzH9hfYh.js";import"./useEvent-NYXPOG5c.js";import"./SelectionIndicator-CRzwq2K-.js";import"./context-C8pK0CiW.js";import"./usePress-BsxPa6gB.js";import"./Hidden-D00btGoB.js";import"./useControlledState-CjikniXx.js";import"./index-BfmsxaqL.js";import"./Checkbox-ByjaaG9q.js";import"./RSPContexts-DpNCO5DG.js";import"./utils-OG8EWMJd.js";import"./Form-BIldA7dg.js";import"./useToggle-QQlpSlY-.js";import"./useFormReset-CZ4LO_Ca.js";import"./useToggleState-1AFSgPPl.js";import"./useFocusRing-J-N53W_a.js";import"./VisuallyHidden-nrBkXVFN.js";import"./InternalLinkProvider-BYf7OWmA.js";import"./VisuallyHidden-DyY1N8kP.js";import"./TablePagination-Cfl7O7uc.js";import"./Select-eIf_gvpC.js";import"./Dialog-DOcWTJtm.js";import"./Button-Cyzio0qg.js";import"./Label-DnipiOYs.js";import"./useLabel-C3PZuLem.js";import"./useLabels-Bh83Byu6.js";import"./useButton-DV9oQ30R.js";import"./OverlayArrow-Bw76-loH.js";import"./Separator-DqkxYER7.js";import"./Text-BQNQuWzZ.js";import"./useLocalizedStringFormatter-BMdm1fdH.js";import"./animation-5LblyQlo.js";import"./FieldError-DDMgT7HY.js";import"./ListBox-CojeUcfX.js";import"./useListState-DRXb__oB.js";import"./useField-Co5JaoMK.js";import"./definition-BUZyKZdQ.js";import"./Autocomplete-tO0AMkK_.js";import"./Input-BwonhVWK.js";import"./SearchField-B_-c0Cu9.js";import"./FieldError-giyJkJ5V.js";import"./FieldLabel-CtHVOG2f.js";import"./ButtonIcon-SNAXtExz.js";import"./Link-BPYLb69p.js";import"./useLink-C9Fj05tI.js";import"./useHighlightSelectionDescription-CkD9OD4K.js";import"./useHasTabbableChild-Cze-mLQG.js";import"./Avatar-DEptAbLN.js";const De={title:"Backstage UI/Table/docs",...C},l={render:()=>{const o=[{id:"name",label:"Band name",isRowHeader:!0,defaultWidth:"4fr",cell:t=>e.jsx(j,{name:t.name,src:t.image,href:t.website})},{id:"genre",label:"Genre",defaultWidth:"4fr",cell:t=>e.jsx(S,{title:t.genre})},{id:"yearFormed",label:"Year formed",defaultWidth:"1fr",cell:t=>e.jsx(S,{title:t.yearFormed.toString()})},{id:"albums",label:"Albums",defaultWidth:"1fr",cell:t=>e.jsx(S,{title:t.albums.toString()})}],{tableProps:i}=p({mode:"complete",getData:()=>T,paginationOptions:{pageSize:5}});return e.jsx(d,{columnConfig:o,...i})}},r={render:()=>{const[o,i]=a.useState(new Set),{tableProps:t}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsx(d,{...t,columnConfig:b,selection:{mode:"multiple",behavior:"toggle",selected:o,onSelectionChange:i},rowConfig:{onClick:n=>alert(`Clicked: ${n.name}`)}})}},s={render:()=>{const[o,i]=a.useState("multiple"),[t,n]=a.useState(new Set),{tableProps:u}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...u,columnConfig:b,selection:{mode:o,behavior:"toggle",selected:t,onSelectionChange:n}}),e.jsxs("div",{children:[e.jsx(x,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection mode:"}),e.jsxs(f,{"aria-label":"Selection mode",orientation:"horizontal",value:o,onChange:g=>{i(g),n(new Set)},children:[e.jsx(m,{value:"single",children:"single"}),e.jsx(m,{value:"multiple",children:"multiple"})]})]})]})}},c={render:()=>{const[o,i]=a.useState("toggle"),[t,n]=a.useState(new Set),{tableProps:u}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...u,columnConfig:b,selection:{mode:"multiple",behavior:o,selected:t,onSelectionChange:n}}),e.jsxs("div",{children:[e.jsx(x,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection behavior:"}),e.jsxs(f,{"aria-label":"Selection behavior",orientation:"horizontal",value:o,onChange:g=>{i(g),n(new Set)},children:[e.jsx(m,{value:"toggle",children:"toggle"}),e.jsx(m,{value:"replace",children:"replace"})]})]})]})}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    const columns: ColumnConfig<Data4Item>[] = [{
      id: 'name',
      label: 'Band name',
      isRowHeader: true,
      defaultWidth: '4fr',
      cell: item => <CellProfile name={item.name} src={item.image} href={item.website} />
    }, {
      id: 'genre',
      label: 'Genre',
      defaultWidth: '4fr',
      cell: item => <CellText title={item.genre} />
    }, {
      id: 'yearFormed',
      label: 'Year formed',
      defaultWidth: '1fr',
      cell: item => <CellText title={item.yearFormed.toString()} />
    }, {
      id: 'albums',
      label: 'Albums',
      defaultWidth: '1fr',
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
}`,...c.parameters?.docs?.source}}};const ye=["TableRockBand","SelectionToggleWithActions","SelectionModePlayground","SelectionBehaviorPlayground"];export{c as SelectionBehaviorPlayground,s as SelectionModePlayground,r as SelectionToggleWithActions,l as TableRockBand,ye as __namedExportsOrder,De as default};
