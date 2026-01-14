import{j as e,r as a}from"./iframe-OUC1hy1H.js";import{t as T,u as p,T as d,s as b,e as f,C as S,f as j,g as h}from"./utils-D8ATIzPs.js";import{F as v}from"./Flex-BhlKuQ9v.js";import{R as x,a as m}from"./RadioGroup-B7OIQF9C.js";import{T as C}from"./Text-CP74jZ5O.js";import"./preload-helper-PPVm8Dsz.js";import"./useStyles-BaONCSkE.js";import"./clsx-B-dksMZM.js";import"./useListState-D5IbOxW1.js";import"./useFocusable-TT6djGBW.js";import"./useObjectRef-6gXwUxt0.js";import"./usePress-wO8QA_B4.js";import"./useEvent-BZfwiQXr.js";import"./SelectionIndicator-GcOcAfXg.js";import"./context-C5aqG8tU.js";import"./Hidden-C-0yicsS.js";import"./useControlledState-Cm9f7dTu.js";import"./index-D4oTCeTJ.js";import"./Checkbox-BPP2tKxP.js";import"./RSPContexts-DTR_CgGN.js";import"./utils-DXBqo5Xm.js";import"./Form-CRz3e8en.js";import"./useToggle-BwfQSQJo.js";import"./useFormReset-CTJRwYEg.js";import"./useToggleState-BaUXBUSS.js";import"./useFocusRing-DYgZMWSG.js";import"./VisuallyHidden-Ei8gg8WB.js";import"./isExternalLink-DzQTpl4p.js";import"./index-_R9_qqkB.js";import"./VisuallyHidden-C7xqrtb0.js";import"./TablePagination-hyop9GeM.js";import"./Select-D5NgVqK4.js";import"./Dialog-uUCAa6hr.js";import"./ListBox-E-dXpkna.js";import"./Text-at0_7CvX.js";import"./useLabel-ItSB4Rxf.js";import"./useLabels-DvFaAZZI.js";import"./useLocalizedStringFormatter-CXd1jwaQ.js";import"./Button-0VEB2ZkT.js";import"./Label-DZa06QgM.js";import"./useButton-CmJkajli.js";import"./OverlayArrow-BWeCpfBx.js";import"./FieldError-BB3z4Kss.js";import"./Input-Kbb3INx1.js";import"./SearchField-Dd_C4NK6.js";import"./FieldLabel-CFTOZnI4.js";import"./FieldError-CkQNCPeW.js";import"./ButtonIcon-BpCu2_qs.js";import"./Button.module-DkEJAzA0.js";import"./Link-HrzVlePL.js";import"./useLink-DpZPl6hF.js";import"./Avatar-Bym06QmZ.js";import"./useHighlightSelectionDescription-gvqDAUIm.js";import"./useHasTabbableChild-BfXAeP-A.js";import"./useSurface-B0ayTmJO.js";const Be={title:"Backstage UI/Table/docs",...T},l={render:()=>{const o=[{id:"name",label:"Band name",isRowHeader:!0,cell:t=>e.jsx(f,{name:t.name,src:t.image,href:t.website})},{id:"genre",label:"Genre",cell:t=>e.jsx(S,{title:t.genre})},{id:"yearFormed",label:"Year formed",cell:t=>e.jsx(S,{title:t.yearFormed.toString()})},{id:"albums",label:"Albums",cell:t=>e.jsx(S,{title:t.albums.toString()})}],{tableProps:n}=p({mode:"complete",getData:()=>j,paginationOptions:{pageSize:5}});return e.jsx(d,{columnConfig:o,...n})}},r={render:()=>{const[o,n]=a.useState(new Set),{tableProps:t}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsx(d,{...t,columnConfig:b,selection:{mode:"multiple",behavior:"toggle",selected:o,onSelectionChange:n},rowConfig:{onClick:i=>alert(`Clicked: ${i.name}`)}})}},s={render:()=>{const[o,n]=a.useState("multiple"),[t,i]=a.useState(new Set),{tableProps:g}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...g,columnConfig:b,selection:{mode:o,behavior:"toggle",selected:t,onSelectionChange:i}}),e.jsxs("div",{children:[e.jsx(C,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection mode:"}),e.jsxs(x,{"aria-label":"Selection mode",orientation:"horizontal",value:o,onChange:u=>{n(u),i(new Set)},children:[e.jsx(m,{value:"single",children:"single"}),e.jsx(m,{value:"multiple",children:"multiple"})]})]})]})}},c={render:()=>{const[o,n]=a.useState("toggle"),[t,i]=a.useState(new Set),{tableProps:g}=p({mode:"complete",getData:()=>h,paginationOptions:{pageSize:10}});return e.jsxs(v,{direction:"column",gap:"8",children:[e.jsx(d,{...g,columnConfig:b,selection:{mode:"multiple",behavior:o,selected:t,onSelectionChange:i}}),e.jsxs("div",{children:[e.jsx(C,{as:"h4",style:{marginBottom:"var(--bui-space-2)"},children:"Selection behavior:"}),e.jsxs(x,{"aria-label":"Selection behavior",orientation:"horizontal",value:o,onChange:u=>{n(u),i(new Set)},children:[e.jsx(m,{value:"toggle",children:"toggle"}),e.jsx(m,{value:"replace",children:"replace"})]})]})]})}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};const Pe=["TableRockBand","SelectionToggleWithActions","SelectionModePlayground","SelectionBehaviorPlayground"];export{c as SelectionBehaviorPlayground,s as SelectionModePlayground,r as SelectionToggleWithActions,l as TableRockBand,Pe as __namedExportsOrder,Be as default};
